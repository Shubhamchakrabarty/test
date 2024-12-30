import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import './EditEvaluation.css';


const EditEvaluation = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({}); // state for form error handling
    const [evaluationCriteria, setEvaluationCriteria] = useState();
    const [allEvaluationCategories, setAllEvaluationCategories] = useState();
    const [selectedEvaluationCriteria, setSelectedEvaluationCriteria] = useState(new Set());
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context
    const { jobId, clientInterviewId } = useParams();
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
        const getEvaluationCriteria = async () => {
            try {
                const url = getApiUrl(`/api/interview-evaluation-criteria/${clientInterviewId}`);
                const res = await fetch(url);
                const criteria = await res.json();

                if(res.status === 200) {
                    console.log(criteria);
                    setEvaluationCriteria(criteria);
                    setSelectedEvaluationCriteria(new Set(criteria.map(criterion => criterion.evaluation_category_id)));
                }
            } catch (error) {
                console.log(error);
            }
        }

        getAllEvaluationCategories();        
        getEvaluationCriteria();
    }, []);

    useEffect(() => {
        if(allEvaluationCategories) console.log(allEvaluationCategories);
    }, [allEvaluationCategories]);

    const addCriteria = (e) => {
        let id = parseInt(e.target.dataset.id);
        console.log(id);
        setSelectedEvaluationCriteria(selectedEvaluationCriteria => new Set([ ...selectedEvaluationCriteria, id]));
    }

    const removeCriteria = (e) => {
        let id = parseInt(e.target.dataset.id);
        console.log(id);
        setSelectedEvaluationCriteria(selectedEvaluationCriteria => {
            return new Set([ ...selectedEvaluationCriteria].filter(criterionId => criterionId !== id));
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let URL, METHOD;
            if(evaluationCriteria) {
                URL = getApiUrl(`/api/interview-evaluation-criteria/${clientInterviewId}`);
                METHOD = 'PUT';
            } else {
                URL = getApiUrl(`/api/interview-evaluation-criteria`);
                METHOD = 'POST';
            }


        } catch (error) {
            console.log(error);
        }
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
                    <h2>Create Evaluation For Interview</h2> {/* Replace "Your Job Listings" with client's name */}

                    <h4>Selected Criteria</h4>
                    <div className='criteria-pills selected'>
                    {
                        selectedEvaluationCriteria.size !== 0 && allEvaluationCategories && ([...selectedEvaluationCriteria]).map(criterionId => (
                            <span onClick={ removeCriteria } data-id={criterionId} key={criterionId} className='pill'>{ allEvaluationCategories[criterionId].name }</span>
                        ))
                    }
                    </div>


                    <h4>Choose From</h4>
                    <div className='criteria-pills'>
                    {
                        allEvaluationCategories && Object.values(allEvaluationCategories).map(criterion => (
                            <span onClick={ addCriteria } data-id={criterion.id} key={criterion.id} className='pill'>{ criterion.name }</span>
                        ))
                    }
                    </div>

                    <button type='submit'>Save Changes</button>
                </div>
            </main>
        </div>
    );
};

export default EditEvaluation;