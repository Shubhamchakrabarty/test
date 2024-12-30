import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import editIcon from '../assets/edit_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import './EducationUserProfile.css'; // Add this new CSS file for styling

const EducationUserProfile = () => {
  const { user } = useContext(UserContext);
  const [educationData, setEducationData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchEducationData = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/education/${user.id}`));
        const data = await response.json();
        console.log('Fetched Education Data:', data); // Add this line to debug
        setEducationData(data);
      } catch (error) {
        console.error('Error fetching education data:', error);
      }
    };

    fetchEducationData();

    const socket = io(getApiUrl('/'));
    socket.emit('joinRoom', user.id);

    socket.on('educationData', (data) => {
      setEducationData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await fetch(getApiUrl(`/api/education/${id}`), {
        method: 'DELETE'
      });
      setEducationData((prevData) => prevData.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error('Error deleting education entry:', error);
    }
  };

  return (
    <div className="education-container">
      <h2>Education</h2>
      <ul>
        {educationData.map((edu) => (
          <li key={edu.id} className="education-item">
            <div className="education-text">
              {edu.University.name} - {edu.Degree.course} in {edu.major} ({new Date(edu.start_date).toLocaleDateString()} - {new Date(edu.end_date).toLocaleDateString()})
            </div>
            <div className="education-actions">
              <div className="icon-button" onClick={() => navigate(`/edit-education/${edu.id}`)}>
                <img src={editIcon} alt="Edit" />
              </div>
              <div className="icon-button" onClick={() => handleDelete(edu.id)}>
                <img src={deleteIcon} alt="Delete" />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/education-form')} className="add-more-button">Add More Education Details</button>
    </div>
  );
};

export default EducationUserProfile;