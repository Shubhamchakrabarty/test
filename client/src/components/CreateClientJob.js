import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../utils/apiUtils';
import { ClientUserContext } from '../context/ClientUserContext'; // Import ClientUserContext
import './CreateClientJob.css';


const CreateClientJob = () => {
    const [error, setError] = useState(null); // New state for error handling
    const [errors, setErrors] = useState({}); // New state for error handling
    const [formData, setFormData] = useState({
        jobTitle: '',
        jobDesc: '',
        jobRequirements: {},
        jobCVRequired: 'false',
        jobRequirementsCount: 0,
    });
    const navigate = useNavigate();
    const { clientUser } = useContext(ClientUserContext); // Access client user details from context

    useEffect(() => {
        if(!clientUser) {
            setError('Login to create a new job.');
        }
    }, []);


    if (error) {
        return (
            <div className='error-container'>
                <p>{ error }</p>
                <Link to={`/client-login`} className='link'>
                    Go to Client Login
                </Link>
            </div>
        )
    }

    const handleChange = (e, key) => {
        const { name, value } = e.target;


        
        if(name === 'jobCVRequired') {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
            if(value === 'true') {
                setFormData((prevData) => ({ ...prevData, jobRequirementsCount: 1, jobRequirements: { 0: 'The CV should mention...' } }))
            } else {
                setFormData((prevData) => ({ ...prevData, jobRequirementsCount: 0, jobRequirements: {} }))
            }
        } else if(name  === 'jobRequirements') {
            if(value.length === 0) {
                if(Object.keys(formData.jobRequirements).length === 1) {
                    setFormData((prevData) => ({ ...prevData, jobCVRequired: 'false' }));
                }

                const requirements = formData.jobRequirements;
                delete requirements[key];
                setFormData(prev => ({ 
                    ...prev, 
                    jobRequirements: { ...requirements },
                }));
            } else {
                setFormData(prev => ({ 
                    ...prev, 
                    jobRequirements: { ...formData.jobRequirements, [key]: value },
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        } 
        
        if (name === 'jobTitle') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                jobTitle: value.length !== 0 ? '' : 'Job Title cannot be empty.'
            }));
        } else if (name === 'jobDesc') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                jobDesc: value.length !== 0 ? '' : 'Job Description cannot be empty.'
            }));
        }
    }

    const addRequirementColumn = (e) => {
        e.preventDefault();
        setFormData(prev => ({ 
            ...prev, 
            jobRequirements: { ...formData.jobRequirements, [formData.jobRequirementsCount]: 'The CV should include...' },
            jobRequirementsCount: formData.jobRequirementsCount + 1
        }));
    }

    const handleCreateJob = async (e) => {
        e.preventDefault();
        const requirements = Object.values(formData.jobRequirements).reduce((acc, instruction, idx) => {
            acc += (idx + 1) + ". " + instruction + "\n\n";
            return acc;
        }, "");
        
        try {
            const res = await fetch(getApiUrl("/api/client-jobs"), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_user_id: clientUser.id,
                    job_title: formData.jobTitle,
                    job_description: formData.jobDesc,
                    status: 'Closed',
                })
            });
            
            if(res.ok) {
                const data = await res.json();
                const screeningRes = await fetch(getApiUrl("/api/client-job-screening-requirements"), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        job_id: data.id,
                        cvUploadRequired: formData.jobCVRequired === 'true',
                        cvScreeningInstructions: requirements
                    })
                });

                if(screeningRes.ok) navigate(`${data.id}/interviews`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <div className="create-job-container">
            <header className="create-job-navbar popins-regular">
                <Link to="/" className="logo">
                    <span className="logo-peh">Peh</span><span className="logo-chaan">chaan</span>
                </Link>
                <div>
                    <h2>Welcome, </h2>
                    <h2>{clientUser && clientUser.user_name}</h2> {/* Display user name from context */}
                </div>
            </header>
            <main className="create-job-main">
                <div className="poppins-regular">
                    <h2>Create new Job for { clientUser && clientUser.client.name }</h2> {/* Replace "Your Job Listings" with client's name */}

                    <form className='job-info' onSubmit={handleCreateJob}>
                        <div className="form-group title">
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                required
                            />
                            <label className={formData.jobTitle ? 'filled' : ''}>Job Title*</label>
                            {errors.jobTitle && <p className="error-text">{errors.jobTitle}</p>}
                        </div>
                        <div className="form-group cv-select">
                            <select
                                name="jobCVRequired"
                                value={formData.jobCVRequired}
                                onChange={handleChange}
                                required
                            >
                                <option value='false'>False</option>
                                <option value='true'>True</option>
                            </select>
                                <label className={formData.jobCVRequired ? 'filled' : ''}>CV Upload Required*</label>
                            {errors.jobCVRequired && <p className="error-text">{errors.jobCVRequired}</p>}
                        </div>
                        <div className="form-group">
                            <textarea
                                type="text"
                                name="jobDesc"
                                value={formData.jobDesc}
                                onChange={handleChange}
                                required
                            >
                            </textarea>
                            <label className={formData.jobDesc ? 'filled' : ''}>Job Description*</label>
                            {errors.jobDesc && <p className="error-text">{errors.jobDesc}</p>}
                        </div>
                        {
                            formData.jobCVRequired === 'true' && Object.keys(formData.jobRequirements).map((key, idx) => (
                                <div className='form-group' key={key}>
                                    <textarea
                                        type="text"
                                        name="jobRequirements"
                                        value={formData.jobRequirements[key]}
                                        onChange={(e) => handleChange(e, key)}
                                        placeholder='The CV should include...'
                                        required>
                                    </textarea>
                                    <label className='filled'>CV Instruction {idx + 1}</label>
                                </div>

                            ))
                        }
                        {
                            formData.jobCVRequired === 'true' && (<>
                                <button className='add-instruction secondary' onClick={addRequirementColumn}>New Instruction</button>
                            </>)
                        }
                        <button className='primary' type='submit'>Create Job</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateClientJob;