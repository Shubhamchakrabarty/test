const { Education, University, Degree, Internship, Company, InternshipDesignation, Job, Designation, UserProject, ProjectLevel, Score, HrInterviewScore , AnswerTranscript, InterviewResponse, AnswerAudioUpload, JobInterviewQuestionLevelAssessment, JobInterviewLevelAssessment, JobInterviewQuestionLevelAssessmentTotalScore} = require('../models');
const { fuzzyMatch, normalizeString } = require('../utils/fuzzyMatch');
const { sequelize } = require('../models');


const saveEducation = async (userId, educationList) => {
  console.log('Starting to save education data for user:', userId);

  // Clear existing entries for the user
  await Education.destroy({ where: { user_id: userId } });
  console.log('Cleared existing education entries for user:', userId);

  // Fetch all universities and degrees from the database for matching
  const universities = await University.findAll();
  const degrees = await Degree.findAll();
  console.log('Fetched universities and degrees from the database');

  // Process each education entry
  const educationPromises = educationList.map(async (education) => {
    console.log('Processing education entry:', education);

    // Perform fuzzy matching to find the closest university name
    const universityMatch = fuzzyMatch(education.institution, universities.map(u => u.name));
    //console.log('Fuzzy match result for institution:', education.institution, '->', universityMatch);

    const university = universityMatch && universityMatch[1] > 95 // Confidence threshold
      ? universities.find(u => u.name === universityMatch[0])
      : await University.create({ name: education.institution });

    console.log('Selected/created university:', university);

    // Perform fuzzy matching to find the closest degree name
    const degreeMatch = fuzzyMatch(education.degree, degrees.map(d => d.course));
    //console.log('Fuzzy match result for degree:', education.degree, '->', degreeMatch);

    const degree = degreeMatch && degreeMatch[1] > 95 // Confidence threshold
      ? degrees.find(d => d.course === degreeMatch[0])
      : await Degree.create({ course: education.degree, description: education.major || education.degree || 'N/A' });

    console.log('Selected/created degree:', degree);

    // Parse dates and CGPA
    let startDate = education.start_date;
    let endDate = education.end_date;

    // If only one date is provided, interpret it as the end date
    if (!startDate && endDate) {
      startDate = null;
    } else if (startDate && !endDate) {
      endDate = startDate;
      startDate = null;
    }

    // Convert CGPA to a number out of 100%
    let cgpa = parseFloat(education.cgpa);
    if (!isNaN(cgpa)) {
      if (cgpa > 10) cgpa = cgpa; // Assuming CGPA is already out of 100%
      else if (cgpa > 1) cgpa = cgpa * 10; // Assuming CGPA is out of 10
      else cgpa = cgpa * 100; // Assuming CGPA is out of 1
    } else {
      cgpa = 0; // Handle NaN CGPA
    }
    console.log('Parsed CGPA:', cgpa);

    const major = education.field_of_study ? education.field_of_study.trim() : 'N/A';

    // Create the education entry
    return Education.create({
      user_id: userId,
      university_id: university.id,
      degree_id: degree.id,
      cgpa: cgpa,
      start_date: startDate,
      end_date: endDate,
      major: major,
    });
  });

  // Wait for all education entries to be saved
  await Promise.all(educationPromises);
  console.log('All education entries saved for user:', userId);

};

const saveInternships = async (userId, internshipList) => {
  console.log('Starting to save internship data for user:', userId);

  // Clear existing entries for the user
  await Internship.destroy({ where: { user_id: userId } });
  console.log('Cleared existing internship entries for user:', userId);

  // Fetch all companies and designations from the database for matching
  const companies = await Company.findAll();
  const designations = await InternshipDesignation.findAll();
  console.log('Fetched companies and designations from the database');

  // Process each internship entry
  const internshipPromises = internshipList.map(async (internship) => {
    console.log('Processing internship entry:', internship);

    // Check if the entry has at least one meaningful field
    if (!internship.company && !internship.position && !internship.experience_summary) {
      console.log('Skipping empty work experience entry');
      return null;
    }

    // Perform fuzzy matching to find the closest company name
    const companyMatch = fuzzyMatch(internship.company, companies.map(c => c.name));
    //console.log('Fuzzy match result for company:', internship.company, '->', companyMatch);

    const company = companyMatch && companyMatch[1] > 95 // Confidence threshold
      ? companies.find(c => c.name === companyMatch[0])
      : await Company.create({ name: internship.company });

    console.log('Selected/created company:', company);

    // Perform fuzzy matching to find the closest designation name
    const designationMatch = fuzzyMatch(internship.position, designations.map(d => d.name));
    //console.log('Fuzzy match result for designation:', internship.position, '->', designationMatch);

    const designation = designationMatch && designationMatch[1] > 95 // Confidence threshold
      ? designations.find(d => d.name === designationMatch[0])
      : await InternshipDesignation.create({ name: internship.position });

    console.log('Selected/created designation:', designation);

    // Parse dates and is_current
    const startDate = internship.start_date;
    const endDate = internship.end_date;
    const isCurrent = !endDate;

    // Create the internship entry
    return Internship.create({
      user_id: userId,
      company_id: company.id,
      designation_id: designation.id,
      is_current: isCurrent,
      start_date: startDate,
      end_date: endDate,
      experience_summary: internship.experience_summary
    });
  });

  // Wait for all internship entries to be saved
  await Promise.all(internshipPromises);
  console.log('All internship entries saved for user:', userId);
};

