import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import editIcon from '../assets/edit_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import './EducationUserProfile.css'; // Reusing the same CSS for consistency

const InternshipUserProfile = () => {
  const { user } = useContext(UserContext);
  const [internshipData, setInternshipData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchInternshipData = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/internships/${user.id}`));
        const data = await response.json();
        console.log('Fetched Internship Data:', data); // Add this line to debug
        setInternshipData(data);
      } catch (error) {
        console.error('Error fetching internship data:', error);
      }
    };

    fetchInternshipData();

    const socket = io(getApiUrl('/'));
    socket.emit('joinRoom', user.id);

    socket.on('internshipData', (data) => {
      setInternshipData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await fetch(getApiUrl(`/api/internship/${id}`), {
        method: 'DELETE'
      });
      setInternshipData((prevData) => prevData.filter((internship) => internship.id !== id));
    } catch (error) {
      console.error('Error deleting internship entry:', error);
    }
  };

  return (
    <div className="education-container">
      <h2>Internships</h2>
      <ul>
        {internshipData.map((internship) => (
          <li key={internship.id} className="education-item">
            <div className="education-text">
              {internship.Company.name} - {internship.InternshipDesignation.name} ({new Date(internship.start_date).toLocaleDateString()} - {internship.is_current ? 'Present' : new Date(internship.end_date).toLocaleDateString()})
            </div>
            <div className="education-actions">
              <img
                src={editIcon}
                alt="Edit"
                className="icon-button"
                onClick={() => navigate(`/edit-internship/${internship.id}`)}
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className="icon-button"
                onClick={() => handleDelete(internship.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/internship-form')} className="add-more-button">Add More Internship Details</button>
    </div>
  );
};

export default InternshipUserProfile;