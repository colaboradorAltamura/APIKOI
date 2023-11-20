import { Audit } from '../../vs-core-firebase';

import { Auth } from '../../vs-core-firebase';
import { Types } from '../../vs-core';

const { getMine, patch, exportConfig, initializeOrganization } = require('./controller');

exports.organizationsRoutesConfig = function (app) {
  app.post('/initialize', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    initializeOrganization,
  ]);

  app.post('/export-config', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    exportConfig,
  ]);

  app.get('/:mine', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
    }),
    getMine,
  ]);

  app.patch('/:userId/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      allowSameUser: true,
      allowStaffRelationship: true,
    }),
    patch,
  ]);
};
