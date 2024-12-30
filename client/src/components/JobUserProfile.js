import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import editIcon from '../assets/edit_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import './EducationUserProfile.css'; // Reusing the same CSS for consistency

const JobUserProfile = () => {
  const { user } = useContext(UserContext);
  const [jobData, setJobData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchJobData = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/jobs/${user.id}`));
        const data = await response.json();
        console.log('Fetched Job Data:', data);
        setJobData(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };

    fetchJobData();

    const socket = io(getApiUrl('/'));
    socket.emit('joinRoom', user.id);

    socket.on('jobData', (data) => {
      setJobData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await fetch(getApiUrl(`/api/job/${id}`), {
        method: 'DELETE'
      });
      setJobData((prevData) => prevData.filter((job) => job.id !== id));
    } catch (error) {
      console.error('Error deleting job entry:', error);
    }
  };

  return (
    <div className="education-container">
      <h2>Work Experience</h2>
      <ul>
        {jobData.map((job) => (
          <li key={job.id} className="education-item">
            <div className="education-text">
              {job.Company.name} - {job.Designation.name} ({new Date(job.start_date).toLocaleDateString()} - {job.is_current ? 'Present' : new Date(job.end_date).toLocaleDateString()})
            </div>
            <div className="education-actions">
              <img
                src={editIcon}
                alt="Edit"
                className="icon-button"
                onClick={() => navigate(`/edit-job/${job.id}`)}
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className="icon-button"
                onClick={() => handleDelete(job.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/jobs-form')} className="add-more-button">Add More Job Details</button>
    </div>
  );
};

export default JobUserProfile;