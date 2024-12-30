import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import './CreateInstructions.css';


const CreateInstructions = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // state for form error handling
    const [instructions, setInstructions] = useState();
    const [formData, setFormData] = useState({
        interviewResponseType: '',
        preInterviewInstructions: '',
        welcomeMessage: '',
        welcomeVideoUrl: '',
        contextVideoText: '',
        contextVideoUrl: '',
        language: '',
    });
    const [interview, setInterview] = useState();
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context
    const { jobId, interviewId } = useParams();
    const navigate = useNavigate();

    if (error) {
        console.log("Error: ", error);
    }

    useEffect(() => {
        const getInterview = async () => {
            try {
                const url = getApiUrl(`/api/interviews/${interviewId}`);
                const res = await fetch(url);
                const data = await res.json();

                if(res.status === 200) {
                    setInterview(data);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        
        const getInstructions = async () => {         
            try {
                const url = getApiUrl(`/api/interviews/${interviewId}/instructions`);
                const res = await fetch(url);
                const data = await res.json();

                if(res.status === 200) {
                    setInstructions(data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getInterview();
        getInstructions();
    }, []);

    useEffect(() => {
        
        // welcomeMessage, welcomeVideoUrl, contextVideoText, contextVideoUrl, language
        if(instructions) {
            console.log(instructions);
            setFormData(prevFormData => ({
                ...prevFormData,
                preInterviewInstructions: instructions.pre_interview_instructions,
                welcomeMessage: instructions.welcome_message,
                welcomeVideoUrl: instructions.welcome_video_url,
                contextVideoText: instructions.context_video_text,
                contextVideoUrl: instructions.context_video_url,
                interviewResponseType: instructions.interview_response_type,
                language: instructions.language,
            }));
        }
    }, [instructions]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        console.log(name, value);
        if(name === 'interviewResponseType') {
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
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let URL, METHOD;
            if(instructions) {
                URL = getApiUrl(`/api/interviews/${interviewId}/instructions/${instructions.id}`);
                METHOD = 'PUT';
            } else {
                URL = getApiUrl(`/api/interviews/${interviewId}/instructions/`);
                METHOD = 'POST';
            }

            const res = await fetch(URL, {
                method: METHOD,
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

            if(res.ok) {
                console.log('Instructions Updated Successfully');
            }
        } catch (error) {
            console.log(error);
        }

        navigate(-1);
    }

    if(loading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader-message">Saving Instructions...</div>
            </div>
        )
    }

    return (
        <div className="create-instructions-container">
            <header className="create-instructions-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>
            <main className="create-instructions-main">
                <div className="poppins-regular">
                    <h2>Create Instructions for Job</h2> {/* Replace "Your Job Listings" with client's name */}

                    <form className='instructions-form' onSubmit={handleSubmit}>
                        <div className="form-group textarea">
                            <textarea
                                type="text"
                                name="preInterviewInstructions"
                                value={formData.preInterviewInstructions ?? ''}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <label className={formData.preInterviewInstructions ? 'filled' : ''}>Pre Interview Instructions*</label>
                            {errors.preInterviewInstructions && <p className="error-text">{errors.preInterviewInstructions}</p>}
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="welcomeMessage"
                                value={formData.welcomeMessage ?? ''}
                                onChange={handleChange}
                                required
                            />
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
                                <option value='en-US'>English (US)</option>
                            </select>
                            {errors.language && <p className="error-text">{errors.language}</p>}
                        </div>


                        {/* <div className="form-group">
                            <select
                                name="interviewCriteria"
                                value={formData.interviewCriteria}
                                onChange={handleChange}
                                required
                            >
                                <option value='Evaluation Criteria'>Select Evaluation Criteria</option>
                            {
                                allEvaluationCategories && Object.values(allEvaluationCategories).map(category => (
                                    <option key={category.id} value={category.id}>{ category.name }</option>
                                ))
                            }
                            </select>
                            {errors.interviewCriteria && <p className="error-text">{errors.interviewCriteria}</p>}
                        </div>

                        <div className='criteria-pills'>
                        {
                            formData.interviewCriteria.size !== 0 && [...formData.interviewCriteria].map(criterionId => (
                                <span onClick={removeInterviewCriteria} data-id={criterionId} key={criterionId} className='pill'>{ allEvaluationCategories[criterionId].name }</span>
                            ))
                        }
                        </div> */}

                        <button type='submit'>Save Changes</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateInstructions;