const { ClientUser } = require('../models');

// Create a new ClientUser
const createClientUser = async (req, res) => {
    const { client_id, user_name, designation, email, phone_number } = req.body;
    console.log(`Received request to create client user: ${JSON.stringify(req.body)}`);
  
    try {
      // Ensure required fields are provided
      if (!client_id || !user_name || !email) {
        return res.status(400).json({ message: 'client_id, user_name, and email are required.' });
      }
  
      const newUser = await ClientUser.create({
        client_id,
        user_name,
        designation,
        email,
        phone_number: phone_number || null, // Handle optional phone number
        is_active: true, // Default to active
      });
  
      console.log(`New client user created: ${JSON.stringify(newUser)}`);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating client user:', error.message || error);
      res.status(500).json({ message: 'Error creating client user' });
    }
  };
  

// Get all ClientUsers
const getAllClientUsers = async (req, res) => {
  console.log('Received request to fetch all client users');

  try {
    const clientUsers = await ClientUser.findAll();
    res.status(200).json(clientUsers);
  } catch (error) {
    console.error('Error fetching client users:', error.message || error);
    res.status(500).json({ message: 'Error fetching client users' });
  }
};

// Get a ClientUser by ID
const getClientUserById = async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to fetch client user with ID ${id}`);
  
    try {
      const clientUser = await ClientUser.findByPk(id);
  
      if (!clientUser) {
        return res.status(404).json({ message: 'Client user not found' });
      }
  
      res.status(200).json(clientUser);
    } catch (error) {
      console.error('Error fetching client user:', error.message || error);
      res.status(500).json({ message: 'Error fetching client user' });
    }
  };

// Update a ClientUser
const updateClientUser = async (req, res) => {
  const { id } = req.params;
  const { user_name, designation, email, phone_number, is_active } = req.body;
  console.log(`Received request to update client user with ID ${id}: ${JSON.stringify(req.body)}`);

  try {
    const clientUser = await ClientUser.findByPk(id);

    if (!clientUser) {
      return res.status(404).json({ message: 'Client user not found' });
    }

    await clientUser.update({
      user_name,
      designation,
      email,
      phone_number,
      is_active,
    });

    console.log(`Client user updated: ${JSON.stringify(clientUser)}`);
    res.status(200).json(clientUser);
  } catch (error) {
    console.error('Error updating client user:', error.message || error);
    res.status(500).json({ message: 'Error updating client user' });
  }
};



// Delete a ClientUser
const deleteClientUser = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete client user with ID ${id}`);

  try {
    const clientUser = await ClientUser.findByPk(id);

    if (!clientUser) {
      return res.status(404).json({ message: 'Client user not found' });
    }

    await clientUser.destroy();
    console.log(`Client user with ID ${id} deleted`);
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting client user:', error.message || error);
    res.status(500).json({ message: 'Error deleting client user' });
  }
};

module.exports = {
    createClientUser,
    getAllClientUsers,
    getClientUserById,
    updateClientUser,
    deleteClientUser,
  };
