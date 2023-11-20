import { DynamicComponentTypes } from '../types/dynamics';
import { EntitySchemaTypes, IEntitySchema, ISchemaWithFields } from '../types/schemas';

const COMPANY_EMPLOYEE_ROLE = 'sys-comp-employee';
const COLLECTIONS_USERS = 'users';
const COLLECTIONS_COMPANIES = 'companies';
const COLLECTIONS_COMPANY_EMPLOYEES = 'companyEmployees';

const USERS_SCHEMA: IEntitySchema = {
  id: '',
  organizationId: '',
  collectionName: '',

  name: COLLECTIONS_USERS,
  rootSchema: true,
  description: 'users main schema',

  grantedUserDefinedRols_create: [],
  grantedUserDefinedRols_read: [],
  grantedUserDefinedRols_update: [],
  grantedUserDefinedRols_delete: [],

  grantedUserDefinedRols_create_mine: [],
  grantedUserDefinedRols_read_mine: [],
  grantedUserDefinedRols_update_mine: [],
  grantedUserDefinedRols_delete_mine: [],

  grantedUserDefinedRols_create_by_user: [],
  grantedUserDefinedRols_read_by_user: [],
  grantedUserDefinedRols_update_by_user: [],
  grantedUserDefinedRols_delete_by_user: [],

  grantedUserDefinedRols_create_by_company: [],
  grantedUserDefinedRols_read_by_company: [],
  grantedUserDefinedRols_update_by_company: [],
  grantedUserDefinedRols_delete_by_company: [],

  schemaType: EntitySchemaTypes.USER_ENTITY,

  indexedFilters: [],
  indexedCompoundFilters: [],

  fieldNameUsedAsSchemaLabel: 'firstName',
};

const COMPANY_SCHEMA: IEntitySchema = {
  id: '',
  organizationId: '',
  collectionName: '',

  name: COLLECTIONS_COMPANIES,
  rootSchema: true,
  description: 'companies main schema',

  grantedUserDefinedRols_create: [],
  grantedUserDefinedRols_read: [],
  grantedUserDefinedRols_update: [],
  grantedUserDefinedRols_delete: [],

  grantedUserDefinedRols_create_mine: [],
  grantedUserDefinedRols_read_mine: [],
  grantedUserDefinedRols_update_mine: [],
  grantedUserDefinedRols_delete_mine: [],

  grantedUserDefinedRols_create_by_user: [],
  grantedUserDefinedRols_read_by_user: [],
  grantedUserDefinedRols_update_by_user: [],
  grantedUserDefinedRols_delete_by_user: [],

  grantedUserDefinedRols_create_by_company: [],
  grantedUserDefinedRols_read_by_company: [],
  grantedUserDefinedRols_update_by_company: [],
  grantedUserDefinedRols_delete_by_company: [],

  schemaType: EntitySchemaTypes.COMPANY_ENTITY,

  indexedFilters: [],
  indexedCompoundFilters: [],

  fieldNameUsedAsSchemaLabel: 'name',
};

const COMPANY_EMPLOYEES_SCHEMA: IEntitySchema = {
  id: '',
  organizationId: '',
  collectionName: '',

  name: COLLECTIONS_COMPANY_EMPLOYEES,
  rootSchema: false,
  description: 'company employees schema',

  grantedUserDefinedRols_create: [],
  grantedUserDefinedRols_read: [],
  grantedUserDefinedRols_update: [],
  grantedUserDefinedRols_delete: [],

  grantedUserDefinedRols_create_mine: [],
  grantedUserDefinedRols_read_mine: [],
  grantedUserDefinedRols_update_mine: [],
  grantedUserDefinedRols_delete_mine: [],

  grantedUserDefinedRols_create_by_user: [],
  grantedUserDefinedRols_read_by_user: [],
  grantedUserDefinedRols_update_by_user: [],
  grantedUserDefinedRols_delete_by_user: [],

  grantedUserDefinedRols_create_by_company: [],
  grantedUserDefinedRols_read_by_company: [],
  grantedUserDefinedRols_update_by_company: [],
  grantedUserDefinedRols_delete_by_company: [],

  schemaType: EntitySchemaTypes.COMPANY_EMPLOYEES_ENTITY,
  // schemaType: EntitySchemaTypes.RELATIONSHIP_ENTITY,

  fixedRoleId: COMPANY_EMPLOYEE_ROLE,
  indexedFilters: [],
  indexedCompoundFilters: [],

  fieldNameUsedAsSchemaLabel: '',
};

