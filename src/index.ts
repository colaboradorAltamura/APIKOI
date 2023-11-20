/* eslint-disable camelcase */
/* eslint-disable no-console */
// import { Config } from '@abdalamichel/vs-core';

import * as cors from 'cors';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as functions from 'firebase-functions';

import {
  ChangeType,
  FirestoreBigQueryEventHistoryTracker,
  FirestoreEventHistoryTracker,
} from '@firebaseextensions/firestore-bigquery-change-tracker';

import { FIREB_PROJECT_ID } from './config/appConfig';
import { Collections } from './types/collectionsTypes';
import {
  // BigQuery,
  getChangeType,
  getDocumentId,
} from './vs-core-firebase';
import { handleCronError } from './vs-core-firebase/helpers/errorHelper';
// import { applicationDefault } from 'firebase-admin/app';

// eslint-disable-next-line import/no-extraneous-dependencies
const serverTiming = require('server-timing');

const puppeteer = require('puppeteer');

const { scrapperRoutesConfig } = require('./endpoints/scrapper/routes-config');

const { usersRoutesConfig } = require('./endpoints/users/routes-config');
const { adminRoutesConfig } = require('./endpoints/admin/routes-config');

const { attachmentsRoutesConfig } = require('./endpoints/attachments/routes-config');

const { organizationsRoutesConfig } = require('./endpoints/organizations/routes-config');
const { whatsappRoutesConfig } = require('./endpoints/whatsapp/routes-config');

const { appCreatorRoutesConfig } = require('./endpoints/appCreator/routes-config');

const { cmsRoutesConfig } = require('./endpoints/cms/routes-config');
const { patientsRoutesConfig } = require('./endpoints/patients/routes-config');
const { workersRoutesConfig } = require('./endpoints/workers/routes-config');

const { onCmsMigrationCreate } = require('./endpoints/organizations/controller');

const {
  patientsOnApplicantUpdate,
  cronExpiredDailyReports,
} = require('./endpoints/patients/controller');
const { cmsEntityOnCreate, cmsEntityOnUpdate } = require('./endpoints/cms/controller');

console.log('NODE_ENV:', process.env.NODE_ENV, 'ENVIRONMENT:', process.env.ENVIRONMENT);

// exports.GOOGLE_APPLICATION_CREDENTIALS =
//   '/Users/miche/Downloads/ecommitment-qa-f9c4e6687ac6_serviceaccountkey.json';

// admin.initializeApp(
//   {
//     ...FirebaseConfig,
//     // credential: applicationDefault()
//   },
//   // FIREBASE_PROD_APP_NAME
//   '[DEFAULT]'
// );

function addSpanId(req, res, next) {
  let spanId = req.headers.spanid;
  if (!spanId) spanId = Math.floor(Math.random() * 10000).toString();
  httpContext.set('span-id', spanId);
  next();
}

function onlyLocalLoadEnv(req, res, next) {
  // if (process.env.NODE_ENV !== 'production') {
  // Config.loadConfigSync();
  // }

  console.log(
    'NODE_ENV EN MIDDLEWARE (2):',
    process.env.NODE_ENV,
    'ENVIRONMENT EN MIDDLEWARE (2):',
    process.env.ENVIRONMENT
  );

  if (next) next();
}

function configureApp(app) {
  app.use(cors({ origin: true }));

  app.use(httpContext.middleware);

  // Se agrega el middleware en la aplicación.
  app.use(addSpanId);
  app.use(onlyLocalLoadEnv);
  app.use(serverTiming());

  // res.setMetric('db', 100.0, 'Database metric');
  // res.setMetric('api', 200.0, 'HTTP/API metric');
  // res.startTime('file', 'File IO metric');
  // res.endTime('file');
}

const createExpressWithPuppeteerApp = () => {
  const app = express();

  /**
   * Middleware: Get all routes and request to load browser
   */
  app.all('*', async (req, res, next) => {
    // note: --no-sandbox is required in this env.
    // Could also launch chrome and reuse the instance
    // using puppeteer.connect();

    res.locals.browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });
    next();
  });

  return app;
};

const scrapperApp = createExpressWithPuppeteerApp();

configureApp(scrapperApp);
scrapperRoutesConfig(scrapperApp);
exports.scrapper = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(scrapperApp);

const usersApp = express();
configureApp(usersApp);
usersRoutesConfig(usersApp);
exports.users = functions.https // }) //   // minInstances: envProjectId === "my-production-project" ? 5 : 0, //   // in production only. Default to 0 for test projects. //   // Keep 5 instances warm for this latency-critical function //   // memory: "2GB", //   // secrets: ['SECRET_KEY_TEST'], // .runWith({
  .onRequest(usersApp);

const adminApp = express();
configureApp(adminApp);
adminRoutesConfig(adminApp);
exports.admin = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(adminApp);

