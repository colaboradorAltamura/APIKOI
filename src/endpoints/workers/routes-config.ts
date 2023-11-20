import { Audit } from '../../vs-core-firebase';

import { Auth } from '../../vs-core-firebase';

const {
  allowCheckIn,
  allowCheckOut,
  checkIn,
  checkOut,
  workerSchedule,
  getPatientReports,
  createDailyReport,
} = require('./controller');

exports.workersRoutesConfig = function (app) {
  app.get('/my-schedule', [Audit.logger, Auth.isAuthenticated, workerSchedule]);

  app.get('/allow-check-in/:patientId/:itineraryId/:itineraryType', [
    Audit.logger,
    Auth.isAuthenticated,
    allowCheckIn,
  ]);

  app.get('/allow-check-out/:patientId/:itineraryId/:itineraryType', [
    Audit.logger,
    Auth.isAuthenticated,
    allowCheckOut,
  ]);

  app.get('/reports/:patientId', [Audit.logger, Auth.isAuthenticated, getPatientReports]);

  app.post('/check-in/:patientId/:itineraryId/:itineraryType', [
    Audit.logger,
    Auth.isAuthenticated,
    checkIn,
  ]);

  app.post('/check-out/:patientId/:itineraryId/:itineraryType', [
    Audit.logger,
    Auth.isAuthenticated,
    checkOut,
  ]);

  app.post('/daily-report/:patientId/:itineraryId/:itineraryType', [
    Audit.logger,
    Auth.isAuthenticated,
    createDailyReport,
  ]);
};
