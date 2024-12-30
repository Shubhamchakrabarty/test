import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { FaMicrophone, FaStop, FaUpload, FaDotCircle, FaPlay, FaPause } from 'react-icons/fa';
import io from 'socket.io-client';
import recordingGif from '../assets/recordingGif.gif';
import WaveSurfer from "wavesurfer.js";
import { AiFillBackward, AiFillForward } from 'react-icons/ai';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { MdOutlineFileUpload, MdReplay } from 'react-icons/md';
import Timer from './Timer';
import './AudioUpload.css'
import InstructionsModal from './InstructionsModal'
import Modal from './Modal';
import ProgressBar from './ProgressBar'

const AudioUploadForm = () => {
  const { clientJobInterviewID } = useParams();
  const { user } = useContext(UserContext);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const jobIdRef = useRef(0);
  const navigate = useNavigate();
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef(null);
  // const interviewIntervalRef = useRef(null);
  const questionIntervalRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const waveformRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal] = useState(true);
  // const [timeLeft, setTimeLeft] = useState(MAX_DURATION);
  const [hasTimeRunOut, setHasTimeRunOut] = useState(false);
  // const [interviewTimeLeft, setInterviewTimeLeft] = useState(0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [interviewDetails, setInterviewDetails] = useState(null);
  // const [previousInterviewTimeLeft, setPreviousInterviewTimeLeft] = useState(null);
  const userClientJobInterviewAttemptIdRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const blobRef = useRef(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [instructionDetails, setInstructionDetails] = useState(null);
  const [startFirstVideo, setStartFirstVideo] = useState(false);
  const iframeRef = useRef(null);
  const videoRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeUpModalOpen, setIsTimeUpModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ headerText: '', bodyText: '', buttonText: '' });
  const [timeUpModalContent, setTimeUpModalContent] = useState({ headerText: '', bodyText: '', buttonText: '' });
  const [typedResponse, setTypedResponse] = useState('');
  const typedResponseRef = useRef('');
  //For video Recording
  const [videoMediaStream, setVideoMediaStream] = useState(null);
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);  // Collects the recorded video data
  const isMultipartUploadRef = useRef(false);
  const uploadIdRef = useRef(null);
  const fileKeyRef = useRef(null);
  const partsRef = useRef([]); // To store ETag and PartNumber for multipart
  const totalVideoSizeRef = useRef(0); // Track total size of the recorded video
  const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB
  let partNumber = 1; // Track part number globally
  const finalFileUrlRef = useRef(null);
  const finalFileSizeRef = useRef(null);
  const tabSwitchCountRef = useRef(0); // Initialize the counter


  useEffect(() => {
    const socketConnection = io(getApiUrl('/'));
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleAccept = () => {
    setTimerStarted(true);
    setShowModal(false);
    setStartFirstVideo(true);

    // Start recording the video here
    if (videoMediaStream) {
      mediaRecorderRef.current = new MediaRecorder(videoMediaStream, { mimeType: 'video/webm' });
      mediaRecorderRef.current.ondataavailable = handleVideoDataAvailable;
      mediaRecorderRef.current.onstop = handleVideoStop;

      mediaRecorderRef.current.start(1000); // Collect data every second (adjust as needed)
    }
  };

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const interviewResponse = await fetch(getApiUrl(`/api/interviews/client-job-interview/${clientJobInterviewID}/details?userId=${user.id}`));
        const { interviewData, questionSetSelected } = await interviewResponse.json();

        console.log("Interview Instructions", interviewData.interview.instructions);
        console.log("Interview Question Set", questionSetSelected);

        if (!interviewData) {
          console.error('No interview data found.');
          return;
        }

        //Code for testing
        // Hardcode the interview_response_type to 'text' to test the text-based flow
        //interviewData.interview.instructions.interview_response_type = 'text';  // Force it to text-based

        setInterviewDetails(interviewData.interview);

        console.log("Interview Response Type:", interviewDetails?.instructions?.interview_response_type);

        const sortedQuestions = interviewData.interview.interview_questions.sort((a, b) => a.question_order - b.question_order);
        console.log("Sorted Questions", sortedQuestions);

        // Preload the Vimeo iframe for the first video
        if (sortedQuestions.length > 0 && iframeRef.current) {
          const firstVideoUrl = sortedQuestions[0].question.media_url;
          iframeRef.current.src = `${firstVideoUrl}?&title=0&byline=0&portrait=0&dnt=1&controls=1&autoplay=0&loop=0`;
        }

        // Preload only subsequent videos (Question 2 onwards)
        sortedQuestions.forEach((question, index) => {
          if (index > 0) {  // Skip the first video (already handled)
            const videoUrl = question.question.media_url;
            const hiddenIframe = document.createElement('iframe');
            hiddenIframe.src = `${videoUrl}?&title=0&byline=0&portrait=0&dnt=1&controls=1&autoplay=0&loop=0`;
            hiddenIframe.style.display = 'none';  // Hide the iframe from the user
            document.body.appendChild(hiddenIframe);  // Preload iframe but don’t show it
          }
        });


        setQuestions(sortedQuestions);
        // setInterviewTimeLeft(interviewData.interview.interview_time_limit);
        setQuestionTimeLeft(interviewData.interview.time_limit_per_answer);
        // setPreviousInterviewTimeLeft(interviewData.interview.interview_time_limit); // Set initial interview time left
        jobIdRef.current = interviewData.job_id;
        console.log("jobId", jobIdRef.current);
        setInstructionDetails(interviewData.interview.instructions);


        // Create a new interview attempt
        const attemptResponse = await fetch(getApiUrl('/api/interview-attempt'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            client_job_interview_id: clientJobInterviewID,
            question_set_attempted: questionSetSelected
          }),
        });

        if (!attemptResponse.ok) {
          throw new Error('Failed to create interview attempt');
        }

        const attemptData = await attemptResponse.json();
        userClientJobInterviewAttemptIdRef.current = attemptData.id;
        console.log('Interview Attempt Created:', attemptData);
        console.log('userClientJobInterviewAttemptId:', userClientJobInterviewAttemptIdRef.current);

      } catch (error) {
        console.error('Error fetching interview details:', error);
      } finally {
        setInitialLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchInterviewDetails();
  }, [clientJobInterviewID, user]);

  useEffect(() => {
    if (startFirstVideo && iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = `${currentSrc}&autoplay=1`;
    }
  }, [startFirstVideo]);


  useEffect(() => {
    // This effect will run when the current question changes
    if (currentQuestionIndex > 0 && iframeRef.current) {
      // Ensure autoplay for subsequent videos
      const currentSrc = questions[currentQuestionIndex].question.media_url;
      iframeRef.current.src = `${currentSrc}?&title=0&byline=0&portrait=0&dnt=1&controls=1&autoplay=1&loop=0`;
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    console.log("questions length: ", questions.length);
    console.log("interviewDetails: ", interviewDetails);
    console.log("interviewDetails.time_limit_per_answer: ", interviewDetails?.time_limit_per_answer);
    // Start the question timer as soon as the question loads
    if (timerStarted && questions.length > 0) {
      setQuestionTimeLeft(interviewDetails.time_limit_per_answer);
      // setPreviousInterviewTimeLeft(interviewTimeLeft); // Update the previous time before starting the next question

      questionIntervalRef.current = setInterval(() => {
        setQuestionTimeLeft((prevTimeLeft) => {
          //console.log("Timer decrement: ", prevTimeLeft); // Log each decrement
          if (prevTimeLeft <= 1) {
            clearInterval(questionIntervalRef.current);
            setHasTimeRunOut(true);
            handleTimeUp();
            return 0;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);

      return () => clearInterval(questionIntervalRef.current);
    }
  }, [timerStarted, questions, currentQuestionIndex, interviewDetails]);


  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMediaStream(stream);
      } catch (error) {
        console.error('Error getting media stream:', error);
      }
    };

    getMediaStream();

    // Cleanup on component unmount
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Function to start video stream
    const startVideoStream = async () => {
      try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // Mute the local video element
        }

        // Store the stream for use with MediaRecorder
        setVideoMediaStream(stream);

        setInitialLoading(false); // Once stream is ready, hide loading
      } catch (error) {
        console.error('Error accessing the camera:', error);
        setInitialLoading(false); // Hide loading on error as well
      }
    };

    // Start the video stream on component mount
    startVideoStream();

    // Clean up the stream on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      stopVideo();
    };
  }, []);


  const stopVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleVideoDataAvailable = async (event) => {
    if (event.data && event.data.size > 0) {
      videoChunksRef.current.push(event.data);
      totalVideoSizeRef.current += event.data.size;
  
      // If total size exceeds 5MB and not yet in multipart mode, initiate it
      if (totalVideoSizeRef.current > MAX_CHUNK_SIZE && !isMultipartUploadRef.current) {
        await initiateMultipartUploadProcess();
        isMultipartUploadRef.current = true;
        console.log('Multipart Upload Flag set to: ', isMultipartUploadRef.current);
      }
  
      // If multipart upload started and current buffer >= 5MB, upload chunk
      if (isMultipartUploadRef.current && getCurrentBufferSize() >= MAX_CHUNK_SIZE) {
        console.log('Uploading Chunk');
        await uploadChunk();
      }
    }
  };
  
  const handleVideoStop = async () => {
    // Called when recording stops at the end of the interview
    // If we are in multipart upload mode and have a final chunk, upload it and then complete
    // If we are not in multipart mode, then we have a small file, upload single
    if (isMultipartUploadRef.current) {
      // Upload any remaining chunk
      if (getCurrentBufferSize() > 0) {
        await uploadChunk();
      }
      // Complete the multipart upload
      await completeMultipartUploadProcess();
    } else {
      // Single file upload scenario
      await singleFileUploadProcess();
    }
  
    // Optionally, save the file details
    await saveFileDetailsInDB();
  };

  const getCurrentBufferSize = () => {
    return videoChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
  };

  const initiateMultipartUploadProcess = async () => {
    const fileName = `interview_video_userId_${user.id}_attemptId_${userClientJobInterviewAttemptIdRef.current}.webm`;
    const contentType = 'video/webm';
  
    const res = await fetch(getApiUrl('/api/video-upload/initiate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, contentType }),
    });
  
    const data = await res.json();
    uploadIdRef.current = data.uploadId;
    fileKeyRef.current = data.fileKey;
  };

  const uploadChunk = async () => {
    const chunkBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
    const chunkSize = chunkBlob.size;
  
    // Clear the current buffer after extracting
    videoChunksRef.current = [];
  
    const res = await fetch(getApiUrl('/api/video-upload/presigned-url'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileKey: fileKeyRef.current,
        uploadId: uploadIdRef.current,
        partNumber,
        contentType: 'video/webm'
      }),
    });
  
    const data = await res.json();
    const presignedUrl = data.signedUrl;
  
    // Upload the chunk
    const uploadRes = await fetch(presignedUrl, {
      method: 'PUT',
      body: chunkBlob,
      headers: {
        'Content-Type': 'video/webm',
      },
    });
  
    if (!uploadRes.ok) {
      console.error('Failed to upload chunk');
      return;
    }
  
    const rawETag = uploadRes.headers.get('ETag');
    // Remove any double quotes around the ETag
    const eTag = rawETag.replace(/"/g, '');
    partsRef.current.push({ ETag: eTag, PartNumber: partNumber });
    console.log('Parts Array', partsRef.current);
  
    partNumber += 1;
  };

  const completeMultipartUploadProcess = async () => {
    const res = await fetch(getApiUrl('/api/video-upload/complete'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { 
          fileKey: fileKeyRef.current,
          uploadId: uploadIdRef.current,
          parts: partsRef.current
        }
      ),
    });
  
    const data = await res.json();
    console.log('Multipart upload completed. File URL:', data.fileUrl);

    // Set the refs
    finalFileSizeRef.current = totalVideoSizeRef.current;
  };

  const singleFileUploadProcess = async () => {
    const fileName = `interview_video_userId_${user.id}_attemptId_${userClientJobInterviewAttemptIdRef.current}.webm`;
    const contentType = 'video/webm';
    const blob = new Blob(videoChunksRef.current, { type: contentType });
  
    const res = await fetch(getApiUrl('/api/video-upload/single'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, contentType }),
    });
  
    const data = await res.json();
    const { signedUrl, fileKey: key } = data;
    fileKeyRef.current = key;
  
    // Upload directly
    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': contentType,
      }
    });
  
    if (!uploadRes.ok) {
      console.error('Failed to upload single file');
      return;
    }
  
    console.log('Single file upload completed.');

    // Set the refs
    finalFileSizeRef.current = blob.size;
  };

  
  const saveFileDetailsInDB = async () => {
    if (!fileKeyRef.current || !finalFileSizeRef.current) {
      console.error("Missing details for saving file. Ensure fileKeyRef, and finalFileSizeRef are set.");
      return;
    }
    const payload = {
      fileKey: fileKeyRef.current,
      userId: user.id,
      userClientJobInterviewAttemptId: userClientJobInterviewAttemptIdRef.current,
      fileSize: finalFileSizeRef.current
    };
  
    const res = await fetch(getApiUrl('/api/video-upload/details'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    const data = await res.json();
    console.log('File details saved:', data);
  };
  

  useEffect(() => {
    const handlePageLeave = () => {
      alert('You have navigated away from the interview page.');
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      navigate(-1);
    };
    window.addEventListener('popstate', handlePageLeave);
    return () => {
      window.removeEventListener('popstate', handlePageLeave);
      // Cleanup video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream, navigate, stopVideo]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      setModalContent({
        headerText: 'Warning!',
        bodyText: 'You cannot switch tabs or leave this page during the interview.',
        buttonText: 'OKAY',
      });
      setIsModalOpen(true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCountRef.current += 1; // Increment the counter
        setModalContent({
          headerText: 'Warning',
          bodyText: 'You cannot switch tabs or minimize the window during the interview.',
          buttonText: 'Okay',
        });
        setIsModalOpen(true);
      }
    };

    if (timerStarted) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    return () => {
      if (timerStarted) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [timerStarted]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleTimeUpModal = () => {
    setIsTimeUpModalOpen(!isTimeUpModalOpen);
  }

  const handleTypedResponseChange = (e) => {
    const newValue = e.target.value;
    setTypedResponse(newValue);
    typedResponseRef.current = newValue; // Update the ref as well
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && (e.key === 'v' || e.key === 'c')) {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
  };

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({
    onStart: () => {
      console.log('Recording started');

      setRecordingTime(0);
      // setQuestionTimeLeft(interviewDetails.time_limit_per_answer);
      setHasTimeRunOut(false);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {

          if (prevTime >= interviewDetails.time_limit_per_answer) {
            stopRecording();
            clearInterval(recordingIntervalRef.current);
            return interviewDetails.time_limit_per_answer;

          }
          return prevTime + 1;
        });


      }, 1000);
    },
    onStop: (blobUrl, blob) => {
      if (!blob) {
        console.error("No blob created. Recording failed to stop properly.");
        return;
      }
      console.log('Recording stopped');
      blobRef.current = blob;  // Store in ref
      console.log("Blob REF set inside onStop func:", blobRef.current);
      clearInterval(recordingIntervalRef.current);

      // Initialize Wavesurfer after stopping the recording
      if (blobUrl && waveformRef.current) {
        initializeWavesurfer(blobUrl);
      }
    },

    askPermissionOnMount: true,
  });

  // New function to handle the API call for submitting audio
  const submitAudioAnswer = async (time_taken_to_answer) => {
    try {
      // Check if the blob exists before submitting
      if (!blobRef.current) {
        console.error('No audio blob available for submission.');
        return { success: false, message: 'No audio to submit' };
      }

      console.log(`Time spent on Question ${currentQuestionIndex + 1}: ${time_taken_to_answer} seconds`);
      console.log('Submitting blob from ref:', blobRef.current); // Log the blob at submission time

      const interview_question_id = questions[currentQuestionIndex].id;
      console.log('Interview Question Id:', interview_question_id);

      const isLastQuestion = currentQuestionIndex + 1 >= questions.length;
      console.log('Is it the last question in this interview:', isLastQuestion);

      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('socketId', socket.id); // Include the socket ID
      formData.append('audio', blobRef.current, 'audio-answer.wav');
      formData.append('time_taken_to_answer', time_taken_to_answer);
      formData.append('interview_question_id', interview_question_id);
      formData.append('user_client_job_interview_attempt_id', userClientJobInterviewAttemptIdRef.current);
      formData.append('isLastQuestion', isLastQuestion);

      
      const response = await fetch(getApiUrl('/api/upload-audio'), {
        method: 'POST',
        body: formData,
      });

      // Handle the response
      if (response.ok) {
        const responseData = await response.json();
        console.log('Audio submission successful:', responseData);
        setSubmitted(true);  // Mark the answer as submitted

        // Clear the blob after successful submission
        clearBlobUrl();
        blobRef.current = null;
        setHasTimeRunOut(false);  // Reset the flag after submission

        return { success: true, message: 'Audio submission successful' };
      } else {
        console.error('Audio submission failed:', response.message);
        return { success: false, message: `Failed to submit audio: ${response.message}` };
      }
    } catch (error) {
      console.error('Error during audio submission:', error);
      return { success: false, message: 'Audio submission error occurred' };
    }
  };

  const submitTextAnswer = async (time_taken_to_answer) => {
    try {
      const interview_question_id = questions[currentQuestionIndex].id;
      const isLastQuestion = currentQuestionIndex + 1 >= questions.length;

      const payload = {
        user_id: user.id,
        socketId: socket.id,
        interview_question_id,
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptIdRef.current,
        answer_text: typedResponseRef.current.trim(),
        isLastQuestion,
        time_taken_to_answer
      };

      console.log("Text Submission Payload: ", JSON.stringify(payload));

      const response = await fetch(getApiUrl('/api/upload-text-answer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Text submission successful:', responseData);
        setSubmitted(true);  // Mark the answer as submitted
        setTypedResponse(''); // Clear the text input

        return { success: true, message: 'Text submission successful' };
      } else {
        console.error('Text submission failed:', response.message);
        return { success: false, message: `Failed to submit text: ${response.message}` };
      }
    } catch (error) {
      console.error('Error during text submission:', error);
      return { success: false, message: 'Text submission error occurred' };
    }
  };

  const handleNextQuestion = async () => {
    try {
      // Log the current state before moving to the next question
      console.log('Moving to the next question. Current index:', currentQuestionIndex);

      if (wavesurfer) {
        wavesurfer.destroy();
        setWavesurfer(null);
      }

      // Clear the waveform container
      if (waveformRef.current) {
        waveformRef.current.innerHTML = '';
      }

      // Clear the timestamps container
      const timestampsContainer = waveformRef.current?.nextSibling;
      if (timestampsContainer) {
        timestampsContainer.innerHTML = '';
      }

      // Clear the recorded blob before moving to the next question
      console.log('Blob Ref before moving to the next question:', blobRef.current); // Log the blob before clearing
      if (blobRef.current) {
        console.log('Clearing blob before moving to the next question');
        blobRef.current = null;
        console.log('Blob set to null inside handleNextQuestion func:', blobRef.current);
      }

      // Reset other states
      setIsPlaying(false);
      setVolumeLevel(0.5);
      setIsMuted(false);

      // Proceed to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);  // Update the question index
        console.log(`Moved to question ${nextQuestionIndex + 1} of ${questions.length}`);
        setSubmitted(false);  // Reset the submission flag for the new question

        return { success: true, message: `Moved to question ${nextQuestionIndex + 1}` };
      } else {
        console.warn('No more questions available.');
        return { success: false, message: 'No more questions available' };
      }



    } catch (error) {
      console.error('Error moving to the next question:', error);
      return { success: false, message: 'Error moving to the next question' };
    }
  };

  const updateTabSwitchCount = async () => {
    try {
      await fetch(getApiUrl(`/api/interview-attempt/${userClientJobInterviewAttemptIdRef.current}/tab-switch-count`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tab_switch_count: tabSwitchCountRef.current, // Send the tab switch count
        }),
      });
    } catch (error) {
      console.error('Error updating tab switch count:', error);
    }
  };

  const proceedToNextQuestionOrEndInterview = async () => {
    try {
      if (currentQuestionIndex + 1 >= questions.length) {

        // Update tab switch count
        await updateTabSwitchCount();
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop(); // Triggers handleVideoStop to start final upload logic
        }

        // Once the recording is stopped and handleVideoStop is triggered,
        // you can safely stop the video feed.
        // Stop video and navigate back to the interview overview
        stopVideo();

        
        if (jobIdRef.current) {
          navigate(`/interviews/${jobIdRef.current}`);
        } else {
          console.error('No jobId found to navigate back.');
        }

        return { success: true, message: 'Interview completed successfully' };

      } else {
        // Not the last question, proceed to the next one
        console.log('Proceeding to the next question.');
        // Await next question result
        const nextQuestionResult = await handleNextQuestion();
        if (!nextQuestionResult.success) {
          console.error(nextQuestionResult.message);
          return { success: false, message: nextQuestionResult.message };
        }

        return { success: true, message: 'Moved to next question' };
      }
    } catch (error) {
      console.error('Error completing interview or initiating scoring:', error);
      return { success: false, message: 'Error during interview completion or question transition' };
    }
  };

  const handleTimeUp = async () => {
    console.log("Inside Handle Timup Function");
    
    setLoading(true);  // Start loader
    
    // Since time ran out, time_taken_to_answer is equal to the total time allotted
    const time_taken_to_answer = interviewDetails.time_limit_per_answer;

    try {

          if (interviewDetails?.instructions?.interview_response_type === 'text') {
            console.log('Submitting text answer due to time-up.');
            setHasTimeRunOut(true);
            // Retry logic for submitting text answer
            let retries = 3;
            while (retries > 0) {
              console.log(`Retrying text submission, attempt ${3 - retries + 1}`);
              const submissionResult = await submitTextAnswer(time_taken_to_answer);
              if (submissionResult.success) {
                break;
              } else {
                console.error('Text submission failed, retrying:', submissionResult.message);
                retries--;
                if (retries === 0) {
                  alert('Failed to submit text after multiple attempts. Please check your internet connection and try again.');
                }
              }
            }
          } else {
            console.log("Recording Status", status);
            console.log("Blob at handle time-up from ref (before we try to stop ongoing recording):", blobRef.current);
            // Always attempt to stop the recording
            stopRecording();
            console.log('Attempted to stop recording as part of time-up.');
            // Introduce a delay to ensure recording is fully stopped
            await new Promise(resolve => setTimeout(resolve, 2000));  // 2-second delay (adjust if needed)
            console.log("Recording Status- should have stopped recording", status);
            setHasTimeRunOut(true);
            console.log("Blob at handle time-up from ref:", blobRef.current);
            if (blobRef.current) {
              console.log("Blob found in ref, submitting answer");
      
              // Retry logic for submitting audio
              let retries = 3;
      
              while (retries > 0) {
                console.log(`Retrying audio submission, attempt ${3 - retries + 1}`);
                const submissionResult = await submitAudioAnswer(time_taken_to_answer);
      
                if (submissionResult.success) {
                  break;
                } else {
                  console.error('Submission failed, retrying:', submissionResult.message);
                  retries--;
                  if (retries === 0) {
                    alert('Failed to submit audio after multiple attempts. Please check your internet connection and try again.');
                  }
                }
              }
            } else {
              console.log("Blob NOT found, moving to the next question or ending interview");
              // alert("You ran out of time to answer the question.");  // Notify the user
              setTimeUpModalContent({
                headerText: 'Time is Up',
                bodyText: 'You ran out of time to answer the question.',
                buttonText: 'Okay',
              });
              setIsTimeUpModalOpen(true);
              setHasTimeRunOut(false);  // Reset the flag since no submission occurred
            }

          }
      
    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred during submission. Please try again.');
    } finally{
        try {
        // Proceed to the next question or end the interview regardless of submission outcome
        const nextStepResult = await proceedToNextQuestionOrEndInterview();

        if (!nextStepResult.success) {
          console.error('Failed to proceed to next step:', nextStepResult.message);
          alert(`Error during interview progression: ${nextStepResult.message}`);
        }
      } catch (error) {
        console.error('Error during next question transition:', error);
        alert('An error occurred during question transition. Please try again.');
      } finally {
        // Reset loading state
        setLoading(false);
      }
    }
    
  };


  const initializeWavesurfer = (blobUrl) => {
    if (!waveformRef.current) return;

    if (wavesurfer) {
      wavesurfer.destroy();
    }

    const isSmallScreen = window.innerWidth < 600

    const wavesurferInstance = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#808080",
      progressColor: "#ffe530",
      barWidth: 2,
      height: isSmallScreen ? 30 : 100,
      responsive: true,
      hideScrollbar: true,
    });

    wavesurferInstance.load(blobUrl);

    wavesurferInstance.on('ready', () => {
      wavesurferInstance.setVolume(volumeLevel);
      drawTimestamps(wavesurferInstance);
    });

    wavesurferInstance.on('finish', () => {
      setIsPlaying(false);
    });

    setWavesurfer(wavesurferInstance);

    return () => {

      if (wavesurferInstance) {
        wavesurferInstance.un('finish');
        wavesurferInstance.destroy();
      }
    };
  };

  const drawTimestamps = (wavesurferInstance) => {
    if (!waveformRef.current) return;

    const duration = Math.min(wavesurferInstance.getDuration(), interviewDetails.time_limit_per_answer);
    const maxTimestamps = 10;
    const interval = Math.ceil(duration / maxTimestamps);

    const numberOfTimestamps = Math.ceil(duration / interval);

    const timestampsContainer = waveformRef.current.nextSibling;
    timestampsContainer.innerHTML = '';

    for (let i = 0; i <= numberOfTimestamps; i++) {

      const time = i * interval;

      if (time > duration) break;

      const timestampElement = document.createElement('div');
      timestampElement.className = 'waveform-timestamp';
      timestampElement.style.position = 'absolute';
      timestampElement.style.alignItems = 'center';
      timestampElement.style.justifyContent = 'center';
      timestampElement.style.left = `${(time / duration) * 100}%`;
      timestampElement.innerText = formatTime(time);
      timestampsContainer.appendChild(timestampElement);
    }
  };

  const formatTime = (seconds) => {

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  };



  const handlePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = () => {
    wavesurfer.skip(-10);
  };

  const handleForward = () => {
    wavesurfer.skip(10);
  };

  const handleReplay = () => {
    wavesurfer.play(0);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    setVolumeLevel(volume);
    if (wavesurfer) {
      wavesurfer.setVolume(volume);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    wavesurfer.setVolume(isMuted ? volumeLevel : 0);
  };


  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    if (!user) {
      alert('User is not set. Please log in again.');
      navigate('/login');
      return;
    }
    if (interviewDetails?.instructions?.interview_response_type !== 'text' && !blobRef.current) {
      alert('Please record an audio first.');
      return;
    }
    // Prevent submission of the same recording for multiple questions
    if (submitted) { // Highlighted: Prevent re-submission of the same recording
      alert('This recording has already been submitted.');
      return;
    }

    setLoading(true);

    console.log('Submitting blob from handle submit function:', blobRef.current);

    // Calculate time taken to answer
    const totalTimeForQuestion = interviewDetails.time_limit_per_answer; // Total allotted time
    const time_taken_to_answer = totalTimeForQuestion - questionTimeLeft; // Time taken to answer

    try {

      if (interviewDetails?.instructions?.interview_response_type === 'text') {
        // Retry logic for submitting text
        let retries = 3;
        while (retries > 0) {
          console.log(`Retrying text submission, attempt ${3 - retries + 1}`);
          const submissionResult = await submitTextAnswer(time_taken_to_answer);
          if (submissionResult.success) {
            break;
          } else {
            console.error('Text submission failed, retrying:', submissionResult.message);
            retries--;
            if (retries === 0) {
              alert('Failed to submit text after multiple attempts. Please check your internet connection and try again.');
            }
          }
        }
      } else {
        // Retry logic for submitting audio
        let retries = 3;

        while (retries > 0) {
          console.log(`Retrying audio submission, attempt ${3 - retries + 1}`);
          const submissionResult = await submitAudioAnswer(time_taken_to_answer);

          if (submissionResult.success) {
            break;
          } else {
            console.error('Submission failed, retrying:', submissionResult.message);
            retries--;
            if (retries === 0) {
              alert('Failed to submit audio after multiple attempts. Please check your internet connection and try again.');
            }
          }
        }
      }

    } catch (error) {
      console.error('Error during submission:', error);
      alert('An error occurred during submission. Please try again.');
    } finally {
      try {
        // Proceed to the next question or end the interview even if submission fails
        const nextStepResult = await proceedToNextQuestionOrEndInterview();

        if (!nextStepResult.success) {
          console.error('Failed to proceed to next step:', nextStepResult.message);
          alert(`Error during interview progression: ${nextStepResult.message}`);
        }
      } catch (error) {
        console.error('Error during next question transition:', error);
        alert('An error occurred during question transition. Please try again.');
      } finally {
        // Reset loading state
        setLoading(false);
      }
    }


  };

  const handleStartRecording = () => {
    if (blobRef.current) {
      console.log('Blob exists before starting a new recording:', blobRef.current); // Log the existing blob
      if (window.confirm("This will discard your current answer. Are you sure?")) {
        clearBlobUrl();
        blobRef.current = null;
        console.log('Blob set to null inside start recording func:', blobRef.current);
        startRecording();
      }
    } else {
      startRecording();
    }
  };

  // Conditional rendering to prevent accessing `id` before the data is loaded
  if (initialLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <div className="loader-message">Loading interview details...</div>
      </div>
    );
  };

  const hasWaveform = !!(status === 'recording' || blobRef.current);

  return (
    <div className="outer-container">
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <div className="loader-message">Uploading your audio...</div>
        </div>
      )}
      {showModal && <InstructionsModal show={showModal} onClose={() => setShowModal(false)} onAccept={handleAccept} instructionDetails={instructionDetails} />}
      {/* <div className="alertStyle" ref={alertRef}>
        <p>Your progress may be lost if you switch tabs or minimize the browser.</p>
      </div> */}
      {isModalOpen && (
        <Modal
          toggleModal={toggleModal}
          headerText={modalContent.headerText}
          bodyText={modalContent.bodyText}
          buttonText={modalContent.buttonText}
        />
      )}

      {isTimeUpModalOpen && (
        <Modal
          toggleModal={toggleTimeUpModal}
          headerText={timeUpModalContent.headerText}
          bodyText={timeUpModalContent.bodyText}
          buttonText={timeUpModalContent.buttonText}
        />
      )}
      
      <div><h3 className='poppins-regular overall-progress-text'>Overall Progress</h3></div>
      <div className='progress-bar-container poppins-regular' >
        <ProgressBar currentStep={currentQuestionIndex} totalSteps={questions.length} />
        <span className='progress-number'>{currentQuestionIndex + 1} / {questions.length}</span>
      </div>
      <div className='main-container'>
        <video
          ref={videoRef}  // Reference for the video element
          autoPlay
          // muted
          className='user-video-box'
        />

        {questions.length > 0 && (
          <>
            <div className='divide'>
              {questions[currentQuestionIndex].question.question_type === 'Image' ? (
                <div className='image-text-container'>
                  <p className="instruction-text poppins-semibold">
                    {questions[currentQuestionIndex].question.text_instructions}
                  </p>
                  <img
                    src={questions[currentQuestionIndex].question.media_url}
                    alt={`Interview Question ${currentQuestionIndex + 1}`}
                    className='question-image'
                  />
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  loading='lazy'
                  seamless
                  src={questions[currentQuestionIndex].question.media_url + `?&title=0&byline=0&portrait=0&dnt=1&controls=1${startFirstVideo ? '&autoplay=1' : ''}&loop=0`}
                  width="100%"
                  height="100%"
                  style={{ margin: '0', padding: '0', top: '0' }}
                  frameBorder="0"
                  allow="autoplay"
                  autoPlay
                  title="Interview Question Video"
                />
              )}
            </div>
            <div className='divide-right'>
              <div className="card-container">
                {interviewDetails?.instructions?.interview_response_type === 'text' ? (
                  <>
                    <div className="text-answer-container">
                      <textarea
                        rows="6"
                        cols="50"
                        placeholder="Type your response here..."
                        value={typedResponse}
                        onChange={handleTypedResponseChange}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        disabled={submitted || questionTimeLeft <= 0} // Disable the input if submitted or time has run out
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-gramm="false"
                      />
                      <div className="timer-and-controls">
                        <div className="question-timer poppins-regular">
                          <div>
                            <p className="time-remaining">Time Remaining</p>
                          </div>
                          <div>
                            {timerStarted && <Timer timeLeft={questionTimeLeft} />}
                          </div>
                        </div>
                        <div className="controls">
                          <button
                            onClick={handleSubmit}
                            type="submit"
                            className="poppins-regular primary"
                            disabled={submitted || questionTimeLeft <= 0}
                          >
                            <MdOutlineFileUpload className="logos" style={{ fontSize: '24px', fontWeight: 'bold' }} />
                            <span className='text-large-screen poppins-medium'>Submit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>

                ) : (
                  <>
                    {status === 'recording' && (
                      <div className={`recording-container`} >
                        <img src={recordingGif} alt="Recording" className='recordingGif' />
                        <div className='recording-text-container'>
                          <FaDotCircle className="blinking-text recording-logo" />
                          <p className="blinking-text recording-text poppins-regular">
                            Recording... {new Date(recordingTime * 1000).toISOString().substr(11, 8)}
                          </p>
                        </div>
                      </div>
                    )}
                    {!status.includes('recording') && (
                      <div className={`waveform-external-container`}>
                        <div className="waveform-container" ref={waveformRef}></div>
                        <div className="waveform-timestamps"></div>
                        {blobRef.current && wavesurfer && (
                          <div className="audio-player__controls">
                            <div className="controls__main controls__btn">
                              <div className="main__btn hide" onClick={handleRewind}>
                                <AiFillBackward />
                              </div>
                              <div className="main__btn" onClick={handlePlayPause}>
                                {isPlaying ? <FaPause /> : <FaPlay />}
                              </div>
                              <div className="main__btn hide" onClick={handleForward}>
                                <AiFillForward />
                              </div>
                              <div className="main__btn hide">
                                <MdReplay onClick={handleReplay} />
                              </div>
                              <div className="controls__volume-btn hide">
                                <div className="volume-icon" onClick={handleMute}>
                                  {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
                                </div>
                                <input
                                  type="range"
                                  name="volume"
                                  id="volume"
                                  min="0"
                                  max="1"
                                  step=".05"
                                  value={volumeLevel}
                                  onChange={handleVolumeChange}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="timer-and-controls">
                      <div className="question-timer poppins-regular">
                        <div style={{ margin: '0px' }}>
                          <p className='time-remaining'>Time Remaining</p>
                        </div>
                        <div>
                          {timerStarted && <Timer timeLeft={questionTimeLeft} />}
                        </div>

                      </div>
                      <div>
                        <div className="controls">
                          {!blobRef.current ? (
                            <button
                              onClick={status === 'recording' ? stopRecording : handleStartRecording}
                              type="button"
                              className={`primary poppins-regular ${questionTimeLeft <= 0 ? 'disabled' : ''}`}
                              disabled={questionTimeLeft <= 0 || submitted}
                            >
                              {status === 'recording' ? (
                                <div className='start_stop_container'>
                                  <div className='start-stop-logo-container'>
                                    <FaStop className='logos' />
                                  </div>
                                  <div className='start-stop-text-container'>
                                    <span className='text-large-screen poppins-medium'>Stop Recording</span>
                                  </div>
                                </div>
                              ) : (
                                <div className='start_stop_container'>
                                  <div className='start-stop-logo-container'>
                                    <FaMicrophone className='logos' />
                                  </div>
                                  <div className='start-stop-text-container'>
                                    <span className='text-large-screen poppins-medium'>Start Recording</span>
                                  </div>
                                </div>
                              )}
                            </button>
                          ) : (
                            <div className="btn-group">
                              <div>
                                <button
                                  onClick={handleStartRecording}
                                  type="button"
                                  className="btn poppins-regular restart-btn secondary"
                                >
                                  <MdReplay style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '0.4rem' }} />
                                  <span className='text-large-screen'>Re-record</span>
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={handleSubmit}
                                  type="submit"
                                  className="btn poppins-regular submit-btn primary"
                                  disabled={status === 'idle' || status === 'recording' || !blobRef.current || hasTimeRunOut || submitted}
                                >
                                  <MdOutlineFileUpload className='logos' style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '0.4rem' }} />
                                  <span className='text-large-screen'>Submit</span>
                                </button>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioUploadForm;
