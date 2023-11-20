const Joi = require('joi');

const basicData = {
  profileImage: Joi.any(),

  name: Joi.string().min(2).max(100),
  blurbDescription: Joi.string().allow(''),
  problemDescription: Joi.string().allow(''),
  solutionDescription: Joi.string().allow(''),
  highlights: Joi.string().allow(''),

  description: Joi.string().allow(''),

  contactEmail: Joi.string().email({ minDomainSegments: 2 }).allow(''),
  phoneNumber: Joi.string().allow(''),
  headquartersLocation: Joi.any(),

  notes: Joi.string().allow(''),
  attachments: Joi.any(),
};

const createSchema = Joi.object({
  ...basicData,
});

const updateSchema = Joi.object({
  ...basicData,
});

const requiredBaseFields = ['name'];

const schemas = {
  create: createSchema.fork(requiredBaseFields, (field) => field.required()),
  update: updateSchema,
};

module.exports = schemas;
