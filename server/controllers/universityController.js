const { University } = require('../models');
const { Op } = require('sequelize');

exports.getUniversities = async (req, res) => {
  try {
    const { filter = '', skip = 0, take = 40 } = req.query;
    const universities = await University.findAll({
      where: {
        name: {
          [Op.iLike]: `%${filter}%`, // Case-insensitive search
        },
      },
      offset: parseInt(skip),
      limit: parseInt(take),
    });
    res.json(universities);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getUniversityNames = async (req, res) => {
  try {
    const { values } = req.query;
    const ids = values.split(',').map(id => parseInt(id, 10));
    const universities = await University.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    res.json(universities.map(university => university.name));
  } catch (error) {
    res.status(500).send(error.message);
  }
};