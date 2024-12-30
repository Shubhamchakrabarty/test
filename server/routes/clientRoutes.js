const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Route to create a new client
router.post('/clients', clientController.createClient);

// Route to update an existing client
router.put('/clients/:id', clientController.updateClient);

// Route to get all clients
router.get('/clients', clientController.getAllClients);

// Route to get a client by ID
router.get('/clients/:id', clientController.getClientById);

// Route to delete a client
router.delete('/clients/:id', clientController.deleteClient);

module.exports = router;
