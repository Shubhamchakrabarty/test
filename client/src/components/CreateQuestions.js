import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import { IoIosCloseCircle } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import './CreateQuestions.css';


const CreateQuestions = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // New state for error handling
    const [loaderMessage, setLoaderMessage] = useState('Fetching Questions');
    const INITIAL_QUESTION_DATA = {
        userQueryText: '',
        questionFormat: '[{"question_script": <question>}]',

        // for uploading questions
        questionText: '',
        questionType: 'Video',
        questionSet: 1,
        mediaUrl: '',
        textInstructions: '',
        questionEvaluationCriteria: 0,
        scoringCriteria: 0,
        referenceAnswers: [],
        referenceAnswersQuery: '',
        gptModelName: 'gpt-4o-mini'
    }

    const [job, setJob] = useState();
    const [interview, setInterview] = useState();
    const [questions, setQuestions] = useState();
    const [questionSetToDisplay, setQuestionSetToDisplay] = useState(1);
    const [formData, setFormData] = useState(INITIAL_QUESTION_DATA);
    const [gptResponse, setGptResponse] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [interviewEvaluationCriteria, setInterviewEvaluationCriteria] = useState();
    const [allEvaluationCategories, setAllEvaluationCategories] = useState();
    const [interviewInstructions, setInterviewInstructions] = useState();
    const [numberOfQuestionSet, setNumberOfQuestionSet] = useState(1);
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context
    const { jobId, interviewId } = useParams();
    const navigate = useNavigate();
    const formDialogRef = useRef();
    const { clientJobInterviewId } = useLocation().state;

    const QUESTION_FORMATS = [
        ['script only', `[{"question_script": <question>}]`],
        ['question text on video', '[{"question_script": <question>, "question_text": <question>}]'],   
        ['question text with additional ref text', '[{"question_script": <question>, "question_title": <question_title>, "question_text": <question>}]'],   
        ['question text with additional ref image', '[{"question_script": <question>, "question_image": <image_url>}]'],
    ] 
    if (error) {
        console.log("Error: ", error);
    }

    useEffect(() => {
        const getQuestions = async () => {
            try {
                const url = getApiUrl(`/api/interviews/${interviewId}/questions`);
                const res = await fetch(url);
                const data = await res.json();

                if(res.status === 200) {
                    console.log(data);
                    setQuestions(data.reduce((acc, question) => {
                        if(acc[question.question_set] === undefined) acc[question.question_set] = [ question ];
                        else acc[question.question_set].push(question);

                        return acc;
                    }, {}));
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
        const getInterview = async () => {
            try {
                const url = getApiUrl(`/api/client-job-interviews/${clientJobInterviewId}`);
                const res = await fetch(url);
                const data = await res.json();

                console.log('Interview: ', data)
                if(res.status === 200) {
                    setInterview(data.interview);
                    setNumberOfQuestionSet(data.number_of_question_sets);
                }
                setLoading(false);

            } catch (error) {
                console.log(error);
            }
        }
        const getInterviewEvaluationCriteria = async () => {
            try {
                const url = getApiUrl(`/api/interview-evaluation-criteria/${clientJobInterviewId}`);
                const res = await fetch(url);
                const criteria = await res.json();

                if(res.status === 200) {
                    console.log('Criteria: ', criteria);
                    setInterviewEvaluationCriteria(criteria);
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
                    console.log('Categories: ', categories);
                    setAllEvaluationCategories(categories.reduce((acc, category) => {
                        acc[category.id] = category
                        return acc;
                    }, {}));
                }

            } catch (error) {
                console.log(error);
            }
        }
        const getInterviewInstructions = async () => {
            try {
                const url = getApiUrl(`/api/interviews/${interviewId}/instructions`);
                const res = await fetch(url);
                const data = await res.json();

                if(res.ok) {
                    setInterviewInstructions(data);
                }

            } catch (error) {
                console.log(error);
            }
        }
        
        getQuestions();
        getJob();
        getInterview();
        getInterviewEvaluationCriteria();
        getAllEvaluationCategories();
        getInterviewInstructions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target; 

        if(name === 'questionEvaluationCriteria') {
            setFormData(prevFormData => ({
                ...prevFormData,
                questionEvaluationCriteria: parseInt(value)
            }));
        } else if(name === 'scoringCriteria') {
            setFormData(prevFormData => ({
                ...prevFormData,
                scoringCriteria: parseInt(value)
            }));
        } else if(name.startsWith('referenceAnswer-')) {
            const idx = parseInt(name.split('-')[1]);
            setFormData(prevFormData => ({
                ...prevFormData,
                referenceAnswers: { ...formData.referenceAnswers, [idx]: value }
            }));
        } else if(name === 'questionSet') {
            setFormData(prevFormData => ({
                ...prevFormData,
                questionSet: parseInt(value)
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }

        setErrors({});
    }

    const handleResponseChange = (e, idx) => {
        if(e.target.value.length === 0) {
            const responses = { ...gptResponse };
            delete responses[idx];
            setGptResponse(responses);
        } else setGptResponse(prev => ({ ...prev, [idx]: { question_script: e.target.value } }));
    }

    const handleBack = (e) => {
        e.preventDefault();
        if(currentPage > 1) {
            setCurrentPage(currentPage => currentPage - 1);
            return;
        }
    } 

    const handleNext = (e) => {
        e.preventDefault();

        if(currentPage < 2) {
            console.log(formData);
            if(formData.questionText.length === 0) setErrors({ questionText: 'Question Text cannot be empty'});
            else if(formData.textInstructions.length === 0) setErrors({ textInstructions: 'Text Instructions cannot be empty'});
            else if(formData.mediaUrl.length === 0) setErrors({ mediaUrl: 'Media URL cannot be empty'});
            else if(formData.questionType.length === 0) setErrors({ questionType: 'Question Type cannot be empty'});

            else setCurrentPage(currentPage => currentPage + 1);
            return;
        } 

        handleCreateQuestion(e);
    }

    const generateReferenceAnswers = async (e) => {
        e.preventDefault();

        if(formData.questionEvaluationCriteria === 0) {
            setErrors({ questionEvaluationCriteria: 'Please select an evaluation criteria.' });
            return;
        }

        setLoaderMessage('Getting Reference Answers');
        setLoading(true);
        formDialogRef.current.close();

        const criteria = ['0-1', '1-5'];
        let userQuery = {
            interview_name: interview.interview_name,
            evaluation_criteria: allEvaluationCategories[formData.questionEvaluationCriteria]?.description,
            question_text: formData.questionText,
            scoring_criteria: criteria[formData.scoringCriteria],
            text_instructions: formData.textInstructions,
            context: interviewInstructions.context_video_text
        };

        if(formData.referenceAnswersQuery.length !== 0) {
            userQuery.previous_answers = JSON.stringify(formData.referenceAnswers);
            userQuery.previous_answers_updates = formData.referenceAnswersQuery;
        }

        try {
            const res = await fetch(getApiUrl('/api/generate-reference-answers'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery, gptModelName: formData.gptModelName })
            });
            const data = await res.json();
            if(res.ok) {
                const jsonData = JSON.parse(data.answers);
                const answers = jsonData.reduce((acc, x) => {
                    acc[x.score] = x.answer;
                    return acc;
                }, {});
                
                console.log(answers);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    referenceAnswers: answers
                }))
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        formDialogRef.current.showModal();
    }

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        console.log(formData);

        setLoaderMessage('Creating Interview Question');
        setLoading(true);
        formDialogRef.current.close();

        let questionOrder;
        if(questions && questions[formData.questionSet]) questionOrder = questions[formData.questionSet].length + 1;
        else questionOrder = 1;

        try {
            const res = await fetch(getApiUrl('/api/questions'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_user_id: 3,
                    question_text: formData.questionText,
                    question_type: formData.questionType,
                    media_url: formData.mediaUrl,
                    text_instructions: formData.textInstructions
                })
            });
            const data = await res.json();        // question id -> data.id
            if(res.ok) {
                const linkRes =  await fetch('/api/interview-questions/link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        interview_id: interviewId,
                        question_id: data.id,
                        question_order: questionOrder,
                        question_set: formData.questionSet,
                    })
                });
                const linkData = await linkRes.json();    // interview question id -> linkData.id

                if(linkRes.ok) {
                    linkData.question = data;
                    console.log('Linked question to the interview');
                    if(questions && questions[formData.questionSet]) {
                        setQuestions(prevQuestions => ({
                            ...prevQuestions, [formData.questionSet]: [ ...questions[formData.questionSet], linkData ]
                        }));
                    } else {
                        setQuestions(prevQuestions => ({
                            ...prevQuestions, [formData.questionSet]: [ linkData ]
                        }));
                    }


                    for(let score in formData.referenceAnswers) {
                        if(formData.referenceAnswers[score].length === 0) continue;

                        const refRes = await fetch(getApiUrl('/api/job-interview-prompts/reference-answers/'), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                interview_question_id: linkData.id,
                                evaluation_category_id: formData.questionEvaluationCriteria,
                                score: score,
                                answer: formData.referenceAnswers[score],
                            })
                        })
                        const refData = await refRes.json();
                        console.log('reference answer created successfully');
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setFormData(INITIAL_QUESTION_DATA);
        setCurrentPage(1);
    }

    // For generating questions
    const generateQuestions = async (e) => {
        e.preventDefault();

        setLoading(true);
        setLoaderMessage('Generating Interview Questions');
        let sendJD = true;
        if(gptResponse) sendJD = false;

        try {
            const url = getApiUrl('/api/generate-interview-questions');
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userQuery: {
                        job_title: job.job_title,
                        job_description: sendJD ? job.job_description : "",
                        interview_name: interview.interview_name,
                        question_format: formData.questionFormat,
                        text: formData.userQueryText,
                        previous_response: gptResponse ? JSON.stringify(Object.values(gptResponse)) : '',
                        context_text: interviewInstructions.context_video_text
                    }
                })
            });
            const data = await res.json();
            console.log(data.questions);
            const responses = JSON.parse(data.questions);
            setGptResponse(responses.reduce((acc, response, idx) => {
                acc[idx] = response;
                return acc;
            }, {}));
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    return (
        <div className="create-questions-container">
            { loading && (
                <div className="loader-container">
                    <div className="loader"></div>
                    <div className="loader-message">{loaderMessage}...</div>
                </div>
            )}

            <header className="create-questions-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>

            <dialog className='create-question-modal' ref={formDialogRef}>
                <div className='close-button' onClick={() => formDialogRef.current.close()}>
                    <IoClose color='#888' fontSize='1.8rem' />
                </div>
                <div className='progress-status'>
                    <div className={`progress-bar ${currentPage >= 1 ? 'done' : ''}`}></div>
                    <div className={`progress-bar ${currentPage >= 2 ? 'done' : ''}`}></div>
                </div>
                <form className='question-form'>
                    {
                        currentPage === 1 && (<>
                            <div className="form-group textarea">
                                <textarea
                                    name="questionText"
                                    value={formData.questionText}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label className={formData.questionText ? 'filled' : ''}>Question Text*</label>
                                {errors.questionText && <p className="error-text">{errors.questionText}</p>}
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="textInstructions"
                                    value={formData.textInstructions}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                                <label className={formData.textInstructions ? 'filled' : ''}>Text Instructions*</label>
                                {errors.textInstructions && <p className="error-text">{errors.textInstructions}</p>}
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="mediaUrl"
                                    value={formData.mediaUrl}
                                    onChange={handleChange}
                                    required
                                />
                                <label className={formData.mediaUrl ? 'filled' : ''}>Media URL*</label>
                                {errors.mediaUrl && <p className="error-text">{errors.mediaUrl}</p>}
                            </div>
                            <div className="form-group">
                                <select
                                    name="questionType"
                                    value={formData.questionType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='' disabled={true}>Select Question Media Type*</option>
                                    <option value='Video'>Video</option>
                                    <option value='Image'>Image</option>
                                </select>
                                <label className='filled'>Question Media Type*</label>
                                {errors.questionType && <p className="error-text">{errors.questionType}</p>}
                            </div>
                            <div className="form-group">
                                <select
                                    name="questionSet"
                                    value={formData.questionSet}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='filled' disabled={true}>Select Question Set*</option>
                                    { Array.from({ length: numberOfQuestionSet }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                                <label className='filled'>Question Set*</label>
                                {errors.questionSet && <p className="error-text">{errors.questionSet}</p>}
                            </div>
                        </>)
                    }
                    {
                        currentPage === 2 && (<>
                            <div className="form-group">
                                <select
                                    name="questionEvaluationCriteria"
                                    value={formData.questionEvaluationCriteria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={0} disabled={true}>Select Evaluation Criteria*</option>
                                {
                                    allEvaluationCategories && interviewEvaluationCriteria.length !== 0 && interviewEvaluationCriteria.map(criterion => (
                                        allEvaluationCategories[criterion.evaluation_category_id].evaluation_level === 'question' && <option key={criterion.id} value={criterion.evaluation_category_id}>{ allEvaluationCategories[criterion.evaluation_category_id].name }</option>
                                    ))
                                }
                                </select>
                                <label className={formData.questionEvaluationCriteria ? 'filled' : ''}>Evalaution Criteria*</label>
                                {errors.questionEvaluationCriteria && <p className="error-text">{errors.questionEvaluationCriteria}</p>}
                            </div>
                            <div className="form-group">
                                <select
                                    name="scoringCriteria"
                                    value={formData.scoringCriteria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value='0'>0 - 1</option>
                                    <option value='1'>1 - 5</option>
                                </select>
                                <label className={formData.scoringCriteria ? 'filled' : ''}>Scoring Criteria*</label>
                                {errors.scoringCriteria && <p className="error-text">{errors.scoringCriteria}</p>}
                            </div>

                            { formData.scoringCriteria === 0 && (<>
                                {
                                    [0, 1].map(score => (
                                        <div className='form-group reference-answers' key={score}>
                                            <textarea name={`referenceAnswer-${score}`} value={formData.referenceAnswers[score]} onChange={handleChange}></textarea>
                                            <label className={formData.scoringCriteria ? 'filled' : ''}>Score: {score}</label>
                                        </div>
                                    ))
                                }
                            </>)}
                            { formData.scoringCriteria === 1 && (<>
                                    {
                                        [1, 2, 3, 4, 5].map(score => (
                                            <div className='form-group reference-answers' key={score}>
                                                <textarea name={`referenceAnswer-${score}`} value={formData.referenceAnswers[score]} onChange={handleChange}></textarea>
                                                <label className={formData.scoringCriteria ? 'filled' : ''}>Score: {score}</label>
                                            </div>
                                        ))
                                    }
                            </>)}

                            { formData.referenceAnswers.length !== 0 && (
                                <div className='form-group reference-answers'>
                                    <textarea name='referenceAnswersQuery' value={formData.referenceAnswersQuery} onChange={handleChange}></textarea>
                                    <label className={formData.referenceAnswersQuery ? 'filled' : ''}>Reference Answers Query</label>
                                </div>
                            )}
                        </>)
                    }
                        
                    <div className='actions'>
                        
                        { currentPage === 2 && (<>
                            <select
                                name="gptModelName"
                                onChange={handleChange}
                                required
                            >
                                <option defaultChecked={true} value='gpt-4o-mini'>GPT 4o-mini</option>
                                <option value='gpt-4o'>GPT 4o</option>
                            </select>
                            <button className='primary generate-ref-answers' onClick={generateReferenceAnswers}>Get Reference Answers</button>
                        </>)}
                        
                        <button className='secondary back' onClick={handleBack}>Back</button>
                        <button className='primary next' onClick={handleNext} type='submit'>{ currentPage === 2 ? 'Create' : 'Next'}</button>
                    </div>
                </form>
            </dialog>

            <main className="create-questions-main">
                <div className="poppins-regular">
                    <h2>Interview Name: { interview && interview.interview_name }</h2>
                    <p id='tag'>{ interview && interview.status }</p>
                </div>
                <div>
                    <button className='primary' onClick={() => {
                        setFormData(INITIAL_QUESTION_DATA);
                        formDialogRef.current.showModal();
                    }}>Create Question</button>
                </div>
            </main>
            
            <main className='generate-questions-form'>
                <h2>Suggest Questions</h2>
                <div className='questions-chatbot'>
                    <form onSubmit={ generateQuestions }>
                        <textarea
                            name='userQueryText'
                            value={formData.userQueryText}
                            placeholder='Enter your prompt for generating questions'
                            onChange={handleChange}
                        />
                        {/* <select
                            name='questionFormat'
                            value={formData.questionFormat}
                            onChange={handleChange}
                        >
                            <option disabled={true}>Select a format for questions</option>
                            {
                                QUESTION_FORMATS.map((format, idx) => (
                                    <option key={idx} value={format[1]}>{ format[0] }</option>
                                ))
                            }
                        </select> */}
                        <button className='primary'>Generate Questions</button>
                    </form>
                </div>
            </main>

            <div className='response-questions'>
            {
                gptResponse && Object.keys(gptResponse).map((key) => (
                    <div className='question' key={key}>
                        <textarea onChange={ (e) => handleResponseChange(e, key) } value={ gptResponse[key].question_script }></textarea>
                        <button className='secondary' onClick={ () => {
                            setFormData(prev => ({ ...prev, questionText: gptResponse[key].question_script }));
                            formDialogRef.current.showModal();
                        }}><FaPlus /></button>
                    </div>
                ))
            }
            </div>

            <div className='questions-list-container'>
                <h3 className='poppins-bold'>Interview Questions</h3>
                <div className='question-set-select poppins-semibold'>
                    {
                        questions && Object.keys(questions).map(set => {
                            return (<span key={set} className={`question-set-option ${questionSetToDisplay == set ? 'selected' : ''}`} onClick={() => setQuestionSetToDisplay(parseInt(set))}>Set { set }</span>)
                        })
                    }
                </div>
                { (questions && questions[questionSetToDisplay] && questions[questionSetToDisplay].length !== 0) ? (
                    <ul className="questions-list poppins-regular">
                        { questions[questionSetToDisplay].sort((a, b) => a.question_order - b.question_order).map(question => (
                            <li key={question.id}>
                                <div className='left'>
                                    <p><strong>Question: {question.question_order}</strong> {question.question.question_text}</p>
                                    <p><strong>Instructions:</strong> {question.question.text_instructions}</p>
                                </div>
                                <div className='right'>
                                    {question.question.media_url && (
                                        <iframe
                                            src={question.question.media_url}
                                            allow="autoplay; fullscreen"
                                            allowFullScreen
                                            title={`Media for Question ${question.question_order}`}
                                            className="iframe-video"
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>There are no questions for this interview</p>
                )}

            </div>
        </div>
    );
};

export default CreateQuestions;