const attachmentsApp = express();
configureApp(attachmentsApp);
attachmentsRoutesConfig(attachmentsApp);
exports.attachments = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(attachmentsApp);

const whatsappApp = express();
configureApp(whatsappApp);
whatsappRoutesConfig(whatsappApp);
exports.whatsapp = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(whatsappApp);

const appCreatorApp = express();
configureApp(appCreatorApp);
appCreatorRoutesConfig(appCreatorApp);
exports.appCreator = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(appCreatorApp);

const cmsApp = express();
configureApp(cmsApp);
cmsRoutesConfig(cmsApp);
exports.cms = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(cmsApp);

const organizationsApp = express();
configureApp(organizationsApp);
organizationsRoutesConfig(organizationsApp);
exports.organizations = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(organizationsApp);

const patientsApp = express();
configureApp(patientsApp);
patientsRoutesConfig(patientsApp);
exports.patients = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(patientsApp);

const workersApp = express();
configureApp(workersApp);
workersRoutesConfig(workersApp);
exports.workers = functions
  .runWith({
    // memory: "2GB",
    // Keep 5 instances warm for this latency-critical function
    // in production only. Default to 0 for test projects.
    // minInstances: envProjectId === "my-production-project" ? 5 : 0,
  })
  .https.onRequest(workersApp);

// ** Begin BigQuery Streamer ** //

const BIGQUERY_DATASET_ID = 'app';
const BIGQUERY_DATASET_LOCATION = 'us-central1'; // value: us-central1, label: Iowa (us-central1) - value: us, label: United States (multi-regional)
const BIGQUERY_PROJECT_ID = FIREB_PROJECT_ID;
const BIGQUERY_USE_NEW_QUERY_SYNTAC = true;

const bigQueryStreamCollection = async (change, context, collectionName) => {
  console.log('Start bigQuery stream ');
  const resourceName = context.resource.name;

  try {
    const changeType = getChangeType(change);
    const documentId = getDocumentId(change);

    console.log(
      'Entrando con args: ',
      BIGQUERY_PROJECT_ID,
      collectionName,
      'context.eventId:',
      context.eventId
    );
    const eventTracker: FirestoreEventHistoryTracker = new FirestoreBigQueryEventHistoryTracker({
      collectionPath: collectionName,
      tableId: collectionName,
      datasetId: BIGQUERY_DATASET_ID,
      datasetLocation: BIGQUERY_DATASET_LOCATION,
      // param: BACKUP_COLLECTION
      // label: Backup Collection Name
      // description: >-
      //   This (optional) parameter will allow you to specify a collection for which failed BigQuery updates
      //   will be written to.
      // type: string
      // backupTableId: config.backupCollectionId,
      // transformFunction: config.transformFunction,
      // timePartitioning: config.timePartitioning,
      // timePartitioningField: config.timePartitioningField,
      // timePartitioningFieldType: config.timePartitioningFieldType,
      // timePartitioningFirestoreField: config.timePartitioningFirestoreField,
      // clustering: config.clustering,
      wildcardIds: false,
      bqProjectId: BIGQUERY_PROJECT_ID,
      useNewSnapshotQuerySyntax: BIGQUERY_USE_NEW_QUERY_SYNTAC,
    });

    await eventTracker.record([
      {
        timestamp: context.timestamp, // This is a Cloud Firestore commit timestamp with microsecond precision.
        operation: changeType,
        documentName: resourceName,
        documentId,
        // pathParams: config.wildcardIds ? context.params : null,
        pathParams: null,
        eventId: context.eventId,
        data: changeType === ChangeType.DELETE ? undefined : change.after.data(),
        oldData: changeType === ChangeType.CREATE ? undefined : change.before.data(),
      },
    ]);
    console.log('Complete big query stream ' + resourceName);
  } catch (e) {
    handleCronError({ message: 'Error in big query stream ' + resourceName, error: e });
  }
};

exports.usersBigQueryRealTimeStream = functions.firestore
  .document(Collections.USERS + '/{docId}')
  .onWrite(async (change, context) => {
    await bigQueryStreamCollection(change, context, Collections.USERS);
  });

exports.bigQueryRealTimeStream = functions.firestore
  .document('{collectionName}/{docId}')
  .onWrite(async (change, context) => {
    const { collectionName } = context.params;
    // const { collectionName, docId } = context.params;
    // const documentPath = `${collectionName}/${docId}`;

    if (collectionName.startsWith('ecommitment')) {
      await bigQueryStreamCollection(change, context, collectionName);
    }
  });

// ** End BigQuery Streamer ** //

exports.onCmsMigrationCreate = onCmsMigrationCreate;
exports.patientsOnApplicantUpdate = patientsOnApplicantUpdate;
exports.cronExpiredDailyReports = cronExpiredDailyReports;

exports.cmsEntityOnCreate = cmsEntityOnCreate;
exports.cmsEntityOnUpdate = cmsEntityOnUpdate;