const saveWorkExperiences = async (userId, workExperienceList) => {
  console.log('Starting to save work experience data for user:', userId);

  // Clear existing entries for the user
  await Job.destroy({ where: { user_id: userId } });
  console.log('Cleared existing work experience entries for user:', userId);

  // Fetch all companies and designations from the database for matching
  const companies = await Company.findAll();
  const designations = await Designation.findAll();
  console.log('Fetched companies and designations from the database');

  // Process each work experience entry
  const workExperiencePromises = workExperienceList.map(async (workExperience) => {
    console.log('Processing work experience entry:', workExperience);

    // Check if the entry has at least one meaningful field
    if (!workExperience.company && !workExperience.position && !workExperience.experience_summary) {
      console.log('Skipping empty work experience entry');
      return null;
    }

    // Perform fuzzy matching to find the closest company name
    const companyMatch = fuzzyMatch(workExperience.company, companies.map(c => c.name));
    //console.log('Fuzzy match result for company:', workExperience.company, '->', companyMatch);

    const company = companyMatch && companyMatch[1] > 95 // Confidence threshold
      ? companies.find(c => c.name === companyMatch[0])
      : await Company.create({ name: workExperience.company });

    console.log('Selected/created company:', company);

    // Perform fuzzy matching to find the closest designation name
    const designationMatch = fuzzyMatch(workExperience.position, designations.map(d => d.name));
    //console.log('Fuzzy match result for designation:', workExperience.position, '->', designationMatch);

    const designation = designationMatch && designationMatch[1] > 95 // Confidence threshold
      ? designations.find(d => d.name === designationMatch[0])
      : await Designation.create({ name: workExperience.position });

    console.log('Selected/created designation:', designation);

    // Parse dates and is_current
    const startDate = workExperience.start_date;
    const endDate = workExperience.end_date;
    const isCurrent = !endDate;

    // Create the work experience entry
    return Job.create({
      user_id: userId,
      company_id: company.id,
      designation_id: designation.id,
      is_current: isCurrent,
      start_date: startDate,
      end_date: endDate,
      experience_summary: workExperience.experience_summary
    });
  });

  // Wait for all work experience entries to be saved
  await Promise.all(workExperiencePromises);
  console.log('All work experience entries saved for user:', userId);
};


const saveProjects = async (userId, projectList) => {
  console.log('Starting to save project data for user:', userId);

  // Clear existing entries for the user
  const deleteCount = await UserProject.destroy({ where: { user_id: userId } });
  console.log(`Cleared ${deleteCount} existing project entries for user:`, userId);

  // Fetch all project levels from the database for matching
  const projectLevels = await ProjectLevel.findAll();
  const projectLevelsMap = projectLevels.reduce((map, level) => {
    map[level.name.toLowerCase()] = level.id;
    return map;
  }, {});
  console.log('Fetched project levels from the database: ', projectLevelsMap);

  // Ensure default project level ID is set
  const defaultProjectLevelId = projectLevelsMap['college level'];
  if (!defaultProjectLevelId) {
    console.error('Default project level "College Level" not found in database');
    return;
  }

  // Process each project entry
  const projectPromises = projectList.map(async (project) => {
    console.log('Processing project entry:', project);
    // Check if the entry has at least one meaningful field
    if (!project.project_name && !project.project_summary) {
      console.log('Skipping empty work experience entry');
      return null;
    }

    let projectLevelId = projectLevelsMap[project.project_level.toLowerCase()] || defaultProjectLevelId;

    console.log('Selected project level ID:', projectLevelId);

    // Parse dates
    const startDate = project.start_date;
    const endDate = project.end_date;

    // Create the project entry
    return UserProject.create({
      user_id: userId,
      project_level_id: projectLevelId,
      project_name: project.project_name,
      start_date: startDate,
      end_date: endDate,
      project_summary: project.project_summary
    });
  });

  // Wait for all project entries to be saved
  const results = await Promise.all(projectPromises);
  console.log('All project entries saved for user:', userId, results);
};

