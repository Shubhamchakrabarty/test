const express = require('express');
const router = express.Router();
const {
    getProjectLevels,
    addUserProjects,
    getProjectsByUserId,
    getProjectById,
    updateProject,
    deleteProjectById,
  } = require('../controllers/projectsController');
  
  router.get('/levels', getProjectLevels);
  router.post('/add', addUserProjects);
  router.get('/user/:userId', getProjectsByUserId);
  router.get('/:id', getProjectById);
  router.patch('/:id', updateProject);
  router.delete('/:id', deleteProjectById);

module.exports = router;