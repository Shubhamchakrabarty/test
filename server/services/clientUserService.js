const { ClientUser, Client } = require('../models');

// Find client user by both phone number and email
const findClientUserByPhoneAndEmail = async (phoneNumber, email) => {
  return ClientUser.findOne({
    where: {
      phone_number: phoneNumber,
      email: email,
    },
    include: [{ model: Client, as: 'client' }],  // Include the associated Client model
  });
};

// Find client user by phone number
const findClientUserByPhoneNumber = async (phoneNumber) => {
    return ClientUser.findOne({
      where: { phone_number: phoneNumber },
      include: [{ model: Client, as: 'client' }]  // Include associated client data if needed
    });
  };

module.exports = { findClientUserByPhoneAndEmail, findClientUserByPhoneNumber };
