import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import './CreateEvaluationCriteria.css';


const CreateEvaluationCriteria = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // state for form error handling
    const [allEvaluationCategories, setAllEvaluationCategories] = useState();
    const [formData, setFormData] = useState({
        evaluationCriteriaName: '',
        evaluationCriteriaLevel: 'interview',
        evaluationCriteriaDescription: '',
    });
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context
    const navigate = useNavigate();

    if (error) {
        console.log("Error: ", error);
    }

    useEffect(() => {
        const getAllEvaluationCategories = async () => {
            try {
                const url = getApiUrl(`/api/job-interview-evaluation-categories`);
                const res = await fetch(url);
                const categories = await res.json();

                if(res.status === 200) {
                    setAllEvaluationCategories(categories);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getAllEvaluationCategories(); 
    }, []);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if(name === 'evaluationCriteriaName') {
            setFormData({ ...formData, evaluationCriteriaName: value });
        } else if(name === 'evaluationCriteriaLevel') {
            if(value.length === 0) value = 0;
            setFormData(prevFormData => ({
                ...prevFormData,
                evaluationCriteriaLevel: value
            }));
        } else if(name === 'evaluationCriteriaDescription') {
            setFormData(prevFormData => ({
                ...prevFormData,
                evaluationCriteriaDescription: value
            }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(getApiUrl('/api/job-interview-evaluation-categories'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.evaluationCriteriaName,
                    evaluation_level: formData.evaluationCriteriaLevel,
                    description: formData.evaluationCriteriaDescription
                })
            });
            if(res.ok) {
                console.log('Evaluation Criteria Created Successfully');
                navigate(-1);
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
                <div className="loader-message">Fetching Evaluation Criteria...</div>
            </div>
        )
    }

    return (
        <div className="create-evaluation-container">
            <header className="create-evaluation-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>
            <main className="create-evaluation-main">
                <div className="poppins-regular">
                    <h2>Create Evaluation Criteria</h2> 

                    <form className='evaluation-form' onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="evaluationCriteriaName"
                                value={formData.evaluationCriteriaName}
                                onChange={handleChange}
                                required
                            />
                            <label className={formData.evaluationCriteriaName ? 'filled' : ''}>Evaluate Criteria Name *</label>
                            {errors.evaluationCriteriaName && <p className="error-text">{errors.evaluationCriteriaName}</p>}
                        </div>
                        <div className="form-group">
                            <select
                                name="evaluationCriteriaLevel"
                                value={formData.evaluationCriteriaLevel}
                                onChange={handleChange}
                                required
                            >
                                <option disabled='true'>Evaluation Criteria Level*</option>
                                <option value='interview'>Interview Level</option>
                                <option value='question'>Question Level</option>
                            </select>
                            {errors.evaluationCriteriaLevel && <p className="error-text">{errors.evaluationCriteriaLevel}</p>}
                        </div>
                        <div className="form-group textarea">
                            <textarea
                                name="evaluationCriteriaDescription"
                                value={formData.evaluationCriteriaDescription ?? ''}
                                onChange={handleChange}
                                required
                            ></textarea>
                            <label className={formData.evaluationCriteriaDescription ? 'filled' : ''}>Description*</label>
                            {errors.evaluationCriteriaDescription && <p className="error-text">{errors.evaluationCriteriaDescription}</p>}
                        </div>
                        
                        <button type='submit' className='primary'>Create</button>
                    </form>


                    <h2>Existing Evaluation Criteria</h2>
                    <div className='criteria-pills'>
                    {
                        allEvaluationCategories && allEvaluationCategories.map(criterion => (
                            <span key={criterion.id} className='pill'>{ criterion.name } [{ criterion.evaluation_level }]</span>
                        ))
                    }
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateEvaluationCriteria;