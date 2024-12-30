import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { ClientUserProvider } from './context/ClientUserContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Welcome from './components/Welcome';
import VerifyOTP from './components/VerifyOTP';
import ProcessedResponses from './components/ProcessedResponses';
import Homepage from './components/Homepage';
import TestForm from './components/TestForm';
import EducationForm from './components/EducationForm';
import JobsForm from './components/JobsForm';
import SkillsForm from './components/SkillsForm';
import InternshipForm from './components/InternshipsForm';
import OptionalSectionsForm from './components/OptionalSectionsForm';
import ExtraCurricularsForm from './components/ExtraCurricularsForm';
import HobbiesForm from './components/HobbiesForm';
import LanguagesForm from './components/LanguagesForm';
import ProjectsForm from './components/ProjectForms';
import CustomSectionsForm from './components/CustomSectionsForm';
import ReferencesForm from './components/ReferencesForm';
import CvUploadForm from './components/CvUpload';
import CvUploadProgress from './components/CvUploadProgress';
import UserProfile from './components/UserProfile';
import EditEducationForm from './components/EditEducationForm';
import EditInternshipForm from './components/EditInternshipForm';
import EditJobForm from './components/EditJobForm';
import EditProjectForm from './components/EditProjectForm';
import LandingPage from './components/LandingPage';
import InterviewHR from './components/InterviewHR';
import AudioUploadForm from './components/AudioUpload';
import ThankYouPage from './components/Thankyou';
import JobListingPage from './components/JobListings';
import JobDetailsPage from './components/JobDetailsPage';
import HistoricalScores from './components/HistoricalScores';
import ClientLogin from './components/ClientLogin';
import ClientVerifyOTP from './components/ClientVerifyOtp';
import ClientDashboard from './components/ClientDashboard';
import JobDetails from './components/JobDetails';
import ManageQuestions from './components/ManageQuestions';
import InterviewList from './components/ClientInterviewList';
import JobApplicantReports from './components/JobApplicantReports';
import InviteUserJob from './components/InviteUserJob';
import CreateClientJob from './components/CreateClientJob';
import CreateInterviews from './components/CreateInterviews';
import CreateInstructions from './components/CreateInstructions';
import EditEvaluation from './components/EditEvaluation';
import CreateQuestions from './components/CreateQuestions';
import JobCandidatesList from './components/JobCandidatesList';
import JobApply from "./components/JobApply.js"
import CandidateCvView from './components/CandidateCvView.js';
import CreateEvaluationCriteria from './components/CreateEvaluationCriteria.js';



function App() {
  return (
    <UserProvider>
      <ClientUserProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/processed-responses" element={<ProcessedResponses />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Homepage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/test-form" element={<TestForm />} />
                <Route path="/education-form" element={<EducationForm />} />
                <Route path="/jobs-form" element={<JobsForm />} />
                <Route path="/skills-form" element={<SkillsForm />} />
                <Route path="/internship-form" element={<InternshipForm />} />
                <Route path="/optional-sections" element={<OptionalSectionsForm />} />
                <Route path="/extracurriculars-form" element={<ExtraCurricularsForm />} />
                <Route path="/hobbies-form" element={<HobbiesForm />} />
                <Route path="/languages-form" element={<LanguagesForm />} />
                <Route path="/projects-form" element={<ProjectsForm />} />
                <Route path="/customsections-form" element={<CustomSectionsForm />} />
                <Route path="/references-form" element={<ReferencesForm />} />
                <Route path="/cv-upload" element={<CvUploadForm />} />
                <Route path="/cv-upload-progress" element={<CvUploadProgress />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/edit-education/:id" element={<EditEducationForm />} />
                <Route path="/edit-internship/:id" element={<EditInternshipForm />} />
                <Route path="/edit-job/:id" element={<EditJobForm />} />
                <Route path="/edit-project/:id" element={<EditProjectForm />} />
                <Route path="/user-home" element={<LandingPage />} />
                <Route path="/jobs" element={<JobListingPage />} />
                <Route path="/jobs/all-scores/:jobId/:userId" element={<HistoricalScores />} />
                <Route path="/job-details/:jobId" element={<JobDetailsPage />} />
                <Route path="/interviews/:jobId" element={<InterviewHR />} />
                <Route path="/interview/:clientJobInterviewID" element={<AudioUploadForm />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
                <Route path="/client-login" element={<ClientLogin />} />
                <Route path="/client-verify-otp" element={<ClientVerifyOTP />} />
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/client-jobs/:jobId" element={<JobDetails />} />
                <Route path="/client-jobs/:jobId/interviews" element={<InterviewList />} />
                <Route path="/manage-questions/:interviewId" element={<ManageQuestions />} />
                <Route path="/client-jobs/:clientJobId/applicant-reports" element={<JobApplicantReports />} />
                <Route path="/invite-user/job/:jobId" element={<InviteUserJob />} />
                <Route path="/client-jobs/:clientJobId/candidates-list" element={<JobCandidatesList />} />
                <Route path="/jobapply/:jobURL" element={<JobApply />} />
                <Route path="/candidate/:userId/job/:jobId/cv" element={<CandidateCvView />} />
                <Route path="/create-job" element={<CreateClientJob />} />
                <Route path="/create-job/:jobId/interviews" element={<CreateInterviews />} />
                <Route path="/create-job/:jobId/interviews/:interviewId/instructions" element={<CreateInstructions />} />
                <Route path="/create-job/:jobId/interviews/:clientInterviewId/evaluation" element={<EditEvaluation />} />
                <Route path="/create-job/:jobId/interviews/:interviewId/questions" element={<CreateQuestions />} />
                <Route path="/evaluation-criteria/create" element={<CreateEvaluationCriteria />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </ClientUserProvider>
    </UserProvider>


  );
}

export default App;