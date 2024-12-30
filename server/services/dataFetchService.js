const { Education, University, Degree, Internship, Company, InternshipDesignation, Job, Designation, UserProject, ProjectLevel } = require('../models');

const getEducationData = async (userId) => {
  try {
    const educationData = await Education.findAll({
      where: { user_id: userId },
      include: [
        { model: University, attributes: ['name'] },
        { model: Degree, attributes: ['course'] }
      ]
    });
    return educationData;
  } catch (error) {
    console.error('Error fetching education data:', error);
    throw new Error('Error fetching education data');
  }
};

const getInternshipsByUserId = async (userId) => {
  try {
    const internships = await Internship.findAll({
      where: { user_id: userId },
      include: [
        { model: Company, attributes: ['name'] },
        { model: InternshipDesignation, attributes: ['name'] }
      ]
    });
    return internships;
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw new Error('Error fetching internships');
  }
};

const getJobsByUserId = async (userId) => {
  try {
    const jobs = await Job.findAll({
      where: { user_id: userId },
      include: [
        { model: Company, attributes: ['name'] },
        { model: Designation, attributes: ['name'] }
      ]
    });
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Error fetching jobs');
  }
};

const getProjectsByUserId = async (userId) => {
  try {
    const projects = await UserProject.findAll({
      where: { user_id: userId },
      include: [
        { model: ProjectLevel, attributes: ['name'] },
      ],
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Error fetching projects');
  }
};

module.exports = {
  getEducationData,
  getInternshipsByUserId,
  getJobsByUserId,
  getProjectsByUserId
};