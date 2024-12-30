const { Reference } = require('../models');

exports.addReference = async (req, res) => {
    const { user_id, reference_from, reference_contact } = req.body;
    const file_url = req.file ? req.file.location : null;
    console.log('Received data:', { user_id, reference_from, reference_contact, file_url }); // Logging
  
    try {
      const newReference = await Reference.create({
        user_id,
        reference_from,
        reference_contact,
        file_url,
      });
      res.status(201).json(newReference);
    } catch (error) {
      console.error('Error adding reference:', error);
      res.status(500).json({ message: 'Error adding reference' });
    }
  };
