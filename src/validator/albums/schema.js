const Joi = require('joi');

const Album = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { Album };
