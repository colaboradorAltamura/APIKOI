const Joi = require('joi');

const basicData = {
  firstName: Joi.string().min(1).max(1000),
  lastName: Joi.string().min(1).max(1000),
  nickname: Joi.string().allow(''),
  // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'io'] } }),

  phoneNumber: Joi.string().allow('').allow(null),

  countryCode: Joi.string().allow(null).allow(''),
  identificationType: Joi.string().allow('').allow(null),
  identificationNumber: Joi.string().allow('').allow(null),

  avatarUrl: Joi.string().allow(null).allow(''),

  notes: Joi.string().allow(''),
  attachments: Joi.any(),
};

const createSchema = Joi.object({
  ...basicData,

  email: Joi.string().email({ minDomainSegments: 2 }),
  appUserStatus: Joi.string(),
});

// SOLO ADMINS
const updateSchema = Joi.object({
  ...basicData,
  appRols: Joi.array().items(Joi.string()),
  appUserStatus: Joi.string(),
  // email: Joi.string().email({ minDomainSegments: 2 }), // no puede editar el email
});

const updateCurrentSchema = Joi.object({
  ...basicData,
  // appRols: Joi.array().items(Joi.string()),
  // email: Joi.string().email({ minDomainSegments: 2 }), // no puede editar el email
  // appUserStatus: Joi.string(),
});

const updateByStaff = Joi.object({
  ...basicData, // PENDIENTE DEFINICION, lo mismo que puede actualizar un admin puede actualizar un staff
});

const createByUser = Joi.object({
  ...basicData,
  // appRols: Joi.array().items(Joi.string()),
  email: Joi.string().email({ minDomainSegments: 2 }),
  // appUserStatus: Joi.string(),
});

// const createByAppAdmin = Joi.object({
//   ...basicData,
//   appRols: Joi.array().items(Joi.string()),
//   email: Joi.string().email({ minDomainSegments: 2 }),
//   appUserStatus: Joi.string(),
// });

const updateByAppAdmin = Joi.object({
  ...basicData,
  appRols: Joi.array().items(Joi.string()),

  appUserStatus: Joi.string(),
});

// cualquier dato que se agregue acá tiene que agregarse tmb en las creaciones de:
// staff, companyClient, checkout
const requiredBaseFields = ['firstName', 'lastName', 'appUserStatus', 'email'];

const requiredBaseFieldsByUser = ['firstName', 'lastName', 'email'];

const schemas = {
  create: createSchema.fork(requiredBaseFields, (field) => field.required()),
  createByAppAdmin: createSchema.fork(requiredBaseFields, (field) => field.required()),
  updateByAppAdmin,
  update: updateSchema,
  updateByStaff,
  updateCurrentSchema,

  createByUser: createByUser.fork(requiredBaseFieldsByUser, (field) => field.required()),
};

module.exports = schemas;