const saveScore = async (userId, scores, weights) => {
  console.log('Saving score for user:', userId);
  try{
    await Score.create({
    user_id: userId,
    school_1_score: scores.education.school_1_score,
    school_2_score: scores.education.school_2_score,
    undergrad_university_score: scores.education.undergrad_university_score,
    undergrad_cgpa_score: scores.education.undergrad_cgpa_score,
    postgrad_university_score: scores.education.postgrad_university_score,
    postgrad_cgpa_score: scores.education.postgrad_cgpa_score,
    school_1_weight: weights.education.school_1_weight,
    school_2_weight: weights.education.school_2_weight,
    undergrad_university_weight: weights.education.undergrad_university_weight,
    undergrad_cgpa_weight: weights.education.undergrad_cgpa_weight,
    postgrad_university_weight: weights.education.postgrad_university_weight,
    postgrad_cgpa_weight: weights.education.postgrad_cgpa_weight,
    internships_score: scores.internships,
    work_experience_score: scores.work_experience,
    projects_score: scores.projects,
    internships_weight: weights.internships,
    work_experience_weight: weights.work_experience,
    projects_weight: weights.projects,
    final_score: scores.final
  });
  console.log('Score saved for user:', userId);
  } catch(error) {
    console.error('Error saving profile score:', error);
    throw error;
  }
  
};

// Utility function to calculate the total score from question scores
const calculateTotalScore = (questionScores) => {
  const totalScore = questionScores.reduce((total, question) => total + (question.score || 0), 0);
  return parseFloat(totalScore.toFixed(2));
};

/*
const saveInterviewScore = async (userId, responseId, interviewName, scores) => {
  console.log('Saving interview score for user:', userId);
  try {
    const functionalSkillsScores = scores.functionalSkills?.question_scores || [];
    const logicalReasoningScores = scores.logicalReasoning?.question_scores || [];

    // Log calculated scores for verification
    const functionalSkillsSum = calculateTotalScore(functionalSkillsScores);
    console.log('Calculated Functional Skills Score:', functionalSkillsSum);

    const logicalReasoningSum = calculateTotalScore(logicalReasoningScores);
    console.log('Calculated Logical Reasoning Score:', logicalReasoningSum);

    await HrInterviewScore.create({
      userId,
      responseId,
      interviewName,
      functionalSkills: scores.functionalSkills?.question_scores || null,
      communication: scores.communication?.assessment || null,
      personalityTraits: scores.personalityTraits?.assessment || null,
      logicalReasoning: scores.logicalReasoning?.question_scores || null,
      functionalSkillsScore: functionalSkillsSum || 0,
      communicationScore: scores.communication?.score || 0,
      logicalReasoningScore: logicalReasoningSum || 0,
    });
    console.log('Interview score saved for user:', userId);
  } catch (error) {
    console.error('Error saving interview score:', error);
    throw error;
  }
};
*/

