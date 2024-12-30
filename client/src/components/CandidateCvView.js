import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getApiUrl } from '../utils/apiUtils';
import styles from './CandidateCvView.module.css';

export default function CandidateCvView() {
    // const styles = null;
    const { userId, jobId } = useParams();
    const [cvDetails, setCvDetails] = useState(null);
    const [cvExists, setCvExists] = useState(null);
    const [parsedCv, setParsedCv] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkCvExists = async () => {
            try {
                const response = await fetch(getApiUrl(`/api/check-cv/${userId}/${jobId}`));
                const data = await response.json();
                setCvExists(data.uploaded);
                if(!data.uploaded) setLoading(false);
            } catch (error) {
                console.error('Error checking CV existence:', error);
                setError(error);
                setErrorMessage('Failed to check CV existence. Please try again later.');
            }
        };

        const fetchCvDetails = async () => {
            if (cvExists) {
                try {
                    const response = await fetch(getApiUrl(`/api/cv-details/${userId}/${jobId}`));
                    const data = await response.json();
                    console.log(JSON.parse(data.cv_assessment_system));
                    setCvDetails(data);
                    setParsedCv(JSON.parse(data.parsed_cv));
                } catch (error) {
                    console.error('Error fetching CV details:', error);
                    setError(error);
                    setErrorMessage('Failed to fetch CV details. Please try again later.');
                }
                setLoading(false);
            }
        };

        checkCvExists().then(fetchCvDetails);
    }, [userId, jobId, cvExists]);

    const handlePreview = () => {
        if (cvDetails?.file_url) {
            window.open(cvDetails.file_url, '_blank');
        }
    };

    const handleDownload = () => {
        if (cvDetails?.file_url) {
            const link = document.createElement('a');
            link.href = cvDetails.file_url;
            link.download = `${cvDetails.user.firstName}_${cvDetails.user.lastName}_CV.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p>Loading CV details...</p>
            </div>
        );
    }

    if (!cvExists) {
        return (
            <div className={styles.errorContainer}>
                <p>The user has not uploaded their CV during registration.</p>
                <Link to={`/client-jobs/${jobId} /candidates-list`} className={styles.backLink}>
                    Back to Candidates
                </Link>
            </div >
        );
    }

    if (!cvDetails) {
        return (
            <div className={styles.errorContainer}>
                <p>Failed to load CV details. Please try again later.</p>
                <Link to={`/client-jobs/${jobId} /candidates-list`} className={styles.backLink}>
                    Back to Candidates
                </Link>
            </div >
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>{errorMessage}</p>
                <Link to={`/client-jobs/${jobId} /candidates-list`} className={styles.backLink}>
                    Back to Candidates
                </Link>
            </div >
        );
    }

    const evaluationDetails = JSON.parse(cvDetails.cv_assessment_system)?.job_requirements_status || [];
    const satisfiedCount = evaluationDetails.filter((req) => req.satisfied).length;
    const totalCount = evaluationDetails.length;

    return (
        <div className={styles.container}>
            <Link to={`/client-jobs/${jobId}/candidates-list`} className={styles.backLink}>
                Back to Candidates
            </Link>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.name}>
                        {cvDetails.user.firstName} {cvDetails.user.lastName}
                    </h1>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>{cvDetails.user.email}</div>
                        <div className={styles.contactItem}>{cvDetails.user.phoneNumber}</div>
                        <div className={styles.contactItem}>{cvDetails.job.job_title}</div>
                    </div>
                </div>
                
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Evaluation</h2>
                    <p className={styles.summary}>
                        {satisfiedCount}/{totalCount} criteria satisfied
                    </p>
                    <div className={styles.cvContent}>
                        {
                            cvDetails && JSON.parse(cvDetails.cv_assessment_system) && JSON.parse(cvDetails.cv_assessment_system).job_requirements_status.map(requirement => {
                                return <>
                                    <div className={`${styles.cvCard} ${ requirement.satisfied === true ? styles.cvSuccess : styles.cvFail }`}>
                                        <h4>{ requirement.requirement }</h4>
                                        <p className={styles.criteriaStatus}
                                        style={{ color: requirement.satisfied ? 'green' : 'red' }}
                                        >
                                            <strong>
                                                {requirement.satisfied ? 'Criteria Satisfied' : 'Criteria Not Satisfied'}
                                            </strong>
                                        </p>
                                        <p>
                                            <strong>Reason - </strong>{ requirement.reasoning }
                                        </p>
                                    </div>
                                </>
                            })
                        }
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.actions}>
                        <h2 className={styles.sectionTitle}>CV Details</h2>
                        <button className={styles.downloadButton} onClick={handleDownload}>
                            Download CV
                        </button>
                    </div>
                    <div className={styles.cvContent}>
                        {
                            parsedCv && Object.keys(parsedCv).map((field, idx) => {
                                if(parsedCv[field].length !== 0) return <CVCard key={idx} name={field} data={parsedCv[field]} />
                            })
                        }
                    </div>
                </div>

                
            </div>
        </div >
    );
}

function CVCard({ name, data }) {
    const snakeCaseToCapitalize = (string) => {
        const words = string.split('_');
        let result = words.reduce((acc, word) => {
            return acc + word[0].toUpperCase() + word.substr(1) + " ";
        }, '');
        return result;
    }

    return (
        <div className={styles.cvCard}>
            <h3>{ snakeCaseToCapitalize(name) }</h3>
            {/* <ol type='1'> */}
                { data.map((val, i) => <p key={i}>+ { val }</p>) }
            {/* </ol> */}
        </div>
    )
}