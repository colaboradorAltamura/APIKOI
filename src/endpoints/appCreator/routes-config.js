const { findForms, getForm, createForm, patchForm, removeForm } = require('./forms/controller');

const {
  findWidgets,
  getWidget,
  createWidget,
  patchWidget,
  removeWidget,
} = require('./widgets/controller');

const { Audit } = require('../../vs-core-firebase');
const { Auth } = require('../../vs-core-firebase');
const { Types } = require('../../vs-core');

exports.appCreatorRoutesConfig = function (app) {
  app.get('/forms/:id', [Audit.logger, getForm]);

  app.get('/forms', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    findForms,
  ]);

  app.post('/forms', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    createForm,
  ]);

  app.patch('/forms/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    patchForm,
  ]);

  app.delete('/forms/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    removeForm,
  ]);

  // Widgets
  app.get('/widgets/:id', [Audit.logger, getWidget]);

  app.get('/widgets', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    findWidgets,
  ]);

  app.post('/widgets', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    createWidget,
  ]);

  app.patch('/widgets/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    patchWidget,
  ]);

  app.delete('/widgets/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    removeWidget,
  ]);
};
