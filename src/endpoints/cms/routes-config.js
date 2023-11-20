const {
  findSchemas,
  getSchemaById,
  getSchemaByName,
  patchSchema,
  createSchema,
  removeSchema,

  findAllSchemasFields,
  findSchemaFields,
  createSchemaField,
  patchSchemaField,
  removeSchemaField,

  findSchemaFieldGroups,
  createSchemaFieldGroup,
  patchSchemaFieldGroup,
  removeSchemaFieldGroup,

  findOrganizationUserDefinedRols,
  createOrganizationUserDefinedRol,
  patchOrganizationUserDefinedRol,
  removeOrganizationUserDefinedRol,

  findUserRolsMine,
  findUserRolsByUser,
  patchUserRolsByUser,
  createUserRolsByUser,
  deleteUserRolsByUser,
  bulkUpsertUserRolsByUser,

  fetchCacheableEntitiesData,

  find,
  findMine,
  findByUser,
  findByCompany,
  findByProp,

  get,
  getMine,
  getByUser,
  getByCompany,

  create,
  createMine,
  createByUser,
  createByCompany,

  patch,
  patchMine,
  patchByUser,
  patchByCompany,

  remove,
  removeMine,
  removeByUser,
  removeByCompany,

  restore,
  restoreMine,
  restoreByUser,
  restoreByCompany,

  geoQueryUserAddresses,
} = require('./controller');

const { Audit } = require('../../vs-core-firebase');
const { Auth } = require('../../vs-core-firebase');
const { Types } = require('../../vs-core');

const cmsSchemasPrimitives = (app) => {
  // ** CMS Primitives (Schemas)

  app.get('/public/schemas/:organizationId', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ,
    }),
    findSchemas,
  ]);

  app.get('/schemas', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthenticated, // anonimamente deberia poder consultar todo
    findSchemas,
  ]);

  app.get('/public/schemas/:organizationId/:id', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ,
    }),
    getSchemaById,
  ]);

  // Cualquier persona deberia poder consultar un schema para asi poder entender como renderizar esa pagina
  app.get('/schemas/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    // Auth.isAuthorized({
    //   hasAppRole: [Types.AppRols.APP_ADMIN],
    // }),
    getSchemaById,
  ]);

  app.get('/schemas/by-name/:schemaName', [
    Audit.logger,
    Auth.isAuthenticated,

    // Auth.isAuthorized({
    //   hasAppRole: [Types.AppRols.APP_ADMIN],
    // }),
    getSchemaByName,
  ]);

  app.patch('/schemas/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    patchSchema,
  ]);

  app.post('/schemas', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    createSchema,
  ]);

  app.delete('/schemas/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    removeSchema,
  ]);
};

const cmsSchemaFieldsPrimitives = (app) => {
  // ** CMS Primitives (Fields)

  app.get('/schemas/all/fields', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthenticated, // anonimamente deberia poder consultar todo
    // Auth.isAuthorized({
    //   hasAppRole: [Types.AppRols.APP_ADMIN],
    //   hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    // }),
    findAllSchemasFields,
  ]);

  app.get('/schemas/:id/fields', [
    Audit.logger,
    Auth.isAuthenticated,
    // Auth.isAuthorized({
    //   hasAppRole: [Types.AppRols.APP_ADMIN],
    //   hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    // }),
    findSchemaFields,
  ]);

  app.post('/schemas/:id/fields', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    createSchemaField,
  ]);

  app.patch('/schemas/:id/fields/:fieldId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    patchSchemaField,
  ]);

  app.delete('/schemas/:id/fields/:fieldId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    removeSchemaField,
  ]);
};

const cmsSchemaFieldGroupsPrimitives = (app) => {
  // ** CMS Primitives (Fields)
  app.get('/schemas/:id/field-groups', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    }),
    findSchemaFieldGroups,
  ]);

  app.post('/schemas/:id/field-groups', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    createSchemaFieldGroup,
  ]);

  app.patch('/schemas/:id/field-groups/:fieldGroupId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    patchSchemaFieldGroup,
  ]);

  app.delete('/schemas/:id/field-groups/:fieldGroupId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    removeSchemaFieldGroup,
  ]);
};

const cmsOrganizationRols = (app) => {
  app.get('/rols', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    }),
    findOrganizationUserDefinedRols,
  ]);

  app.patch('/rols/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    patchOrganizationUserDefinedRol,
  ]);

  app.delete('/rols/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    removeOrganizationUserDefinedRol,
  ]);

  app.post('/rols', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    createOrganizationUserDefinedRol,
  ]);
};

const cmsUserRols = (app) => {
  app.get('/userRols/mine', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    }),
    findUserRolsMine,
  ]);

  app.get('/userRols/by-user/:userId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN, Types.OrgRols.ORG_AUDIT, Types.OrgRols.ORG_VIEWER],
    }),
    findUserRolsByUser,
  ]);

  app.post('/userRols/by-user/:userId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    createUserRolsByUser,
  ]);

  app.post('/userRols/by-user/:userId/upsert', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    bulkUpsertUserRolsByUser,
  ]);

  app.patch('/userRols/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    patchUserRolsByUser,
  ]);

  app.delete('/userRols/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      hasOrgRole: [Types.OrgRols.ORG_ADMIN],
    }),
    deleteUserRolsByUser,
  ]);
};

