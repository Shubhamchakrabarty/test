const { UserCustomSection } = require('../models');

// Add user custom sections
exports.addUserCustomSections = async (req, res) => {
  const { user_id, customSections } = req.body;
  console.log('Received custom sections data:', customSections); // Debugging line
  try {
    const results = await UserCustomSection.bulkCreate(customSections.map(section => ({
      user_id,
      section_title: section.section_title,
      details: section.details,
    })));
    console.log('Insert result:', results); // Debugging line
    res.json({ message: 'Custom sections added successfully' });
  } catch (error) {
    console.error('Error adding custom sections:', error);
    res.status(500).json({ message: 'Error adding custom sections' });
  }
};