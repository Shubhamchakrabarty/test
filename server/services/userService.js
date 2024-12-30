const db = require('../models');

const findUserByEmailOrPhone = async (email, phoneNumber) => {
  return await db.Users.findOne({
    where: {
      [db.Sequelize.Op.or]: [{ email }, { phoneNumber }]
    }
  });
};

const createUser = async (userData) => {
  try {
    return await db.Users.create(userData);
  } catch (error) {
    console.error('Error creating user:', error.message || error);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`Validation error: ${err.message}, Field: ${err.path}`);
      });
    }
    throw error;
  }
};

const findUserByPhoneNumber = async (phoneNumber) => {
  return await db.Users.findOne({
    where: { phoneNumber }
  });
};

const updateUserVerificationStatus = async (user) => {
  user.isVerified = true;
  return await user.save();
};

module.exports = {
  findUserByEmailOrPhone,
  createUser,
  findUserByPhoneNumber,
  updateUserVerificationStatus
};