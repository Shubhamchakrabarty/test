import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import Modal from './Modal';
import { IoIosCloseCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import './CreateInterviews.css';


const CreateInterviews = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [loading, setLoading] = useState(true);
    const [loaderMessage, setLoaderMessage] = useState('Fetching Interviews');
    const [errors, setErrors] = useState({}); // New state for error handling
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        interviewName: '',
        interviewTimePerQuestion: 0,
        interviewResponseType: '',
        preInterviewInstructions: '',
        welcomeMessage: '',
        welcomeVideoUrl: '',
        contextVideoText: '',
        contextVideoUrl: '',
        language: '',
        interviewEvaluationCriteria: new Set(),
        questionSetFixed: 1,
        questionSetSelectionMethod: 'fixed',
        numberOfQuestionSet: 1,
    });
    const [job, setJob] = useState();
    const [interviews, setInterviews] = useState([]);
    const [allEvaluationCategories, setAllEvaluationCategories] = useState();
    const [publishVerifyModal, setPublishVerifyModal] = useState(false);
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context
    const { jobId } = useParams();
    const formDialogRef = useRef();

    const navigate = useNavigate();

    if (error) {
        console.log("Error: ", error);
    }

    useEffect(() => {
        const getInterviews = async () => {
            try {
                const url = getApiUrl(`/api/client-jobs/${jobId}/interviews`);
                const res = await fetch(url);
                const data = await res.json();

                const sortedInterviews = data.sort((a, b) => a.client_job_interview_order - b.client_job_interview_order)
                if(res.status === 200) {
                    console.log(sortedInterviews);
                    setInterviews(sortedInterviews);
                }
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        }
        const getJob = async () => {
            try {
                const url = getApiUrl(`/api/client-jobs/${jobId}/`);
                const res = await fetch(url);
                const data = await res.json();

                if(res.status === 200) {
                    console.log(data);
                    setJob(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        const getAllEvaluationCategories = async () => {
            try {
                const url = getApiUrl(`/api/job-interview-evaluation-categories`);
                const res = await fetch(url);
                const categories = await res.json();

                if(res.status === 200) {
                    setAllEvaluationCategories(categories.reduce((acc, category) => {
                        acc[category.id] = category;
                        return acc;
                    }, {}));
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
    
        
        getJob();
        getInterviews();
        getAllEvaluationCategories();
    }, []);

    const handleToggleJob = async () => {
        try {
            let newStatus = job.status === 'Open' ? 'Closed' : 'Open';
            const res = await fetch(getApiUrl(`/api/client-jobs/${jobId}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if(res.ok) {
                setJob(jobInfo => ({ ...jobInfo, status: newStatus }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePublishJob = async (clientJobInterview) => {
        const clientJobInterviewId = clientJobInterview.client_job_interview_id;
        try {
            const res = await fetch(getApiUrl(`/api/interviews/client-job-interview/${clientJobInterviewId}/details`));
            const interview = await res.json();

            if(res.ok) {
                // Validate number of questions in each set for the interview
                const numberOfSets = interview.interviewData.number_of_question_sets;
                const numberOfQuestions = new Array(numberOfSets).fill(0);
                interview.interviewData.interview.interview_questions.forEach(question => {
                    numberOfQuestions[question.question_set - 1]++;
                });
                console.log(numberOfQuestions);

                if(numberOfQuestions[0] === 0) {
                    setError('There are no questions in some question sets');
                    setPublishVerifyModal(true);
                    return;
                }
                
                for(let idx = 0; idx < numberOfSets - 1; idx++) {
                    if(numberOfQuestions[idx] !== numberOfQuestions[idx + 1]) {
                        setError('The interview contains uneven number of questions in different sets');
                        setPublishVerifyModal(true);
                        return;
                    }
                }

                const interviewRes = await fetch(getApiUrl(`/api/interviews/${clientJobInterview.interview.id}`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        interview_name: clientJobInterview.interview.interview_name,
                        status: 'Published',
                        interview_time_limit: clientJobInterview.interview.time_limit_per_answer * numberOfQuestions[0],
                        time_limit_per_answer: clientJobInterview.interview.time_limit_per_answer
                    })
                });

                if(interviewRes.ok) {
                    console.log('Interview is published');
                    setInterviews(prevInterviews => {
                        return prevInterviews.reduce((acc, intr, idx) => {
                            if(intr.client_job_interview_id !== clientJobInterview.client_job_interview_id) {
                                acc[idx] = intr;
                                console.log(acc[idx]);
                            } else {
                                acc[idx] = { ...intr, interview: {
                                    ...intr.interview,
                                    status: 'Published'
                                }}
                                console.log(acc[idx]);
                            }
                            return acc;
                        }, []);
                    })
                }
            }
        } catch(error) {
            console.log(error);
        }
    }

    const togglePublishVerifyModal = async () => {
        setPublishVerifyModal(!publishVerifyModal);
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        if(name === 'interviewName') {
            setFormData({ ...formData, interviewName: value });
        } else if(name === 'questionSetSelectionMethod') {
            setFormData(prevFormData => ({
                ...prevFormData,
                questionSetSelectionMethod: value
            }));
        } else if(name === 'questionSetFixed') {
            if(value.length === 0) value = 0;
            setFormData(prevFormData => ({
                ...prevFormData,
                questionSetFixed: parseInt(value)
            }));
        } else if(name === 'numberOfQuestionSet') {
            if(value.length === 0) value = 0;
            setFormData(prevFormData => ({
                ...prevFormData,
                numberOfQuestionSet: parseInt(value)
            }));
        } else if(name === 'interviewTimePerQuestion') {
            if(value.length === 0) value = 0;
            setFormData(prevFormData => ({
                ...prevFormData,
                interviewTimePerQuestion: parseInt(value)
            }));
        } else if(name === 'interviewResponseType') {
            setFormData(prevFormData => ({
                ...prevFormData,
                interviewResponseType: value
            }));
        } else if(name === 'preInterviewInstructions') {
            setFormData(prevFormData => ({
                ...prevFormData,
                preInterviewInstructions: value
            }));
        } else if(name === 'welcomeMessage') {
            setFormData(prevFormData => ({
                ...prevFormData,
                welcomeMessage: value
            }));
        } else if(name === 'welcomeVideoUrl') {
            setFormData(prevFormData => ({
                ...prevFormData,
                welcomeVideoUrl: value
            }));
        } else if(name === 'contextVideoText') {
            setFormData(prevFormData => ({
                ...prevFormData,
                contextVideoText: value
            }));
        } else if(name === 'contextVideoUrl') {
            setFormData(prevFormData => ({
                ...prevFormData,
                contextVideoUrl: value
            }));
        } else if(name === 'language') {
            setFormData(prevFormData => ({
                ...prevFormData,
                language: value
            }));
        } else if(name === 'interviewEvaluationCriteria') {
            setFormData(prevFormData => ({
                ...prevFormData,
                interviewEvaluationCriteria: new Set([...formData.interviewEvaluationCriteria, parseInt(value)])
            }))
        }
    }

    const createInterviewWithInstructions = async () => {
        const evaluationCriteria = [];
        formData.interviewEvaluationCriteria.forEach(criterionId => {
            evaluationCriteria.push(allEvaluationCategories[criterionId]);
        })
        console.log(evaluationCriteria);
        setLoading(true);
        setLoaderMessage('Creating the Interview');
        formDialogRef.current.close();

        try {
            const res = await fetch(getApiUrl('/api/interviews'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_user_id: 3,
                    interview_name: formData.interviewName,
                    interview_time_limit: formData.interviewTimePerQuestion,
                    time_limit_per_answer: formData.interviewTimePerQuestion,
                    status: 'Draft',
                })
            });
            const data = await res.json();            // data.id -> interview id
            console.log('Interview Created Successfully');

            if(res.ok) {
                const link = await fetch(getApiUrl('/api/client-job-interviews/link/'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        job_id: parseInt(jobId),
                        interview_id: data.id,
                        interview_order: interviews.length + 1,
                        question_set_selection_method: formData.questionSetSelectionMethod,
                        question_set_fixed: parseInt(formData.questionSetFixed),
                        number_of_question_sets: parseInt(formData.numberOfQuestionSet)
                    })
                });
                const linkData = await link.json();    // linkData.id -> client_job_interview_id
                if(link.ok) {
                    setInterviews(prevInterviews => ([ ...prevInterviews, { ...linkData, client_job_interview_order: interviews.length + 1, client_job_interview_id: linkData.id, interview: data } ]));

                    // add each evaluation criteria to the interview
                    evaluationCriteria.forEach(async function(evaluationCriterion) {
                        await fetch(getApiUrl(`/api/interview-evaluation-criteria/`), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                client_job_interview_id: linkData.id,
                                evaluation_category_id: evaluationCriterion.id,
                                instructions: evaluationCriterion.description 
                            })
                        });
                    })
                    console.log('Evaluation Criteria added to the interview');
                }

                const instructionsResponse = await fetch(getApiUrl(`/api/interviews/${data.id}/instructions`), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pre_interview_instructions: formData.preInterviewInstructions,
                        welcome_message: formData.welcomeMessage,
                        welcome_video_url: formData.welcomeVideoUrl,
                        context_video_url: formData.contextVideoUrl,
                        context_video_text: formData.contextVideoText,
                        interview_response_type: formData.interviewResponseType,
                        language: formData.language,
                    })
                });
                const instructionsData = await instructionsResponse.json();
                if(instructionsResponse.ok) {
                    console.log('Added instructions to the interview');
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const handleNext = async (e) => {
        e.preventDefault();
        console.log(currentPage);
        if(currentPage < 3) {
            setCurrentPage(currentPage => currentPage + 1);
            return ;
        }

        if(currentPage === 3) {
            createInterviewWithInstructions();
        }
    }
    
    const handleBack = (e) => {
        e.preventDefault();
        if(currentPage === 1) return;
        setCurrentPage(currentPage => currentPage - 1);
    }

    const removeInterviewCriteria = (e) => {
        let id = parseInt(e.target.dataset.id);
        const updatedList = [...formData.interviewEvaluationCriteria].filter(criterionId => criterionId !== id);
        setFormData(formData => ({
            ...formData,
            interviewEvaluationCriteria: new Set(updatedList)
        }));
    }

    return (
        <div className="create-interviews-container">
            { loading && (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="loader-message">{loaderMessage}...</div>
                </div>
            )}
            { publishVerifyModal && <Modal toggleModal={ togglePublishVerifyModal } headerText='Error publishing interview' bodyText={error} buttonText='Close' /> }

            <header className="create-interviews-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>
            <main className="create-interviews-main">
                <div className="poppins-regular">
                    {
                        job && (<>
                            <h2>{ job.job_title }</h2>
                            <p id='tag'>{ job.status }</p>
                            <button className='secondary' onClick={ handleToggleJob }>{ job.status === 'Open' ? 'Close' : 'Open'} the Job</button>
                        </>)
                    }
                </div>
                <div class='actions'>
                    <button className='primary' onClick={() => formDialogRef.current.showModal()}>Create New Interview</button>
                    <button className='primary' onClick={() => navigate('/evaluation-criteria/create') }>Create New Evaluation</button>
                </div>
            </main>

            <dialog className='create-interview-modal' ref={formDialogRef}>
                <div className='close-button' onClick={() => formDialogRef.current.close()}>
                    <IoClose color='#888' fontSize='1.8rem' />
                </div>
                <div className='progress-status'>
                    <div className={`progress-bar ${currentPage >= 1 ? 'done' : ''}`}></div>
                    <div className={`progress-bar ${currentPage >= 2 ? 'done' : ''}`}></div>
                    <div className={`progress-bar ${currentPage >= 3 ? 'done' : ''}`}></div>
                </div>
                <form className='interview-form'>
                    {
                        currentPage === 1 && (<>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="interviewName"
                                    value={formData.interviewName}
                                    onChange={handleChange}
                                    required
                                />
                                <label className={formData.interviewName ? 'filled' : ''}>Interview Name *</label>
                                {errors.interviewName && <p className="error-text">{errors.interviewName}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="interviewTimePerQuestion"
                                    value={formData.interviewTimePerQuestion}
                                    onChange={handleChange}
                                    required
                                />
                                <label className={formData.interviewTimePerQuestion ? 'filled' : ''}>Time Per Question (in seconds)*</label>
                                {errors.interviewTimePerQuestion && <p className="error-text">{errors.interviewTimePerQuestion}</p>}
                            </div> 
                            <div className="form-group">
                                <select
                                    name="questionSetSelectionMethod"
                                    value={formData.questionSetSelectionMethod}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='' disabled>Question Set Selection Method*</option>
                                    <option value='fixed'>fixed</option>
                                    <option value='random'>random</option>
                                </select>
                                {errors.questionSetSelectionMethod && <p className="error-text">{errors.questionSetSelectionMethod}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="numberOfQuestionSet"
                                    value={formData.numberOfQuestionSet}
                                    onChange={handleChange}
                                    required
                                />
                                <label className={formData.numberOfQuestionSet ? 'filled' : ''}>Number of Question Set*</label>
                                {errors.numberOfQuestionSet && <p className="error-text">{errors.numberOfQuestionSet}</p>}
                            </div> 
                            {
                                formData.questionSetSelectionMethod === 'fixed' && (
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="questionSetFixed"
                                            value={formData.questionSetFixed}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label className={formData.questionSetFixed ? 'filled' : ''}>Question Set Fixed*</label>
                                        {errors.questionSetFixed && <p className="error-text">{errors.questionSetFixed}</p>}
                                    </div> 
                                )
                            }   
                        </>)
                    }   
                    {
                        currentPage === 2 && (<>
                            <div className="form-group textarea">
                                <textarea
                                    name="preInterviewInstructions"
                                    value={formData.preInterviewInstructions ?? ''}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label className={formData.preInterviewInstructions ? 'filled' : ''}>Pre Interview Instructions*</label>
                                {errors.preInterviewInstructions && <p className="error-text">{errors.preInterviewInstructions}</p>}
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="welcomeMessage"
                                    value={formData.welcomeMessage ?? ''}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label className={formData.welcomeMessage ? 'filled' : ''}>Welcome Message</label>
                                {errors.welcomeMessage && <p className="error-text">{errors.welcomeMessage}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="welcomeVideoUrl"
                                    value={formData.welcomeVideoUrl ?? ''}
                                    onChange={handleChange}
                                />
                                <label className={formData.welcomeVideoUrl ? 'filled' : ''}>Welcome Video URL</label>
                                {errors.welcomeVideoUrl && <p className="error-text">{errors.welcomeVideoUrl}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="contextVideoText"
                                    value={formData.contextVideoText ?? ''}
                                    onChange={handleChange}
                                />
                                <label className={formData.contextVideoText ? 'filled' : ''}>Context Video Text</label>
                                {errors.contextVideoText && <p className="error-text">{errors.contextVideoText}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="contextVideoUrl"
                                    value={formData.contextVideoUrl ?? ''}
                                    onChange={handleChange}
                                />
                                <label className={formData.contextVideoUrl ? 'filled' : ''}>Context Video URL</label>
                                {errors.contextVideoUrl && <p className="error-text">{errors.contextVideoUrl}</p>}
                            </div>
                            <div className="form-group">
                                <select
                                    name="interviewResponseType"
                                    value={formData.interviewResponseType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='' disabled>Select Interview Response Type*</option>
                                    <option value='audio'>Audio</option>
                                    <option value='text'>Text</option>
                                </select>
                                {errors.interviewResponseType && <p className="error-text">{errors.interviewResponseType}</p>}
                            </div>
                            <div className="form-group">
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='' disabled>Select Language*</option>
                                    <option value='en-IN'>English (India)</option>
                                    <option value='hi'>Hindi (Hinglish)</option>
                                </select>
                                {errors.language && <p className="error-text">{errors.language}</p>}
                            </div>
                        </>)
                    } 
                    {
                        currentPage === 3 && (<>
                            <div className="form-group">
                                <select
                                    name="interviewEvaluationCriteria"
                                    value={formData.interviewEvaluationCriteria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='Evaluation Criteria'>Select Evaluation Criteria</option>
                                {
                                    allEvaluationCategories && Object.values(allEvaluationCategories).map(category => (
                                        <option key={category.id} value={category.id}>{ category.name } [{ category.evaluation_level }]</option>
                                    ))
                                }
                                </select>
                                {errors.interviewEvaluationCriteria && <p className="error-text">{errors.interviewEvaluationCriteria}</p>}
                            </div>

                            <div className='criteria-pills'>
                            {
                                formData.interviewEvaluationCriteria.size !== 0 && [...formData.interviewEvaluationCriteria].map(criterionId => (
                                    <span onClick={removeInterviewCriteria} data-id={criterionId} key={criterionId} className='pill'>{ allEvaluationCategories[criterionId].name} [{ allEvaluationCategories[criterionId].evaluation_level }]</span>
                                ))
                            }
                            </div>
                        </>)
                    }
                    <div className='actions'>
                        <button className='secondary back' onClick={ handleBack }>Back</button>
                        <button className='primary next' onClick={ handleNext }>{ currentPage === 3 ? 'Create' : 'Next'}</button>
                    </div>
                </form>
            </dialog>

            <div className='interviews'>        
            {
                interviews.length !== 0 && interviews.map(interview => (
                    <div className='interview' key={interview.interview.id}>
                        <div className='info'>
                            <h4>{ interview.client_job_interview_order }. { interview.interview.interview_name }</h4>
                            <p id='tag'>{interview.interview.status}</p>
                        </div>
                        <div className='actions'>
                            <button className='secondary'><Link to={`${interview.interview.id}/instructions`}>Edit Instructions</Link></button>
                            <button className='secondary' onClick={() => navigate(`${interview.interview.id}/questions`, { state: { clientJobInterviewId: interview.client_job_interview_id } })}>Questions</button>
                            { interview.interview.status !== 'Published' && (
                                <button className='primary' onClick={ () => handlePublishJob(interview) }>Publish</button>
                            )}
                        </div>
                    </div>
                ))
            }
            </div>
        </div>
    );
};

export default CreateInterviews;
