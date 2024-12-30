import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './HistoricalScores.css';
import { BsFiletypeXls, BsFiletypeXlsx } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa6';
// import font from "./NotoSansDevanagari-Regular"
import font from "./Arial-Unicode-MS.js";
import { useLocation } from 'react-router-dom';
import { PiExport, PiFileCsv, PiFilePdfLight, PiFileXls } from 'react-icons/pi';
import { FaChevronDown, FaPlay, FaPause } from 'react-icons/fa';

const HistoricalScores = () => {
  const { jobId: clientJobId, userId } = useParams();
  const [interviewScores, setInterviewScores] = useState([]);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null); // Track which interview is expanded
  const [dropdownOpen, setDropdownOpen] = useState(false);   // Track which attempt is expanded    // Track which attempt is expanded
  const [expandedAttemptId, setExpandedAttemptId] = useState(null);
  const [interviewDetails, setInterviewDetails] = useState({});
  const [jobName, setJobName] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const candidateName = queryParams.get('candidateName');
  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true); // Loading state for job name
  const [scoresLoading, setScoresLoading] = useState(true); // Loading state for scores
  const [audioStates, setAudioStates] = useState({});
  const [videoStates, setVideoStates] = useState({});
  const audioRefs = useRef({});

  const getPresignedUrl = useCallback(async (fileUrl) => {
    try {
      const fileName = fileUrl.split('/').pop();
      const urlParts = new URL(fileUrl);
      const bucketName = urlParts.hostname.split('.')[0];

      // Determine the folder structure based on file type
      let fileKey;
      if (fileUrl.includes('/uploads/videos/')) {
        fileKey = `uploads/videos/${fileName}`; // Adjust for video files
      } else {
        fileKey = fileName;
      }

      const response = await fetch(getApiUrl('/api/scores/get-presigned-url'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bucketName, fileKey }),
      });

      const data = await response.json();
      return {
        url: data.presignedUrl,
        expiryTime: Date.now() + 3600000 // URL expires in 1 hour
      };
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      return null;
    }
  }, []);

  // Fetch interview details
  const fetchInterviewDetails = async (interviewId) => {
    try {
      const response = await fetch(getApiUrl(`/api/interviews/client-job-interview/${interviewId}/details`));
      const data = await response.json();

      console.log('Interview details:', data);
      // response type : 
      console.log('Response type : ', data.interviewData.interview.instructions.interview_response_type);
      return data.interviewData;
    } catch (error) {
      console.error('Error fetching interview details:', error);
      return null;
    }
  };

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      Object.values(audioStates).forEach(state => {
        if (state.audio) {
          // state.audio.pause();
          state.audio.src = '';
        }
      });
    };
  }, []);

  useEffect(() => {
    const fetchJobName = async () => {
      try {
        const jobDetailsResponse = await fetch(getApiUrl(`/api/client-jobs/${clientJobId}`));
        const jobDetailsData = await jobDetailsResponse.json();
        setJobName(jobDetailsData.job_title);

      } catch (error) {
        console.error('Error fetching applicant reports:', error);
      } finally {
        setJobLoading(false); // Set jobLoading to false once job name is fetched
      }
    };

    fetchJobName();
  }, [clientJobId]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/scores/historical-scores/${userId}/${clientJobId}`));
        const data = await response.json();
        console.log('Historical Scores:', data);
        if (!data.interviews) {
          console.error('No interviews found in the response.');
          return;
        }

        const interviewDetailsPromises = data.interviews.map(async (interview) => await fetchInterviewDetails(interview.clientJobInterviewId));
        const interviewDetailsArray = await Promise.all(interviewDetailsPromises);
        const interviewDetailsMap = interviewDetailsArray.reduce((acc, details, index) => {
          acc[data.interviews[index].clientJobInterviewId] = details;
          return acc;
        }, {});
        // console.log('Interview details map:', interviewDetailsMap);
        setInterviewDetails(interviewDetailsMap);

        const filteredInterviews = data.interviews.map(interview => {
          // get corresponding interview details
          const details = interviewDetailsMap[interview.clientJobInterviewId];
          console.log(`Interview details for for interview with id ${interview.clientJobInterviewId}:`, details);
          // extract response type from details if available 
          const responseType = details?.interview?.instructions?.interview_response_type || null;
          const filteredAttempts = interview.attempts.filter(attempt =>
            attempt.interviewLevelEvaluation.length > 0 || attempt.questionLevelEvaluation.length > 0
          ).map(attempt => {
            const attemptWithResponseType = { ...attempt, responseType };
            attemptWithResponseType.questionLevelEvaluation.sort((a, b) => a.questionOrder - b.questionOrder);
            attemptWithResponseType.interviewResponseDetails.sort((a, b) => a.questionOrder - b.questionOrder);  // Sort transcript data as well
            return attemptWithResponseType;
          });
          return { ...interview, responseType, attempts: filteredAttempts };
        }).filter(interview => interview.attempts.length > 0).sort((a, b) => a.interviewOrder - b.interviewOrder);
        console.log('Filtered interviews:', filteredInterviews);

        console.log(filteredInterviews);
        setInterviewScores(filteredInterviews);

        // Generate pre-signed URLs for videos
        const newVideoStates = {};
        for (const interview of filteredInterviews) {
          for (const attempt of interview.attempts) {
            if (attempt.videoUrl) {
              const presignedData = await getPresignedUrl(attempt.videoUrl);
              if (presignedData) {
                newVideoStates[attempt.attemptId] = {
                  video: presignedData.url,
                  expiryTime: presignedData.expiryTime,
                };
              }
            }
          }
        }
        console.log('Video states:', newVideoStates);
        setVideoStates(newVideoStates);

        const newAudioStates = {};
        for (const interview of filteredInterviews) {
          for (const attempt of interview.attempts) {
            if (attempt.responseType === 'audio') {
              for (const question of attempt.questionLevelEvaluation) {
                const audioUrl = question.audioUrl;
                if (audioUrl) {
                  const presignedData = await getPresignedUrl(audioUrl);
                  if (presignedData) {
                    const audioId = audioUrl;
                    newAudioStates[audioId] = {
                      audio: presignedData.url,
                      isPlaying: false, expiryTime: presignedData.expiryTime
                    };
                  }
                }
              }
              for (const question of attempt.interviewResponseDetails) {
                const audioUrl = question.audioUrl;
                if (audioUrl) {
                  const presignedData = await getPresignedUrl(audioUrl);
                  if (presignedData) {
                    const audioId = audioUrl
                    newAudioStates[audioId] = {
                      audio: presignedData.url,
                      isPlaying: false, expiryTime: presignedData.expiryTime
                    };
                  }
                }
              }
            }
          }
        }
        console.log('Audio states:', newAudioStates);
        setAudioStates(newAudioStates);
      } catch (error) {
        console.error('Error fetching historical scores:', error);
      } finally {
        setScoresLoading(false); // Set scoresLoading to false once scores are fetched
      }
    };

    fetchScores();
  }, [userId, clientJobId]);

  useEffect(() => {
    // Set overall loading to false only when both job name and scores are loaded
    if (!jobLoading && !scoresLoading) {
      setLoading(false);
    }
  }, [jobLoading, scoresLoading]);

  // Helper function to render feedback
  const renderFeedback = (feedback) => {
    if (!feedback) {
      return 'No feedback available';
    }

    if (typeof feedback === 'string') {
      return feedback;
    } else if (feedback.type === 'json' && Array.isArray(feedback.content)) {
      return (
        <ul>
          {feedback.content.map((item, index) => (
            <li key={index}>
              <strong>{item.label}:</strong> {item.content}
            </li>
          ))}
        </ul>
      );
    } else if (feedback.type === 'text') {
      return feedback.content;
    }

    return 'Unknown feedback format';
  };

  const toggleInterview = (interviewId) => {
    setExpandedInterviewId(interviewId === expandedInterviewId ? null : interviewId);
    setExpandedAttemptId(null);
  };

  const toggleAttempt = (attemptId) => {
    setExpandedAttemptId(attemptId === expandedAttemptId ? null : attemptId);
  };

  const renderAudioControl = (audioUrl, attemptId, questionOrder) => {
    if (!audioUrl) return <span>No audio was recorded for this question</span>;

    const audioId = audioUrl;
    const audioState = audioStates[audioId];

    return (
      <div className="audio-player">
        <audio
          ref={(audio) => audioRefs.current[audioId] = audio}
          src={audioState.audio}
          controls
          onPlay={() => {
            Object.entries(audioRefs.current).forEach(([id, ref]) => {
              if (id !== audioId && ref) {
                ref.pause();
              }
            });
            audioRefs.current[audioId].play();
          }}
        >
        </audio>
      </div>
    );
  };

  const renderVideoPlayer = (videoUrl, attemptId) => {
    if (!videoUrl) return <span>No video recorded for this attempt</span>;
  
    const videoState = videoStates[attemptId];
    if (!videoState?.video) return <span>Loading video...</span>;
  
    return (
      <div className="video-player">
        <video
          src={videoState.video}
          controls
          width="100%"
          style={{ margin: '10px 0' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const renderQuestionRow = (response, attempt) => (
    <tr key={`${attempt.attemptId}-${response.questionOrder}`}>
      <td>{`Q${response.questionOrder}: ${response.questionText}`}</td>
      <td>{response.userResponse || 'No response available'}</td>
      {attempt.responseType === 'audio' && (
        <td style={{ textAlign: 'center' }}>
          {renderAudioControl(response.audioUrl, attempt.attemptId, response.questionOrder)}
        </td>
      )}
    </tr>
  );

  // Export to Excel
  const exportToExcel = () => {
    const exportData = interviewScores.map(interview => {
      return interview.attempts.flatMap(attempt => [
        ...attempt.interviewLevelEvaluation.map(evalItem => ({
          interviewName: interview.interviewName,
          attemptDate: new Date(attempt.attemptDate).toLocaleString(),
          question: 'N/A',
          evaluationCategory: evalItem.evaluationCategoryName,
          response: 'N/A',
          feedback: evalItem.feedback ? formatFeedbackForExport(evalItem.feedback) : 'N/A',
          score: evalItem.score,
        })),
        ...attempt.questionLevelEvaluation
          .sort((a, b) => a.questionOrder - b.questionOrder)
          .map(evalItem => ({
            interviewName: interview.interviewName,
            attemptDate: new Date(attempt.attemptDate).toLocaleString(),
            question: `Q${evalItem.questionOrder}: ${evalItem.questionText}`,
            evaluationCategory: evalItem.evaluationCategoryName,
            response: evalItem.userResponse || '',
            feedback: evalItem.feedback ? evalItem.feedback.content : 'N/A',
            score: evalItem.score,
          })),
        // Transcript data if question level evaluation is missing
        ...(attempt.questionLevelEvaluation.length === 0 ? attempt.interviewResponseDetails
          .sort((a, b) => a.questionOrder - b.questionOrder)
          .map(response => ({
            interviewName: interview.interviewName,
            attemptDate: new Date(attempt.attemptDate).toLocaleString(),
            question: `Q${response.questionOrder}: ${response.questionText}`,
            evaluationCategory: 'N/A',
            response: response.userResponse || 'No response available',
            feedback: 'N/A',
            score: 'N/A',
          })) : [])
      ]);
    }).flat();

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Scores');
    writeFile(workbook, `Interview_Scores_${jobName}_${candidateName}.xlsx`);
  };

  const renderFeedbackContent = (feedbackContent) => {
    if (!Array.isArray(feedbackContent)) return feedbackContent || 'N/A';

    // If it's an array, format the content properly with labels
    return feedbackContent.map(item => `${item.label}: ${item.content}`).join('\n');
  };
  const formatFeedbackForExport = (feedback) => {
    if (!feedback) return 'No feedback available';

    if (feedback.type === 'json' && Array.isArray(feedback.content)) {
      // If the feedback is JSON, convert it to a string with label and content
      return feedback.content.map(item => `${item.label}: ${item.content}`).join('\n');
    }

    if (typeof feedback.content === 'string') {
      return feedback.content;
    }

    return 'Unknown feedback format';
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();

    doc.addFileToVFS('ArialUnicodeMS.ttf', font);
    doc.addFont('ArialUnicodeMS.ttf', 'ArialUnicodeMS', 'normal');
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 15;
    const marginBottom = 20;
    const sectionSpacing = 25;

    doc.setFont('ArialUnicodeMS');
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("Interview Scores", 14, 20);

    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text("Job Name:", 14, 30);
    doc.setFont(undefined, 'bold');
    doc.text(jobName, 70, 30);

    doc.setFont(undefined, 'normal');
    doc.text("Candidate Name:", 14, 40);
    doc.setFont(undefined, 'bold');
    doc.text(candidateName, 70, 40);
    let currentY = 50;

    const checkPageSpace = (requiredSpace) => {
      if (currentY + requiredSpace > pageHeight - footerHeight - marginBottom) {
        doc.addPage();
        currentY = 20;
      }
    };

    interviewScores.forEach(interview => {
      interview.attempts.forEach(attempt => {
        const interviewName = interview.interviewName || "N/A";
        const attemptDate = attempt.attemptDate ? new Date(attempt.attemptDate).toLocaleString() : "N/A";

        checkPageSpace(50);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Interview: ${interviewName}`, 14, currentY);
        currentY += 8;
        doc.setFont(undefined, 'normal');
        doc.text(`Attempt Date: ${attemptDate}`, 14, currentY);

        currentY += 12;

        if (attempt.interviewLevelEvaluation.length > 0) {
          checkPageSpace(80);

          doc.autoTable({
            startY: currentY,
            head: [
              [
                { content: 'Criteria', styles: { font: 'ArialUnicodeMS' } },
                { content: 'Score', styles: { font: 'ArialUnicodeMS', halign: 'right' } },
                { content: 'Feedback', styles: { font: 'ArialUnicodeMS' } }
              ]
            ],
            body: attempt.interviewLevelEvaluation.map(evalItem => [
              {
                content: evalItem.evaluationCategoryName,
                styles: { font: detectLanguage(evalItem.evaluationCategoryName) }
              },
              {
                content: evalItem.score,
                styles: { font: 'ArialUnicodeMS', halign: 'right' }
              },
              {
                content: renderFeedbackContent(evalItem.feedback?.content),
                styles: { font: detectLanguage(evalItem.feedback?.content) }
              }
            ]),
            theme: 'striped',
            headStyles: { fillColor: [255, 246, 35], textColor: [0, 0, 0] },
            bodyStyles: { fillColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 10, bottom: footerHeight + 10 },
            styles: { font: 'ArialUnicodeMS', color: '#000' }
          });

          currentY = doc.lastAutoTable.finalY + 12;
        }


        if (attempt.questionLevelEvaluation.length > 0) {
          checkPageSpace(100); // Check space before adding table
          const evaluationCategoryName = attempt.questionLevelSummary?.evaluationCategoryName || 'N/A';
          const totalScore = attempt.questionLevelSummary?.totalScore || 'N/A';

          doc.setFont(undefined, 'bold');
          doc.text(`Individual Question Evaluation`, 14, currentY);
          currentY += 8;
          doc.setFont(undefined, 'bold');
          doc.text(`Evaluation Category: ${evaluationCategoryName}`, 14, currentY);
          currentY += 8;

          doc.text(`Total Score: ${totalScore}`, 14, currentY);
          currentY += 12;

          doc.setFont(undefined, 'normal');

          const headerRow = [
            { content: 'Question', styles: { font: 'ArialUnicodeMS' } },
            { content: 'Evaluation Category', styles: { font: 'ArialUnicodeMS' } },
            { content: 'Response', styles: { font: 'ArialUnicodeMS' } },
            { content: 'Feedback', styles: { font: 'ArialUnicodeMS' } },
            { content: 'Score', styles: { font: 'ArialUnicodeMS', halign: 'right' } }
          ];

          doc.autoTable({
            startY: currentY,
            head: [headerRow],
            body: [
              ...attempt.questionLevelEvaluation.map(evalItem => [
                {
                  content: `Q${evalItem.questionOrder}: ${evalItem.questionText}`,
                  styles: { font: detectLanguage(evalItem.questionText) }
                },
                { content: evalItem.evaluationCategoryName || 'N/A', styles: { font: detectLanguage(evalItem.evaluationCategoryName) } },
                { content: evalItem.userResponse || 'N/A', styles: { font: detectLanguage(evalItem.userResponse) } },
                { content: renderFeedbackContent(evalItem.feedback?.content), styles: { font: detectLanguage(evalItem.feedback?.content) } },
                { content: evalItem.score, styles: { font: 'ArialUnicodeMS', halign: 'right' } }
              ])
            ],
            theme: 'grid',
            headStyles: { fillColor: [255, 246, 35], textColor: [0, 0, 0] },
            margin: { top: 10, bottom: footerHeight + 10 }
          });

          currentY = doc.lastAutoTable.finalY + 12;
        } else if (attempt.interviewResponseDetails.length > 0) {
          checkPageSpace(100);  // Ensure there's enough space for the transcript section

          doc.setFont(undefined, 'bold');
          doc.text(`Interview Transcripts`, 14, currentY);
          currentY += 8;

          // Define the headers for the transcript table
          const transcriptHeaderRow = [
            { content: 'Question', styles: { font: 'ArialUnicodeMS' } },
            { content: 'User Response', styles: { font: 'ArialUnicodeMS' } }
          ];

          // Add the table for transcripts (only 2 columns: Question and User Response)
          doc.autoTable({
            startY: currentY,
            head: [transcriptHeaderRow],
            body: attempt.interviewResponseDetails
              .sort((a, b) => a.questionOrder - b.questionOrder)
              .map((response) => [
                {
                  content: `Q${response.questionOrder}: ${response.questionText}`,
                  styles: { font: detectLanguage(response.questionText) }
                },
                {
                  content: response.userResponse || 'No response available',
                  styles: { font: detectLanguage(response.userResponse) }
                }
              ]),
            theme: 'grid',
            headStyles: { fillColor: [255, 246, 35], textColor: [0, 0, 0] }, // Styling similar to question evaluation
            margin: { top: 10, bottom: footerHeight + 10 }
          });

          currentY = doc.lastAutoTable.finalY + 12;
        }

        currentY += sectionSpacing; // Add extra space between attempts
      });
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Generated By- Pehchaan AI Technologies (for more info visit pehchaan.me )', doc.internal.pageSize.width / 2, pageHeight - 10, {
        align: 'center'
      });
    }

    doc.save(`Interview_Scores_${jobName}_${candidateName}.pdf`);
  };


  const detectLanguage = (text) => {
    const hindiRegex = /[\u0900-\u097F]/;
    return hindiRegex.test(text) ? 'ArialUnicodeMS' : 'ArialUnicodeMS';
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleExport = (format) => {
    setDropdownOpen(false);
    switch (format) {
      case 'pdf':
        exportToPDF();
        break;
      case 'excel':
        exportToExcel();
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">Loading interview scores, please wait...</p>
      </div>
    );
  }


  return (
    <div className="historical-scores-page-container">
      <header className="signup-navbar">
        <div className="poppins-regular">
          <div>
            <Link to="/" className="logo">
              <span className="logo">
                <span className="logo-peh">Peh</span>
                <span className="logo-chaan">chaan</span>
              </span>
            </Link>
          </div>
          <div>
            <Link to="/client-dashboard" className="job-listings-nav">Job Listings</Link>
            &gt;{" "}
            <Link to={`/client-jobs/${clientJobId}/candidates-list`} className="job-listings-nav">
              {jobName} [All Candidates]
            </Link>
            &gt;{" "}
            <Link to={`/client-jobs/${clientJobId}/applicant-reports`} className="job-listings-nav">
              Scores
            </Link>
            &gt;{" "}
            Assessment Details
          </div>
        </div>
        <div className="export">
          <button className="btn poppins-medium" onClick={toggleDropdown}>
            <PiExport style={{ fontSize: '20px', color: '#fff623' }} />
            Export
            <FaChevronDown />
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu poppins-medium">
              <button onClick={() => handleExport('pdf')}>
                <PiFilePdfLight style={{ fontSize: '20px', color: '#fff623' }} /> PDF
              </button>
              <button onClick={() => handleExport('excel')}>
                <PiFileXls style={{ fontSize: '20px', color: '#fff623' }} /> Excel
              </button>
            </div>
          )}
        </div>
      </header>
      <h3 className='candidate-name poppins-medium'>{candidateName}'s Attempts</h3>
      {interviewScores.length === 0 ? (
        <p>No completed interview attempts found.</p>
      ) : (
        interviewScores.map(interview => (
          <div key={interview.clientJobInterviewId} className="interview-section">
            <button
              className="interview-toggle poppins-medium"
              onClick={() => toggleInterview(interview.clientJobInterviewId)}
            >
              {interview.interviewName}
              {/* <p>{`Response Type : ${interview.responseType.charAt(0).toUpperCase() + interview.responseType.slice(1)}`}</p> */}
            </button>

            {expandedInterviewId === interview.clientJobInterviewId && (
              <div className="interview-details">
                {interview.attempts.map(attempt => (
                  <div key={attempt.attemptId}>
                    <button
                      className="attempt-toggle poppins-medium"
                      onClick={() => toggleAttempt(attempt.attemptId)}
                    >
                      <div>Attempt on {new Date(attempt.attemptDate).toLocaleString()}</div>
                      <div>Status: {attempt.status}</div>
                      <div>Question Set: {attempt.questionSetAttempted}</div>
                      <div
                        style={{
                          color: attempt.tabSwitchCount > 0 ? "red" : "green",
                          fontWeight: "bold",
                        }}
                      >
                        Times Candidate Switched Tabs:{" "}
                        {attempt.tabSwitchCount > 0
                          ? `${attempt.tabSwitchCount} time${attempt.tabSwitchCount > 1 ? "s" : ""}`
                          : "None"}
                      </div>
                    </button>

                    {expandedAttemptId === attempt.attemptId && (
                      <div className="attempt-details">
                        {/* Render the video player at the top */}
                        {attempt.videoUrl && (
                          <div className="video-section">
                            <h3 className="poppins-medium">Interview Video</h3>
                            <video className="video-player" controls>
                              <source src={videoStates[attempt.attemptId]?.video} type="video/webm" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                        {attempt.interviewLevelEvaluation.length > 0 && (
                          <div>
                            <h3 className="poppins-medium">Interview Level Evaluation</h3>
                            <table className="evaluation-table poppins-regular">
                              <thead>
                                <tr>
                                  <th>Scoring Criteria</th>
                                  <th>Feedback</th>
                                  <th>Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                {attempt.interviewLevelEvaluation.map((evalItem, index) => (
                                  <tr key={index}>
                                    <td>{evalItem.evaluationCategoryName}</td>
                                    <td>{renderFeedback(evalItem.feedback)}</td>
                                    <td>{evalItem.score}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {attempt.questionLevelSummary && attempt.questionLevelEvaluation.length > 0 ? (
                          <div className="question-level-summary">
                            <h3 className="poppins-medium">
                              Question Level Evaluation (Scoring Criteria: {attempt.questionLevelSummary.evaluationCategoryName})
                            </h3>
                            <div className="total-score-row">
                              <span className="total-score-label">Total Score: </span>
                              <span className="total-score-value">{attempt.questionLevelSummary.totalScore}</span>
                            </div>
                            <table className="evaluation-table poppins-regular">
                              <thead>
                                <tr>
                                  <th>Question</th>
                                  <th>User Response</th>
                                  <th>Feedback</th>
                                  <th>Score</th>
                                  {attempt.responseType === 'audio' && (
                                    <th>Audio</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {attempt.questionLevelEvaluation.map((evalItem, index) => (
                                  <tr key={index}>
                                    <td>{evalItem.questionOrder ? `Q${evalItem.questionOrder}: ${evalItem.questionText}` : ''}</td>
                                    <td>{evalItem.userResponse || ''}</td>
                                    <td>{evalItem.questionOrder ? renderFeedback(evalItem.feedback) : ''}</td>
                                    <td>{evalItem.score}</td>
                                    {attempt.responseType === 'audio' && <td>
                                      {evalItem.audioUrl && renderAudioControl(evalItem.audioUrl, attempt.attemptId, evalItem.questionOrder)}
                                    </td>}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          attempt.interviewResponseDetails.length > 0 && (
                            <div className="question-level-summary">
                              <h3>Interview Transcripts</h3>
                              <table className="evaluation-table">
                                <thead>
                                  <tr>
                                    <th>Question</th>
                                    <th>User Response</th>
                                    {attempt.responseType === 'audio' && (
                                      <th>Audio</th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {attempt.interviewResponseDetails.map((response, index) => { console.log('attempt', attempt); return renderQuestionRow(response, attempt) })}
                                </tbody>
                              </table>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HistoricalScores;
