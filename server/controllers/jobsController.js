// controllers/jobsController.js
const { Company, Designation, Job, InternshipDesignation, Internship } = require('../models');
const { Op } = require('sequelize');

// Fetch companies with lazy loading and search functionality
exports.getCompanies = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 20 } = req.query;
    const companies = await Company.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`
        }
      },
      offset: parseInt(skip),
      limit: parseInt(take)
    });
    res.json(companies);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fetch designations with lazy loading and search functionality
exports.getDesignations = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 20 } = req.query;
    const designations = await Designation.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`
        }
      },
      offset: parseInt(skip),
      limit: parseInt(take)
    });
    res.json(designations);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add job entries to the Jobs table
exports.addJob = async (req, res) => {
  try {
    const { user_id, designation_id, company_id, is_current, start_date, end_date, experience_summary } = req.body;

    // Validate input data
    if (!user_id || !designation_id || !company_id || !start_date || (is_current !== true && !end_date)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new job record
    const newJob = await Job.create({
      user_id,
      designation_id,
      company_id,
      is_current,
      start_date,
      end_date: is_current ? null : end_date,
      experience_summary
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch internship designations with lazy loading and search functionality
exports.getInternshipDesignations = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 20 } = req.query;
    const designations = await InternshipDesignation.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`
        }
      },
      offset: parseInt(skip),
      limit: parseInt(take)
    });
    res.json(designations);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Add internship entries to the Internships table
exports.addInternship = async (req, res) => {
  try {
    const { user_id, designation_id, company_id, is_current, start_date, end_date, experience_summary } = req.body;

    // Validate input data
    if (!user_id || !designation_id || !company_id || !start_date || (is_current !== true && !end_date)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new internship record
    const newInternship = await Internship.create({
      user_id,
      designation_id,
      company_id,
      is_current,
      start_date,
      end_date: is_current ? null : end_date,
      experience_summary
    });

    res.status(201).json(newInternship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch internships by user ID
exports.getInternshipsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const internships = await Internship.findAll({
      where: { user_id: userId },
      include: [
        { model: Company, attributes: ['name'] },
        { model: InternshipDesignation, attributes: ['name'] }
      ]
    });
    res.status(200).json(internships);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fetch an internship by its ID
exports.getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id, {
      include: [
        { model: Company, attributes: ['name'] },
        { model: InternshipDesignation, attributes: ['name'] }
      ]
    });
    res.json(internship);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update an internship entry
exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation_id, company_id, is_current, start_date, end_date, experience_summary } = req.body;

    const internship = await Internship.findByPk(id);
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    internship.designation_id = designation_id;
    internship.company_id = company_id;
    internship.is_current = is_current;
    internship.start_date = start_date;
    internship.end_date = end_date;
    internship.experience_summary = experience_summary;

    await internship.save();
    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an internship entry
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByPk(id);
    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    await internship.destroy();
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch a single job entry by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id,{
      include: [
        { model: Company, attributes: ['name'] },
        { model: Designation, attributes: ['name'] }
      ]
    });
    res.json(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a job entry
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_id, designation_id, is_current, start_date, end_date, experience_summary } = req.body;
    const job = await Job.findOne({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    job.company_id = company_id;
    job.designation_id = designation_id;
    job.is_current = is_current;
    job.start_date = start_date;
    job.end_date = is_current ? null : end_date;
    job.experience_summary = experience_summary;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fetch all jobs by user ID
exports.getJobsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const jobs = await Job.findAll({
      where: { user_id: userId },
      include: [
        { model: Company, attributes: ['name'] },
        { model: Designation, attributes: ['name'] }
      ]
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).send(error.message);
  }
};


// Delete a job entry by ID
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    await job.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};