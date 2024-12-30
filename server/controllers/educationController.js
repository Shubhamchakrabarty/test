// controllers/educationController.js
const { Education, University, Degree } = require('../models');

const addEducation = async (req, res) => {
  try {
    const { user_id, university_id, degree_id, cgpa, start_date, end_date, major } = req.body;

    // Validate input data
    if (!user_id || !university_id || !degree_id || !cgpa || !start_date || !end_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the end date is after the start date
    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Create a new education record
    const newEducation = await Education.create({
      user_id,
      university_id,
      degree_id,
      major,
      cgpa,
      start_date,
      end_date
    });

    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEducationData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const educationData = await Education.findAll({
      where: { user_id: userId },
      include: [
        { model: University, attributes: ['name'] },
        { model: Degree, attributes: ['course'] }
      ]
    });
    res.status(200).json(educationData);
  } catch (error) {
    console.error('Error fetching education data:', error);
    res.status(500).json({ message: 'Error fetching education data' });
  }
};

const updateEducation = async (req, res) => {
  const educationId = req.params.id;
  const { university_id, degree_id, cgpa, start_date, end_date, major } = req.body;

  try {
    const education = await Education.findByPk(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    education.university_id = university_id || education.university_id;
    education.degree_id = degree_id || education.degree_id;
    education.cgpa = cgpa || education.cgpa;
    education.major = major || education.major;
    education.start_date = start_date || education.start_date;
    education.end_date = end_date || education.end_date;
    education.major = major || education.major;

    await education.save();

    res.status(200).json(education);
  } catch (error) {
    console.error('Error updating education data:', error);
    res.status(500).json({ message: 'Error updating education data' });
  }
};

const deleteEducation = async (req, res) => {
  const educationId = req.params.id;

  try {
    const education = await Education.findByPk(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    await education.destroy();

    res.status(200).json({ message: 'Education entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting education data:', error);
    res.status(500).json({ message: 'Error deleting education data' });
  }
};

const getEducationEntryById = async (req, res) => {
  const educationId = req.params.id;

  try {
    const educationEntry = await Education.findOne({
      where: { id: educationId },
      include: [
        { model: University, attributes: ['name'] },
        { model: Degree, attributes: ['course'] }
      ]
    });
    res.status(200).json(educationEntry);
  } catch (error) {
    console.error('Error fetching education entry:', error);
    res.status(500).json({ message: 'Error fetching education entry' });
  }
};

module.exports = { addEducation, getEducationData, updateEducation, deleteEducation, getEducationEntryById };