/* eslint-disable no-unused-vars */
// import { Types } from '../../vs-core';
import { Collections } from '../../types/collectionsTypes';
import {
  createFirestoreDocument,
  fetchItems,
  fetchSingleItem,
} from '../../vs-core-firebase/helpers/firestoreHelper';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { StateTypes } from '../../vs-core/types';
import { EntitySchemaTypes, IEntitySchema } from '../../vs-core/types/schemas';
import {
  buildCompanyEmployeesSchemaWithFields,
  buildCompanySchemaWithFields,
} from '../../vs-core/helpers/schemas';
import { MIGRATION_TARGET_DATABASE_URL } from '../../config/appConfig';

const { Firestore } = require('firebase-admin/firestore');

const { ErrorHelper } = require('../../vs-core-firebase');

const { CustomError } = require('../../vs-core');

const schemas = require('./schemas');

// eslint-disable-next-line camelcase

const {
  updateSingleItem,

  sanitizeData,
} = require('../../vs-core-firebase/helpers/firestoreHelper');

const COLLECTION_NAME = Collections.ORGANIZATIONS;

exports.getMine = async function (req, res) {
  try {
    const { organizationId } = res.locals;

    console.log('GET ORGANIZATION MINE ' + organizationId);

    const organization = await fetchSingleItem({
      collectionName: COLLECTION_NAME,
      id: organizationId,
    });

    console.log('Returning: ' + JSON.stringify(organization));
    return res.status(200).send(organization);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.patch = async function (req, res) {
  const { userId: auditUid, organizationId } = res.locals;

  const body = req.body;

  const collectionName = COLLECTION_NAME;
  const validationSchema = schemas.update;

  try {
    const id = organizationId;

    if (!id) throw new CustomError.TechnicalError('ERROR_MISSING_ARGS', null, 'Invalid args', null);

    console.log('Patch args (' + collectionName + '):', JSON.stringify(body));

    const itemData = await sanitizeData({ data: body, validationSchema });

    const doc = await updateSingleItem({
      collectionName,
      id,
      auditUid,
      itemData,
    });

    console.log('Patch data: (' + collectionName + ')', JSON.stringify(itemData));

    return res.status(204).send(doc);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

const EXPORT_COLLECTION_PROP_NAME = '@collectionName';

const exportCollection = async ({
  databaseURL,
  srcCollectionName,
  destCollectionName,
}: {
  databaseURL: string;
  srcCollectionName: string;
  destCollectionName: string;
}) => {
  // const db = admin.firestore();
  // const ref = db.collection(collectionName);
  // const documents = await ref.get();

  const FIREBASE_PROD_APP_NAME = 'prod';

  const currentFirestoreApp = admin.app();
  let destinationFirestoreApp = admin.app();

  if (databaseURL) {
    destinationFirestoreApp = admin.apps.find((app) => {
      return app.name === FIREBASE_PROD_APP_NAME;
    });

    if (!destinationFirestoreApp) {
      const serviceAccount = '../../../deployments-service-account.json';
      destinationFirestoreApp = admin.initializeApp(
        {
          credential: admin.credential.cert(require(serviceAccount)),

          databaseURL,
        },
        FIREBASE_PROD_APP_NAME
      );
    }
  }

  console.log('initialize export collection from: ' + srcCollectionName);
  const sourceFirestore = admin.firestore(currentFirestoreApp);
  const destinationFirestore = admin.firestore(destinationFirestoreApp);

  const documents = await sourceFirestore.collection(srcCollectionName).get();
  let writeBatch = destinationFirestore.batch();
  const destCollection = destinationFirestore.collection(destCollectionName);
  let i = 0;
  for (const doc of documents.docs) {
    const data = {
      ...doc.data(),
      id: doc.id,
      [EXPORT_COLLECTION_PROP_NAME]: srcCollectionName,
      migrationStatus: 'pending',
    };

    console.log('Migrating (' + srcCollectionName + '): ' + data.id);
    // writeBatch.set(destCollection.doc(doc.id), data);
    writeBatch.set(destCollection.doc(), data); // id dinamico...
    i++;
    if (i > 400) {
      // write batch only allows maximum 500 writes per batch
      i = 0;
      console.log('Intermediate committing of batch operation');
      await writeBatch.commit();
      writeBatch = destinationFirestore.batch();
    }
  }
  if (i > 0) {
    console.log('Firebase batch operation completed. Doing final committing of batch operation.');
    await writeBatch.commit();
  } else {
    console.log('Firebase batch operation completed.');
  }
};

exports.exportConfig = async function (req, res) {
  try {
    // const { organizationId } = res.locals;

    const { targetSchemas } = req.body;
    // const organization = await fetchSingleItem({
    //   collectionName: COLLECTION_NAME,
    //   id: organizationId,
    // });
    // const prodDatabaseUrl = organization.prodDatabaseUrl =

    const prodDatabaseUrl = MIGRATION_TARGET_DATABASE_URL;

    let allSchemas = (await fetchItems({
      filterState: StateTypes.STATE_ACTIVE,
      collectionName: Collections.SCHEMAS,
      limit: 1000,
      // filters: { email: { $equal: email } },
      filters: null,
      indexedFilters: null, // ['email'],
    })) as IEntitySchema[];

    if (targetSchemas && targetSchemas.length) {
      console.log('filtrando por schemas: ', JSON.stringify(targetSchemas));

      allSchemas = allSchemas.filter((schema) => {
        return targetSchemas.includes(schema.name);
      });
    }

    const optionSchema = allSchemas.filter((schema) => {
      return schema.schemaType === EntitySchemaTypes.SELECT_OPTIONS_ENTITY;
    });

    optionSchema.forEach((schema) => {
      exportCollection({
        databaseURL: prodDatabaseUrl,
        srcCollectionName: schema.collectionName,
        destCollectionName: Collections.CMS_MIGRATIONS,
      });
    });
    exportCollection({
      databaseURL: prodDatabaseUrl,
      srcCollectionName: Collections.SCHEMAS,
      destCollectionName: Collections.CMS_MIGRATIONS,
    });
    exportCollection({
      databaseURL: prodDatabaseUrl,
      srcCollectionName: Collections.SCHEMA_FIELDS,
      destCollectionName: Collections.CMS_MIGRATIONS,
    });
    exportCollection({
      databaseURL: prodDatabaseUrl,
      srcCollectionName: Collections.SCHEMA_FIELD_GROUPS,
      destCollectionName: Collections.CMS_MIGRATIONS,
    });
    exportCollection({
      databaseURL: prodDatabaseUrl,
      srcCollectionName: Collections.ORGANIZATION_USER_DEFINED_ROLS,
      destCollectionName: Collections.CMS_MIGRATIONS,
    });

    return res.status(200).send({});
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

const initializeCompanySchema = async (organizationId, auditUid) => {
  const companySchemaWithFields = buildCompanySchemaWithFields(organizationId);

  const companiesSchema = await fetchSingleItem({
    collectionName: Collections.SCHEMAS,
    id: companySchemaWithFields.id,
  });

  console.log('Existent company schema: ' + JSON.stringify(companiesSchema));

  if (companiesSchema) return;

  const compSchemaItemData = { ...companySchemaWithFields };
  delete compSchemaItemData.fields;

  await createFirestoreDocument({
    collectionName: Collections.SCHEMAS,
    itemData: compSchemaItemData,
    auditUid,
    id: companySchemaWithFields.id,
    state: StateTypes.STATE_ACTIVE,
  });

  console.log('Company schema created ok');

  const createFieldsPromises = [];

  companySchemaWithFields.fields.forEach((field) => {
    createFieldsPromises.push(
      createFirestoreDocument({
        collectionName: Collections.SCHEMA_FIELDS,
        itemData: field,
        auditUid,
        id: field.id,
        state: StateTypes.STATE_ACTIVE,
      })
    );
  });

  await Promise.all(createFieldsPromises);

  console.log('Company schema fields created ok');
};

const initializeCompanyEmployeesSchema = async (organizationId, auditUid) => {
  const companyEmployeesSchemaWithFields = buildCompanyEmployeesSchemaWithFields(organizationId);

  const companyEmployeesSchema = await fetchSingleItem({
    collectionName: Collections.SCHEMAS,
    id: companyEmployeesSchemaWithFields.id,
  });

  console.log('Existent company employees schema: ' + JSON.stringify(companyEmployeesSchema));

  if (companyEmployeesSchema) return;

  const compSchemaItemData = { ...companyEmployeesSchemaWithFields };
  delete compSchemaItemData.fields;

  await createFirestoreDocument({
    collectionName: Collections.SCHEMAS,
    itemData: compSchemaItemData,
    auditUid,
    id: companyEmployeesSchemaWithFields.id,
    state: StateTypes.STATE_ACTIVE,
  });

  console.log('Company employees schema created ok');

  const createFieldsPromises = [];

  companyEmployeesSchemaWithFields.fields.forEach((field) => {
    createFieldsPromises.push(
      createFirestoreDocument({
        collectionName: Collections.SCHEMA_FIELDS,
        itemData: field,
        auditUid,
        id: field.id,
        state: StateTypes.STATE_ACTIVE,
      })
    );
  });

  await Promise.all(createFieldsPromises);

  console.log('Company employees schema fields created ok');
};

exports.initializeOrganization = async function (req, res) {
  try {
    const { organizationId, userId: auditUid } = res.locals;

    await initializeCompanySchema(organizationId, auditUid);
    await initializeCompanyEmployeesSchema(organizationId, auditUid);

    return res.status(200).send({});
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.onCmsMigrationCreate = functions.firestore
  .document(Collections.CMS_MIGRATIONS + '/{docId}')
  .onCreate(async (snapshot, context) => {
    const { docId } = context.params;
    // const docId = snapshot.key;
    const documentPath = `${Collections.CMS_MIGRATIONS}/${docId}`;
    try {
      // const before = null;
      const after = snapshot.data();

      console.log('CREATED ' + documentPath);

      const targetCollectionName = after[EXPORT_COLLECTION_PROP_NAME];

      if (!targetCollectionName || !after.id) {
        throw new Error('Missing ' + EXPORT_COLLECTION_PROP_NAME + ' or id prop');
      }

      const existentData = await fetchSingleItem({
        collectionName: targetCollectionName,
        id: after.id,
      });

      const db = admin.firestore();
      // update
      if (existentData) {
        delete after[EXPORT_COLLECTION_PROP_NAME];
        delete after.createdBy;
        delete after.createdAt;
        delete after.updatedAt;
        delete after.updatedBy;

        const data = {
          ...after,
          migrationTimestamp: Firestore.FieldValue.serverTimestamp(),
        };

        console.log('Updating data (' + documentPath + '): ' + JSON.stringify(data));

        await db.collection(targetCollectionName).doc(after.id).update(data);
      }
      // create
      else {
        delete after[EXPORT_COLLECTION_PROP_NAME];

        const data = {
          ...after,
          migrationTimestamp: Firestore.FieldValue.serverTimestamp(),
        };

        console.log('Creating data (' + documentPath + '): ' + JSON.stringify(data));

        await db.collection(targetCollectionName).doc(after.id).set(data);
      }

      console.log('Migration OK, removing data');

      await db.collection(Collections.CMS_MIGRATIONS).doc(docId).delete();

      // if (targetCollectionName === Collections.SCHEMAS) {
      // }
    } catch (err) {
      console.error('error onCreate document', documentPath, err);

      const updateData = {
        lastError: err,
      };

      const db = admin.firestore();
      await db.collection(Collections.CMS_MIGRATIONS).doc(docId).update(updateData);

      return null;
    }
  });
