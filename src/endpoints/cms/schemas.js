const Joi = require('joi');

const forbiddenUpdateSchema = { organizationId: Joi.string() };

// ** SCHEMA (src/endpoints/cms/schemas.js > IEntitySchema)
const baseSchema = {
  name: Joi.string().min(2).max(100),
  collectionName: Joi.string(),
  rootSchema: Joi.boolean(),
  description: Joi.string().allow(''),

  indexedFilters: Joi.array().items(Joi.string()),
  indexedCompoundFilters: Joi.array().items(Joi.object()),

  grantedUserDefinedRols_create: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_read: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_update: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_delete: Joi.array().items(Joi.string()),

  grantedUserDefinedRols_create_mine: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_read_mine: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_update_mine: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_delete_mine: Joi.array().items(Joi.string()),

  grantedUserDefinedRols_create_by_user: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_read_by_user: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_update_by_user: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_delete_by_user: Joi.array().items(Joi.string()),

  grantedUserDefinedRols_create_by_company: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_read_by_company: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_update_by_company: Joi.array().items(Joi.string()),
  grantedUserDefinedRols_delete_by_company: Joi.array().items(Joi.string()),

  grantedAnonymous_create: Joi.boolean(),
  grantedAnonymous_read: Joi.boolean(),
  grantedAnonymous_update: Joi.boolean(),
  grantedAnonymous_delete: Joi.boolean(),

  schemaType: Joi.string().allow(''),

  fieldNameUsedAsSchemaLabel: Joi.string().allow(''),

  bidirectional: Joi.boolean(),
  relationshipSourceSchemaId: Joi.string().allow('').allow(null),
  relationshipTargetSchemaId: Joi.string().allow('').allow(null),

  relationshipSourceRequiredRols: Joi.array().items(Joi.string()),
  relationshipTargetRequiredRols: Joi.array().items(Joi.string()),

  fixedRoleId: Joi.string().allow('').allow(null),

  prelodeable: Joi.boolean(),
  cacheable: Joi.boolean(),

  isStateRelated: Joi.boolean(),
};

const createBaseSchema = Joi.object({
  ...forbiddenUpdateSchema,
  ...baseSchema,
});

const updateBaseSchema = Joi.object({
  ...baseSchema,
});

// ** FIELD GROUPS
const forbiddenUpdateEntityFieldGroupsSchema = {
  schemaId: Joi.string(),
  organizationId: Joi.string(),
};

const fieldGroupsBaseSchema = {
  title: Joi.string(),
  subTitle: Joi.string().allow('').allow(null),
  icon: Joi.string().allow('').allow(null),
  order: Joi.number().allow(0),
};

const createFieldGroupsBaseSchema = Joi.object({
  ...forbiddenUpdateEntityFieldGroupsSchema,
  ...fieldGroupsBaseSchema,
});

const updateFieldGroupsBaseSchema = Joi.object({
  ...fieldGroupsBaseSchema,
});

// ** FIELDS
const forbiddenUpdateEntityFieldsSchema = { schemaId: Joi.string(), organizationId: Joi.string() };

const fieldsBaseSchema = {
  name: Joi.string(),
  fieldType: Joi.string(),
  order: Joi.number().allow(0),

  label: Joi.string().allow(''),
  placeholder: Joi.string().allow(''),
  dimensions_xs: Joi.number().allow(''),
  dimensions_sm: Joi.number().allow(''),
  tooltip: Joi.string().allow(''),
  isRequired: Joi.boolean().allow(null).default(false),

  enableHidden: Joi.boolean(),
  hidden_create: Joi.boolean(),
  hidden_edit: Joi.boolean(),

  enableReadOnly: Joi.boolean(),
  readOnly_create: Joi.boolean(),
  readOnly_edit: Joi.boolean(),

  enableConditionalRender: Joi.boolean(),
  conditionalRenderWhen: Joi.string().allow(''),
  // TODO temporal hasta que el front entienda como manejar creatables
  // conditionalRenderIs: Joi.array().items(Joi.string()),
  conditionalRenderIs: Joi.string().allow(''),

  isCountryOptionFilter: Joi.boolean(),
  isRelatedStateOption: Joi.boolean(),

  fieldGroupId: Joi.string().allow(''),

  relationshipSchemaId: Joi.string().allow(''),
  relationshipSchemaLabelPropName: Joi.string().allow(''),
  relationshipRequiresSimpleParam: Joi.boolean(),
  relationshipRequiresUserParam: Joi.boolean(),
  relationshipRequiresCompanyParam: Joi.boolean(),
  relationshipParamPropName: Joi.string().allow(''),

  isPublicDefaultValue: Joi.boolean(),
  allowIsPublicSwitch: Joi.boolean(),

  isSystemField: Joi.boolean(),

  uiRules: Joi.array().items(Joi.any()),
  workflowRules: Joi.array().items(Joi.any()),

  enableCustomMask: Joi.boolean(),
  textCustomMask: Joi.string().allow(''),
  componentProps: Joi.string().allow(''),

  enableTextArea: Joi.boolean(),
  enableHtmlEditor: Joi.boolean(),
  textAreaRows: Joi.number().allow('', null).default(4),
};

