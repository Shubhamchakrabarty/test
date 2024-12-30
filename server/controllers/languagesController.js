// server/controllers/languagesController.js
const { Language, UserLanguage } = require('../models');

// Fetch all languages
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.findAll();
    res.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ message: 'Error fetching languages' });
  }
};

// Add user languages
exports.addUserLanguages = async (req, res) => {
  const { user_id, languages } = req.body;
  console.log('Received languages data:', languages); // Debugging line
  try {
    const results = await UserLanguage.bulkCreate(languages.map(language => ({
      user_id,
      language_id: language.language_id,
      language_proficiency_user: language.language_proficiency_user,
    })));
    console.log('Insert result:', results); // Debugging line
    res.json({ message: 'Languages added successfully' });
  } catch (error) {
    console.error('Error adding languages:', error);
    res.status(500).json({ message: 'Error adding languages' });
  }
};

// Update language proficiency by Pehchan
exports.updateLanguageProficiency = async (req, res) => {
  const { user_id, language_id, language_proficiency_pehchan } = req.body;
  try {
    const userLanguage = await UserLanguage.findOne({
      where: {
        user_id,
        language_id
      }
    });

    if (!userLanguage) {
      return res.status(404).json({ message: 'User language not found' });
    }

    userLanguage.language_proficiency_pehchan = language_proficiency_pehchan;
    await userLanguage.save();

    res.json({ message: 'Language proficiency updated successfully' });
  } catch (error) {
    console.error('Error updating language proficiency:', error);
    res.status(500).json({ message: 'Error updating language proficiency' });
  }
};