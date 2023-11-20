const Joi = require('joi');

const basicData = {
  name: Joi.string(),
  description: Joi.string(),
  isProduction: Joi.date().required(),
};

const createSchema = Joi.object({
  ...basicData,
});

const updateSchema = Joi.object({
  ...basicData,
});

const requiredBaseFields = ['name'];

export const schemas = {
  create: createSchema.fork(requiredBaseFields, (field) => field.required()),
  update: updateSchema,
};
