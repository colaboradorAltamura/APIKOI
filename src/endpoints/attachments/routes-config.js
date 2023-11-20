const { find, get, create, patch, remove, fileToDownloadUrl } = require('./controller');

const { Audit } = require('../../vs-core-firebase');
const { Auth } = require('../../vs-core-firebase');
const { Types } = require('../../vs-core');

exports.attachmentsRoutesConfig = function (app) {
  app.get('/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    get,
  ]);

  app.get('/', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    find,
  ]);

  app.post('/file-to-download-url/:schemaName', [
    Audit.logger,

    Auth.isAuthenticated,
    Auth.isAuthorizedCms({ allowSchemaRol: Types.SchemaRolActionType.SCHEMA_ROL_ACTION_READ }),
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    fileToDownloadUrl,
  ]);

  app.post('/', [
    Audit.logger,

    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    create,
  ]);

  app.patch('/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    patch,
  ]);

  app.delete('/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    remove,
  ]);
};
