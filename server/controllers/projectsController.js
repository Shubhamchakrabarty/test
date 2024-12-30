// server/controllers/projectsController.js
const { ProjectLevel, UserProject } = require('../models');

// Fetch all project levels
exports.getProjectLevels = async (req, res) => {
  try {
    const levels = await ProjectLevel.findAll();
    res.json(levels);
  } catch (error) {
    console.error('Error fetching project levels:', error);
    res.status(500).json({ message: 'Error fetching project levels' });
  }
};

// Add user projects
exports.addUserProjects = async (req, res) => {
    const { user_id, projects } = req.body;
    console.log('Received projects data:', projects); // Debugging line
    try {
      const results = await UserProject.bulkCreate(projects.map(project => ({
        user_id,
        project_level_id: project.project_level_id,
        project_name: project.project_name,
        start_date: project.start_date,
        end_date: project.end_date,
        project_summary: project.project_summary,
      })));
      console.log('Insert result:', results); // Debugging line
      res.json({ message: 'Projects added successfully' });
    } catch (error) {
      console.error('Error adding projects:', error);
      res.status(500).json({ message: 'Error adding projects' });
    }
  };

// Fetch all projects by user id
exports.getProjectsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await UserProject.findAll({
      where: { user_id: userId },
      include: [
        { model: ProjectLevel, attributes: ['name'] },
      ],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Fetch a single project entry by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await UserProject.findByPk(id, {
      include: [
        { model: ProjectLevel, attributes: ['name'] },
      ],
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Update a project entry
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_level_id, project_name, start_date, end_date, project_summary } = req.body;
    const project = await UserProject.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    project.project_level_id = project_level_id;
    project.project_name = project_name;
    project.start_date = start_date;
    project.end_date = end_date;
    project.project_summary = project_summary;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete a project entry
exports.deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await UserProject.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};