const saveTranscription = async (audioUploadId, transcript, confidenceScore, duration, user_client_job_interview_attempt_id, analytics) => {
  console.log('Saving transcription for audio upload:', audioUploadId);
  //console.log('Transcript:', transcript);
  console.log('Confidence Score:', confidenceScore);
  try {
    //Step 1: Save the transcription data to the database
    const transcription = await AnswerTranscript.create({
      answer_audio_upload_id: audioUploadId,
      transcript: transcript || '', // Ensure this is not undefined or null
      confidence_score: confidenceScore || 0, // Ensure this is not undefined or null
      length_of_answer: duration || 0, // Store the duration,
      pronunciation_accuracy: analytics?.pronunciationAccuracy || null, // Default to null if not provided
      fluency_wpm: analytics?.wordsPerMinute || null,
      fluency_pauses: analytics?.pauses || 0,
      fluency_long_pauses: analytics?.longPauses || 0,
      clarity_score: analytics?.clarity || null,
    });
    console.log('Transcription saved successfully', transcription);

    // Step 2: Fetch additional data needed to create an InterviewResponse
    const audioUpload = await AnswerAudioUpload.findByPk(audioUploadId);
    if (!audioUpload) {
      throw new Error(`AnswerAudioUpload with ID ${audioUploadId} not found`);
    }

    // Step 3: Check if an InterviewResponse already exists for this attempt and question
    const existingResponse = await InterviewResponse.findOne({
      where: {
        user_client_job_interview_attempt_id: user_client_job_interview_attempt_id,
        interview_question_id: audioUpload.interview_question_id,
      },
      attributes: [
        'id',
        'user_id',
        'user_client_job_interview_attempt_id',
        'interview_question_id',
        'follow_up_question_id',
        'answer_transcription_id',
        'createdAt',
        'updatedAt' // Removed 'interview_id' since it doesn't exist
      ]
    });

    // Step 4: If a response already exists, skip creating a new entry
    if (existingResponse) {
      console.warn(`InterviewResponse already exists for attempt ID ${user_client_job_interview_attempt_id} and question ID ${audioUpload.interview_question_id}. Skipping creation.`);
      return;
    }


    // Step 5: Create the InterviewResponse entry
    const interviewResponse = await InterviewResponse.create({
      user_id: audioUpload.user_id,
      user_client_job_interview_attempt_id: user_client_job_interview_attempt_id,
      interview_question_id: audioUpload.interview_question_id,
      answer_transcription_id: transcription.id, // Link the transcript
    },{
      returning: ['id', 'user_id', 'user_client_job_interview_attempt_id', 'interview_question_id', 'answer_transcription_id', 'createdAt', 'updatedAt'], // Explicitly define returned columns
    });
 

    console.log('InterviewResponse created successfully', interviewResponse);

  } catch (error) {
    console.error('Error saving transcription:', error);
    throw error;
  }
};

