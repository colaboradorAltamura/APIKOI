import { Audit } from '../../vs-core-firebase';

import { Auth } from '../../vs-core-firebase';
import { Types } from '../../vs-core';

const {
  convertApplicantToPatient,
  allAppointments,
  processExpiredDailyReports,
  patientSchedule,
} = require('./controller');

exports.patientsRoutesConfig = function (app) {
  app.post('/convert-applicant-to-patient/:applicantId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    convertApplicantToPatient,
  ]);

  app.get('/appointments', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    allAppointments,
  ]);

  app.get('/patient-schedule/:patientId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    patientSchedule,
  ]);

  // endpoit used to test daily report job from postman
  app.get('/processExpiredDailyReports', [Audit.logger, processExpiredDailyReports]);
};
