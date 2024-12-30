import React, { useState, useContext, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useDropzone } from 'react-dropzone';
import styles from './CvUpload.module.css'; // Updated CSS file
import io from 'socket.io-client';

const CvUploadForm = () => {
  const { user } = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId, userJobId, isApplied } = location.state || {};
  console.log(location);

  const socket = io(getApiUrl('/'));

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      setFile(acceptedFiles[0]);
    } else {
      alert('Only PDF files are allowed. Please upload a valid PDF.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('User is not set. Please log in again.');
      navigate('/login');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('job_id', jobId);
    formData.append('socketId', socket.id);
    if (file) {
      formData.append('cv', file);
    }

    try {
      const response = await fetch(getApiUrl('/api/upload-cv'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setFile(null);

      // if (isApplied) {
      //   navigate(`/interviews/${jobId}`, {
      //     state: { userJobId }
      //   });
      // } else {
      //   navigate(`/job-details/${jobId}`, {
      //     state: { userJobId }
      //   });
      // }

      // Navigate to the job interviews
      navigate(`/interviews/${jobId}`, {
        state: { userJobId }
      });

    } catch (error) {
      console.error('Error while uploading:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles['cv-upload-container']} poppins-medium`}>
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <span className={styles['logo-peh']}>Peh</span>
          <span className={styles['logo-chaan']}>chaan</span>
        </Link>
      </header>
      <h2 className={styles['cv-upload-title']}>Upload Your CV</h2>
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className={styles['drop-text']}>Drop the files here ...</p>
            ) : (
              <p className={styles['drop-text']}>
                Drag 'n' drop a CV file here, or click to select one
              </p>
            )}
            {file && (
              <p className={styles['selected-file']}>
                Selected file: {file.name}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`${styles[file ? 'upload-button' : 'upload-button-disabled']} poppins-medium`}
            disabled={!file}
          >
            Upload
          </button>
        </form>
      )}
    </div>
  );
};

export default CvUploadForm;