const cmsDynamicFindWithSchemaId = (app) => {
  // ** FIND
  // /cms/123?fields[]=type >> find
  // /cms/321/mine?fields[]=type >> findMine
  // /cms/444/by-staff/:userId?fields[]=type >> findByStaff
  // /cms/124/by-company/:companyId?fields[]=type >> findByCompany

  // /cms/111/by-company/:companyId?fields[]=type >> findByCompany
  app.get('/with-id/:schemaId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    find,
  ]);

  app.get('/with-id/:schemaId/mine', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    findMine,
  ]);

  app.get('/with-id/:schemaId/by-user/:userId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      allowStaffRelationship: true,
    }),
    findByUser,
  ]);

  app.get('/with-id/:schemaId/by-company/:companyId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      isEnterpriseEmployee: true,
    }),
    findByCompany,
  ]);

  app.get('/with-id/:schemaName/by-prop/:id/:propName/:propValue', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      isEnterpriseEmployee: true,
    }),
    findByProp,
  ]);

  app.get('/with-id/:schemaName/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    get,
  ]);

  app.get('/with-id/:schemaName/mine/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    getMine,
  ]);

  app.get('/with-id/:schemaName/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      allowStaffRelationship: true,
    }),
    getByUser,
  ]);

  app.get('/with-id/:schemaName/by-company/:companyId/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      isEnterpriseEmployee: true,
    }),
    getByCompany,
  ]);
};

const cmsDynamicFindWithSchemaName = (app) => {
  // ** FIND
  // /cms/pathologies?fields[]=type >> find
  // /cms/userPathologies/mine?fields[]=type >> findMine
  // /cms/userPathologies/by-staff/:userId?fields[]=type >> findByStaff
  // /cms/companyClients/by-company/:companyId?fields[]=type >> findByCompany

  // /cms/companyPatients/by-company/:companyId?fields[]=type >> findByCompany

  app.get('/public/:organizationId/:schemaName', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ,
    }),
    find,
  ]);

  app.get('/:schemaName', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({ allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ }),
    find,
  ]);

  app.get('/:schemaName/mine', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_MINE,
    }),
    findMine,
  ]);

  app.get('/:schemaName/by-user/:userId', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_USER,
      allowStaffRelationship: true,
    }),
    findByUser,
  ]);

  app.get('/:schemaName/by-company/:companyId', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),
    findByCompany,
  ]);

  app.get('/:schemaName/by-prop/:propName/:propValue', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ,
      isEnterpriseEmployee: true,
    }),
    findByProp,
  ]);

  // ** GET

  app.get('/public/:organizationId/:schemaName/:id', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ,
    }),
    get,
  ]);

  app.get('/:schemaName/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({ allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ }),
    get,
  ]);

  app.get('/:schemaName/mine/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_MINE,
    }),
    getMine,
  ]);

  app.get('/:schemaName/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_USER,
      allowStaffRelationship: true,
    }),
    getByUser,
  ]);

  app.get('/:schemaName/by-company/:companyId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),
    getByCompany,
  ]);
};

exports.cmsRoutesConfig = function (app) {
  cmsSchemasPrimitives(app);
  cmsSchemaFieldGroupsPrimitives(app);
  cmsSchemaFieldsPrimitives(app);

  cmsOrganizationRols(app);
  cmsUserRols(app);

  app.get('/geo-query-user-addresses/:lat/:lng/:radiusInM', [
    Audit.logger,
    Auth.isAuthenticated,
    geoQueryUserAddresses,
  ]);

  app.get('/cacheable-entities-data', [
    Audit.logger,
    Auth.isAuthenticated,
    fetchCacheableEntitiesData,
  ]);

  cmsDynamicFindWithSchemaId(app);
  cmsDynamicFindWithSchemaName(app);

  // ** <CREATE> **
  // /cms/pathologies >> create

  app.post('/public/:organizationId/:schemaName', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE,
    }),
    create,
  ]);

  app.post('/:schemaName', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorizedCms({ allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE }),
    create,
  ]);

  app.post('/:schemaName/mine', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_MINE,
    }),

    createMine,
  ]);

  app.post('/:schemaName/by-user/:userId', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_BY_USER,
      allowStaffRelationship: true,
    }),

    createByUser,
  ]);

  app.post('/:schemaName/by-company/:companyId', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),

    createByCompany,
  ]);
  // ** </CREATE> **

  // ** <PATCH> **

  app.patch('/public/:organizationId/:schemaName/:id', [
    Audit.logger,
    Auth.allowAnonymous,
    Auth.isAuthorizedPublicCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE,
    }),
    patch,
  ]);

  app.patch('/:schemaName/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE,
    }),
    patch,
  ]);

  app.patch('/:schemaName/mine/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_MINE,
    }),

    patchMine,
  ]);

  app.patch('/:schemaName/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_USER,
      allowStaffRelationship: true,
    }),

    patchByUser,
  ]);

  app.patch('/:schemaName/by-company/:companyId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),

    patchByCompany,
  ]);
  // ** </PATCH> **

  // ** <DELETE> **

  app.delete('/:schemaName/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE,
    }),

    remove,
  ]);

  app.delete('/:schemaName/mine/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_MINE,
    }),

    removeMine,
  ]);

  app.delete('/:schemaName/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_BY_USER,
      allowStaffRelationship: true,
    }),

    removeByUser,
  ]);

  app.delete('/:schemaName/by-company/:companyId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),

    removeByCompany,
  ]);
  // ** </DELETE> **

  // ** <RESTORE> **

  app.patch('/:schemaName/restore/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE,
    }),
    restore,
  ]);

  app.patch('/:schemaName/restore/mine/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_MINE,
    }),

    restoreMine,
  ]);

  app.patch('/:schemaName/restore/by-user/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_USER,
      allowStaffRelationship: true,
    }),

    restoreByUser,
  ]);

  app.patch('/:schemaName/restore/by-company/:companyId/:id', [
    Audit.logger,
    Auth.isAuthenticated,

    Auth.isAuthorizedCms({
      allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_COMPANY,
      isEnterpriseEmployee: true,
    }),

    restoreByCompany,
  ]);
  // ** </RESTORE> **
};
