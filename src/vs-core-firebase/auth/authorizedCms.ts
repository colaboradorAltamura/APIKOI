/* eslint-disable no-console */

import { Types } from '../../vs-core';
import { AppRols } from '../../vs-core/types';
import { IEntitySchema } from '../../vs-core/types/schemas';

import { userIsGranted } from './authorized';
// grants[ {companyId, rols: [ENTERPRISE_SALES, ENTERPRISE_ADMIN]}]
// appRols: decodedToken.appRols, // [APP_ADMIN]
const admin = require('firebase-admin');

const COLLECTION_SCHEMAS = 'schemas';
// const COLLECTION_SCHEMAS = 'schemas';

const fetchSchema: (
  organizationId: string,
  schemaName?: string,
  schemaId?: string
) => Promise<IEntitySchema> = async (organizationId, schemaName, schemaId) => {
  try {
    if (!organizationId) throw new Error('Missing organization id (AUTH)');
    if (!schemaName && !schemaId) throw new Error('Missing schema name or id (AUTH)');

    const db = admin.firestore();
    let querySnapshotSchema = null;

    if (schemaName) {
      querySnapshotSchema = await db
        .collection(COLLECTION_SCHEMAS)
        .where('organizationId', '==', organizationId)
        .where('name', '==', schemaName)
        .get();
    } else {
      querySnapshotSchema = await db
        .collection(COLLECTION_SCHEMAS)
        .where('organizationId', '==', organizationId)
        .where('id', '==', schemaId)
        .get();
    }

    if (querySnapshotSchema.empty || querySnapshotSchema.docs.length !== 1) {
      throw new Error('Invalid schemaName (' + schemaName + ') for org: ' + organizationId);
    }

    const theSchema = { ...querySnapshotSchema.docs[0].data(), id: querySnapshotSchema.docs[0].id };

    // no lo hago porque lo hacen dps los que lo reutilizan
    // if (theSchema.createdAt) theSchema.createdAt = theSchema.createdAt.toDate();
    // if (theSchema.updatedAt) theSchema.updatedAt = theSchema.updatedAt.toDate();

    return theSchema as IEntitySchema;
  } catch (err) {
    console.error(
      'Error fetch schema with args: ' + JSON.stringify({ organizationId, schemaName })
    );
    throw err;
  }
};

const isCmsGranted = async (
  res,
  allowSchemaRol,
  schemaName,
  userOrganizationId,
  userDefinedRols
) => {
  console.log(
    'isCmsGranted Args: ' +
      JSON.stringify({ allowSchemaRol, schemaName, userOrganizationId, userDefinedRols })
  );

  if (allowSchemaRol && schemaName && userOrganizationId && userDefinedRols) {
    const schema = await fetchSchema(userOrganizationId, schemaName);

    console.log('schema founded (' + schemaName + ')');

    // lo dejo en contexto
    res.locals.schema = schema;

    let grantPropName = 'grantedUserDefinedRols_';

    if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE) {
      grantPropName += 'create';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ) {
      grantPropName += 'read';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE) {
      grantPropName += 'update';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE) {
      grantPropName += 'delete';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_MINE) {
      grantPropName += 'create_mine';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_MINE) {
      grantPropName += 'read_mine';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_MINE) {
      grantPropName += 'update_mine';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_MINE) {
      grantPropName += 'delete_mine';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_BY_USER) {
      grantPropName += 'create_by_user';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_USER) {
      grantPropName += 'read_by_user';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_USER) {
      grantPropName += 'update_by_user';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_BY_USER) {
      grantPropName += 'delete_by_user';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE_BY_COMPANY) {
      grantPropName += 'create_by_company';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ_BY_COMPANY) {
      grantPropName += 'read_by_company';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE_BY_COMPANY) {
      grantPropName += 'update_by_company';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE_BY_COMPANY) {
      grantPropName += 'delete_by_company';
    }

    if (
      schema[grantPropName] &&
      userDefinedRols.find((element) => {
        return schema[grantPropName].includes(element);
      })
    ) {
      console.log('Encontrada la prop (' + grantPropName + ') en ' + JSON.stringify(schema));
      return true;
    }
  }

  return false;
};

export const isAuthorizedCms = function ({
  allowSameUser,
  hasAppRole,
  hasOrgRole,

  hasEnterpriseRole,
  isEnterpriseEmployee,

  allowSchemaRol,
}) {
  return async (req, res, next) => {
    const SYS_ADMIN_EMAIL = process.env.SYS_ADMIN_EMAIL;

    const {
      enterpriseRols,
      appRols,
      orgRols,
      userDefinedRols,
      email,
      userId,
      organizationId: userOrganizationId,
    } = res.locals;
    const { companyId, userId: paramUserId, schemaName } = req.params;

    if (email === SYS_ADMIN_EMAIL) return next();

    if (appRols.includes(AppRols.APP_ADMIN)) {
      return next();
    }

    const isGranted = await isCmsGranted(
      res,
      allowSchemaRol,
      schemaName,
      userOrganizationId,
      userDefinedRols
    );

    if (!isGranted) {
      return res.status(403).send({ message: 'cms role required (CMS Not granted)' });
    }

    if (allowSameUser && paramUserId && userId === paramUserId) {
      return next();
    }

    if (
      isEnterpriseEmployee &&
      companyId &&
      enterpriseRols &&
      enterpriseRols.find((erol) => {
        return erol.companyId === companyId;
      })
    ) {
      return next();
    }

    if (
      userIsGranted({
        userAppRols: appRols,
        userEnterpriseRols: enterpriseRols,
        userOrgRols: orgRols,

        targetAppRols: hasAppRole,
        targetOrgRols: hasOrgRole,

        targetEnterpriseRols: hasEnterpriseRole,
        companyId,
      })
    ) {
      return next();
    }

    // eslint-disable-next-line no-console
    console.error(
      'ERROR: cms role required',
      'role :',
      enterpriseRols,
      'appRols: ',
      appRols,
      'orgRols: ',
      orgRols,
      'hasAppRole: ',
      hasAppRole,
      'schemaName: ',
      schemaName,
      'allowSchemaRol: ',
      allowSchemaRol
    );

    return res.status(403).send({ message: 'cms role required' });
  };
};

export const isAuthorizedPublicCms = function ({ allowSchemaRol }) {
  return async (req, res, next) => {
    const { organizationId, schemaName } = req.params;

    const schema = await fetchSchema(organizationId, schemaName);

    let grantPropName = 'grantedAnonymous_';

    if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_CREATE) {
      grantPropName += 'create';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ) {
      grantPropName += 'read';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_UPDATE) {
      grantPropName += 'update';
    } else if (allowSchemaRol === Types.SchemaRolActionType.SCHEMA_ROL_ACTION_DELETE) {
      grantPropName += 'delete';
    }

    if (schema[grantPropName]) {
      res.locals = {
        organizationId,
        userId: 'anonymous',
        schema,

        enterpriseRols: [],
        appRols: [],
        orgRols: [],
        userDefinedRols: [],

        email: 'anonymous',
        status: '',
      };

      return next();
    }

    // eslint-disable-next-line no-console
    console.error(
      'ERROR: public cms forbidden',
      'role :',
      'schemaName: ' + JSON.stringify(organizationId, schemaName)
    );

    return res.status(403).send({ message: 'cms forbidden' });
  };
};