const buildUserSchemaWithFields = (organizationId: string) => {
  const fields = [];

  fields.push({
    id: 'firstName',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'firstName',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '1',

    label: 'First name',
    placeholder: 'eg: jon',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: true,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'lastName',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'lastName',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '2',

    label: 'Last name',
    placeholder: 'eg: Doe',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: true,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'email',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'email',
    fieldType: DynamicComponentTypes.FORM_EMAIL,
    order: '3',

    label: 'Email',
    placeholder: 'eg: xxx@mail.com',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: true,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'phoneNumber',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'phoneNumber',
    fieldType: DynamicComponentTypes.FORM_PHONE_NUMBER,
    order: '4',

    label: 'Phone number',
    placeholder: 'eg: +54 1234',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'avatarUrl',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'avatarUrl',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '5',

    label: 'Avatar Url',
    placeholder: 'https://...',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'identificationType',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'identificationType',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '6',

    label: 'Identification Type',
    placeholder: 'eg: Passport',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'identificationNumber',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'identificationNumber',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '7',

    label: 'Identification Number',
    placeholder: 'eg: 123AXD',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'dirtyAddress',
    schemaId: COLLECTIONS_USERS,
    organizationId,

    name: 'dirtyAddress',
    fieldType: DynamicComponentTypes.ADDRESS,
    order: '8',

    label: 'Dirty Address',
    placeholder: '',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false,

    enableHidden: true,
    hidden_create: true,
    hidden_edit: true,

    enableReadOnly: true,
    readOnly_create: true,
    readOnly_edit: true,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  const theSchema: ISchemaWithFields = {
    ...USERS_SCHEMA,
    id: COLLECTIONS_USERS,
    organizationId,
    collectionName: COLLECTIONS_USERS,

    fields,
  };

  return theSchema;
};

const buildCompanySchemaWithFields = (organizationId: string) => {
  const fields = [];

  const schemaId = organizationId + '_' + COLLECTIONS_COMPANIES;

  fields.push({
    id: 'company-name',
    schemaId,
    organizationId,

    name: 'name',
    fieldType: DynamicComponentTypes.FORM_TEXT,
    order: '1',

    label: 'name',
    placeholder: 'eg: Best Company Ever',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: true,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  fields.push({
    id: 'company-email',
    schemaId,
    organizationId,

    name: 'email',
    fieldType: DynamicComponentTypes.FORM_EMAIL,
    order: '3',

    label: 'Email',
    placeholder: 'eg: xxx@mail.com',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: true,

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: false,
    readOnly_create: false,
    readOnly_edit: false,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,
  });

  const theSchema: ISchemaWithFields = {
    ...COMPANY_SCHEMA,
    id: schemaId,
    organizationId,
    collectionName: organizationId + '_' + COLLECTIONS_COMPANIES,

    fields,
  };

  return theSchema;
};

const buildCompanyEmployeesSchemaWithFields = (organizationId: string) => {
  const fields = [];

  const companiesSchema = buildCompanySchemaWithFields(organizationId);
  const usersSchema = buildUserSchemaWithFields(organizationId);

  const schemaId = organizationId + '_' + COLLECTIONS_COMPANY_EMPLOYEES;

  const relationshipSourceSchemaId = companiesSchema.id;
  const relationshipTargetSchemaId = usersSchema.id;

  fields.push({
    id: 'company-employee-companyId',
    schemaId,
    organizationId,

    name: 'companyId',
    fieldType: DynamicComponentTypes.RELATIONSHIP,
    order: '1',

    label: 'companyId',
    placeholder: '',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false, // para poder crear

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: true,
    readOnly_create: true,
    readOnly_edit: true,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,

    relationshipSchemaId: relationshipSourceSchemaId,
    relationshipSchemaLabelPropName: companiesSchema.fieldNameUsedAsSchemaLabel,
    relationshipRequiresSimpleParam: false,
    relationshipRequiresUserParam: false,
    relationshipRequiresCompanyParam: true,
    relationshipParamPropName: 'companyId',
  });

  fields.push({
    id: 'company-employee-userId',
    schemaId,
    organizationId,

    name: 'userId',
    fieldType: DynamicComponentTypes.RELATIONSHIP,
    order: '3',

    label: 'userId',
    placeholder: '',
    dimensions_xs: '12',
    dimensions_sm: '12',
    tooltip: '',
    isRequired: false, // para poder crear

    enableHidden: false,
    hidden_create: false,
    hidden_edit: false,

    enableReadOnly: true,
    readOnly_create: true,
    readOnly_edit: true,

    enableConditionalRender: false,
    fieldGroupId: '',

    isSystemField: true,

    relationshipSchemaId: relationshipTargetSchemaId,
    relationshipSchemaLabelPropName: usersSchema.fieldNameUsedAsSchemaLabel,
    relationshipRequiresSimpleParam: false,
    relationshipRequiresUserParam: true,
    relationshipRequiresCompanyParam: false,
    relationshipParamPropName: 'userId',
  });

  const theSchema: ISchemaWithFields = {
    ...COMPANY_EMPLOYEES_SCHEMA,
    id: schemaId,
    organizationId,
    collectionName: organizationId + '_' + COLLECTIONS_COMPANY_EMPLOYEES,

    relationshipSourceSchemaId,
    relationshipTargetSchemaId,

    fields,
  };

  return theSchema;
};

export {
  COMPANY_EMPLOYEE_ROLE,
  USERS_SCHEMA,
  COMPANY_SCHEMA,
  COMPANY_EMPLOYEES_SCHEMA,
  buildUserSchemaWithFields,
  buildCompanySchemaWithFields,
  buildCompanyEmployeesSchemaWithFields,
};
