// controllers/degreeController.js
const { Degree } = require('../models');
const { Op } = require('sequelize');

exports.getDegrees = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 40 } = req.query;
    const degrees = await Degree.findAll({
      where: {
        course: {
          [Op.iLike]: `%${filter}%`, // Case-insensitive search
        },
      },
      offset: parseInt(skip),
      limit: parseInt(take),
    });
    res.json(degrees);
  } catch (error) {
    res.status(500).send(error.message);
  }
};