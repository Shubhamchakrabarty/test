import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { UserContext } from '../context/UserContext';
import { getApiUrl } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import editIcon from '../assets/edit_icon.png';
import deleteIcon from '../assets/delete_icon.png';
import './EducationUserProfile.css'; // Reusing the same CSS for consistency

const ProjectUserProfile = () => {
  const { user } = useContext(UserContext);
  const [projectData, setProjectData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchProjectData = async () => {
      try {
        const response = await fetch(getApiUrl(`/api/projects/user/${user.id}`));
        const data = await response.json();
        console.log('Fetched Project Data:', data); // Add this line to debug
        setProjectData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();

    const socket = io(getApiUrl('/'));
    socket.emit('joinRoom', user.id);

    socket.on('projectData', (data) => {
      setProjectData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await fetch(getApiUrl(`/api/projects/${id}`), {
        method: 'DELETE'
      });
      setProjectData((prevData) => prevData.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error deleting project entry:', error);
    }
  };

  return (
    <div className="education-container">
      <h2>Projects</h2>
      <ul>
        {projectData.map((project) => (
          <li key={project.id} className="education-item">
            <div className="education-text">
              {project.ProjectLevel.name} - {project.project_name} ({new Date(project.start_date).toLocaleDateString()} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Present'})
            </div>
            <div className="education-actions">
              <img
                src={editIcon}
                alt="Edit"
                className="icon-button"
                onClick={() => navigate(`/edit-project/${project.id}`)}
              />
              <img
                src={deleteIcon}
                alt="Delete"
                className="icon-button"
                onClick={() => handleDelete(project.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/projects-form')} className="add-more-button">Add More Projects</button>
    </div>
  );
};

export default ProjectUserProfile;