const saveQuestionScore = async (userClientJobInterviewAttemptId, interviewResponseId, evaluationCategoryId, scoreData) => {
  try {
    const { score:numericScore, qualitative_assessment } = scoreData.score;
    // Log to ensure values are correct
    console.log('Extracted score:', numericScore);
    console.log('Extracted qualitative assessment:', JSON.stringify(qualitative_assessment, null, 2));

    // Check if an existing score exists
    const existingScore = await JobInterviewQuestionLevelAssessment.findOne({
      where: {
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        interview_response_id: interviewResponseId,
        evaluation_category_id: evaluationCategoryId
      }
    });

    if (existingScore) {
      // Update the existing score
      await JobInterviewQuestionLevelAssessment.update(
        {
          score: parseFloat(numericScore),
          feedback: JSON.stringify(qualitative_assessment),
          updatedAt: new Date()
        },
        { where: { id: existingScore.id } }
      );
      console.log(`Updated question-level score for attempt ID ${userClientJobInterviewAttemptId}, response ID ${interviewResponseId}`);
    } else {
      // Create a new score entry if no existing score is found
      await JobInterviewQuestionLevelAssessment.create({
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        interview_response_id: interviewResponseId,
        evaluation_category_id: evaluationCategoryId,
        score: parseFloat(numericScore),
        feedback: JSON.stringify(qualitative_assessment),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created new question-level score for attempt ID ${userClientJobInterviewAttemptId}, response ID ${interviewResponseId}`);
    }
  } catch (error) {
    console.error('Error saving question-level score:', error);
    throw error;
  }
};

const saveInterviewScore = async (userClientJobInterviewAttemptId, evaluationCategoryId, scoreData) => {
  try {
    const { score: numericScore, qualitative_assessment } = scoreData.score;
    // Log the extracted values for debugging
    console.log('Extracted score:', numericScore);
    console.log('Extracted qualitative assessment:', JSON.stringify(qualitative_assessment, null, 2));

    // Check if an existing interview-level score exists
    const existingScore = await JobInterviewLevelAssessment.findOne({
      where: {
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        evaluation_category_id: evaluationCategoryId
      }
    });

    if (existingScore) {
      // Update the existing interview-level score
      await JobInterviewLevelAssessment.update(
        {
          score: parseFloat(numericScore),
          feedback: JSON.stringify(qualitative_assessment),
          updatedAt: new Date()
        },
        { where: { id: existingScore.id } }
      );
      console.log(`Updated interview-level score for attempt ID ${userClientJobInterviewAttemptId}`);
    } else {
      // Create a new interview-level score entry if no existing score is found
      await JobInterviewLevelAssessment.create({
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        evaluation_category_id: evaluationCategoryId,
        score: parseFloat(numericScore),
        feedback: JSON.stringify(qualitative_assessment),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created new interview-level score for attempt ID ${userClientJobInterviewAttemptId}`);
    }
  } catch (error) {
    console.error('Error saving interview-level score:', error);
    throw error;
  }
};
const saveQuestionScoreInterviewTotal = async (userClientJobInterviewAttemptId, evaluationCategoryId) => {
  try {
      // Fetch the latest question-level assessments using raw SQL
    const query = `
      SELECT DISTINCT ON (interview_response_id) interview_response_id, score
      FROM "JobInterviewQuestionLevelAssessments"
      WHERE user_client_job_interview_attempt_id = :userClientJobInterviewAttemptId
      AND evaluation_category_id = :evaluationCategoryId
      ORDER BY interview_response_id, "createdAt" DESC;
    `;
    
    const latestQuestionScores = await sequelize.query(query, {
      replacements: {
        userClientJobInterviewAttemptId,
        evaluationCategoryId
      },
      type: sequelize.QueryTypes.SELECT
    });

    // Handle cases where no scores are found
    if (!latestQuestionScores || latestQuestionScores.length === 0) {
      console.warn(`No question-level scores found for attempt ID ${userClientJobInterviewAttemptId} and evaluation category ID ${evaluationCategoryId}`);
      return; // Optionally, return early if no scores are found
    }

    // Filter out null or invalid scores
    const validScores = latestQuestionScores.filter(record => record.score !== null && !isNaN(parseFloat(record.score)));

    if (validScores.length === 0) {
      console.warn(`No valid question-level scores for attempt ID ${userClientJobInterviewAttemptId} and evaluation category ID ${evaluationCategoryId}`);
      return;
    }

    // Calculate the total score
    const totalScore = validScores.reduce((sum, record) => sum + parseFloat(record.score), 0);

    // Save the total score
    await JobInterviewQuestionLevelAssessmentTotalScore.create({
      user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
      evaluation_category_id: evaluationCategoryId,
      total_score: totalScore,
    });

    console.log(`Saved total score for interview attempt ID ${userClientJobInterviewAttemptId}`);
  } catch (error) {
    console.error('Error saving total score for interview attempt:', error);
    throw error;
  }
};

// Service function to save text answer to interview response
const saveTextAnswerToInterviewResponse = async (userId, interviewQuestionId, userClientJobInterviewAttemptId, answerTranscriptId) => {
  try {
    // Step 1: Check if an InterviewResponse already exists for this attempt and question
    const existingResponse = await InterviewResponse.findOne({
      where: {
        user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
        interview_question_id: interviewQuestionId,
      },
      attributes: [
        'id',
        'user_id',
        'user_client_job_interview_attempt_id',
        'interview_question_id',
        'follow_up_question_id',
        'answer_transcription_id',
        'createdAt',
        'updatedAt'
      ]
    });

    // Step 2: If a response already exists, skip creating a new entry
    if (existingResponse) {
      console.warn(`InterviewResponse already exists for attempt ID ${userClientJobInterviewAttemptId} and question ID ${interviewQuestionId}. Skipping creation.`);
      return { success: false, message: 'Answer already exists for this question and attempt.' };
    }

    // Step 3: Create an InterviewResponse entry
    const interviewResponse = await InterviewResponse.create({
      user_id: userId,
      user_client_job_interview_attempt_id: userClientJobInterviewAttemptId,
      interview_question_id: interviewQuestionId,
      answer_transcription_id: answerTranscriptId, // Link the transcript
    }, {
      returning: ['id', 'user_id', 'user_client_job_interview_attempt_id', 'interview_question_id', 'answer_transcription_id', 'createdAt', 'updatedAt'],
    });

    console.log('InterviewResponse created successfully', interviewResponse);

    return { success: true, message: 'Text answer saved successfully.' };
  } catch (error) {
    console.error('Error saving text answer:', error);
    return { success: false, message: 'Error saving text answer.' };
  }
};




module.exports = {
  saveEducation,
  saveInternships,
  saveWorkExperiences,
  saveProjects,
  saveScore,
  saveInterviewScore,
  saveTranscription,
  saveQuestionScore,
  saveQuestionScoreInterviewTotal,
  saveTextAnswerToInterviewResponse
};