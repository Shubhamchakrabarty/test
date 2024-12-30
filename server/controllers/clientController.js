const { Client } = require('../models');

// Create a new client
module.exports.createClient = async (req, res) => {
  const { name, contact_information } = req.body;
  console.log(`Received request to create client: ${JSON.stringify(req.body)}`);

  try {
    // Basic validation
    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const newClient = await Client.create({ name, contact_information });
    console.log(`New client created: ${JSON.stringify(newClient)}`);

    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error.message || error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

// Update an existing client
module.exports.updateClient = async (req, res) => {
  const { name, contact_information } = req.body;
  const { id } = req.params;
  console.log(`Received request to update client with ID ${id}: ${JSON.stringify(req.body)}`);

  try {
    // Fetch the existing client
    const client = await Client.findByPk(id);

    if (!client) {
      console.log(`Client with ID ${id} not found`);
      return res.status(404).json({ error: 'Client not found' });
    }

    // Update client fields if provided
    client.name = name !== undefined ? name : client.name;
    client.contact_information = contact_information !== undefined ? contact_information : client.contact_information;

    await client.save();
    console.log(`Client updated: ${JSON.stringify(client)}`);

    res.status(200).json(client);
  } catch (error) {
    console.error(`Error updating client with ID ${id}:`, error.message || error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

// Get all clients
module.exports.getAllClients = async (req, res) => {
    console.log('Received request to get all clients');
  
    try {
      const clients = await Client.findAll();
  
      if (clients.length === 0) {
        console.log('No clients found');
        return res.status(404).json({ error: 'No clients found' });
      }
  
      console.log(`Found ${clients.length} clients`);
      res.status(200).json(clients);
    } catch (error) {
      console.error('Error fetching all clients:', error.message || error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  };

// Get a client by ID
module.exports.getClientById = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get client with ID ${id}`);

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      console.log(`Client with ID ${id} not found`);
      return res.status(404).json({ error: 'Client not found' });
    }

    console.log(`Client found: ${JSON.stringify(client)}`);
    res.status(200).json(client);
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error.message || error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

// Delete a client by ID
module.exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to delete client with ID ${id}`);

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      console.log(`Client with ID ${id} not found`);
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();
    console.log(`Client with ID ${id} deleted`);

    res.status(204).send(); // No content, indicating successful deletion
  } catch (error) {
    console.error(`Error deleting client with ID ${id}:`, error.message || error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};