const createFieldsBaseSchema = Joi.object({
  ...forbiddenUpdateEntityFieldsSchema,
  ...fieldsBaseSchema,
});

const updateFieldsBaseSchema = Joi.object({
  ...fieldsBaseSchema,
});

// ** USER DEFINED ROLS
const forbiddenUpdateOrgUserDefinedRols = {
  name: Joi.string(), // el name y el id son lo mismo, no lo dejo editarlo
  organizationId: Joi.string(),
  isSchemaRelated: Joi.boolean(),
  relatedSchemaId: Joi.string().allow(''),
};

const orgUserDefinedRolsBaseSchema = {
  description: Joi.string().allow(''),
};

const createOrgUserDefinedRols = Joi.object({
  ...forbiddenUpdateOrgUserDefinedRols,
  ...orgUserDefinedRolsBaseSchema,
});

const updateOrgUserDefinedRols = Joi.object({
  ...orgUserDefinedRolsBaseSchema,
});

// ** USER ROLS
const forbiddenUpdateUserRols = {
  organizationId: Joi.string(),
  userId: Joi.string(),
  roleId: Joi.string().allow('', null), // TODO hacer dos schemas, uno para create y otro para bulk
  bulkRolsIds: Joi.array().items(Joi.string()),
};

const orgUserBaseSchema = {};

const createUserRols = Joi.object({
  ...forbiddenUpdateUserRols,
  ...orgUserBaseSchema,
});

const updateUserRols = Joi.object({
  ...orgUserBaseSchema,
});

const requiredBaseFields = ['organizationId', 'name', 'collectionName'];

const requiredFieldGroupsBaseFields = ['organizationId', 'schemaId', 'title', 'order'];

const requiredFieldsBaseFields = ['organizationId', 'schemaId', 'fieldType', 'name', 'order'];

const requiredOrgUserDefinedRols = ['organizationId', 'name'];

const requiredUserRols = ['organizationId', 'userId'];

const schemas = {
  // ** SCHEMAS
  create: createBaseSchema.fork(requiredBaseFields, (field) => field.required()),
  update: updateBaseSchema,

  // ** FIELDS
  createField: createFieldsBaseSchema.fork(requiredFieldsBaseFields, (field) => field.required()),
  // updateField: fieldsBaseSchema.fork(forbiddenUpdateFieldsBaseFields, (field) => field.forbidden()).keys(fieldsBaseSchema.keys.filter()),
  updateField: updateFieldsBaseSchema,

  // ** FIELD GROUPS
  createFieldGroup: createFieldGroupsBaseSchema.fork(requiredFieldGroupsBaseFields, (field) =>
    field.required()
  ),
  updateFieldGroup: updateFieldGroupsBaseSchema,

  // ** USER DEFINED ROLS
  createOrganizationUserDefinedRols: createOrgUserDefinedRols.fork(
    requiredOrgUserDefinedRols,
    (field) => field.required()
  ),
  updateOrganizationUserDefinedRols: updateOrgUserDefinedRols,

  // ** USER ROLS
  createUserRols: createUserRols.fork(requiredUserRols, (field) => field.required()),
  updateUserRols,
};

module.exports = schemas;
