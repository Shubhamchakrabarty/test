const express = require('express');
const router = express.Router();
const clientUserController = require('../controllers/clientUserController');

router.post('/client-users', clientUserController.createClientUser);
router.get('/client-users', clientUserController.getAllClientUsers);
router.get('/client-users/:id', clientUserController.getClientUserById);
router.put('/client-users/:id', clientUserController.updateClientUser);
router.delete('/client-users/:id', clientUserController.deleteClientUser);

module.exports = router;