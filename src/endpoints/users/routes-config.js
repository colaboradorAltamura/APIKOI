const {
  find,

  get,
  create,

  patch,

  remove,
  signUp,
  signIn,
  signUpFederatedAuth,

  createByUser,
  listGrantedCompanies,
  setUserPassword,
} = require('./controller');

const { Audit } = require('../../vs-core-firebase');
const { Auth } = require('../../vs-core-firebase');
const { Types } = require('../../vs-core');

exports.usersRoutesConfig = function (app) {
  // devuelve un usuario
  app.get('/granted-companies', [Audit.logger, Auth.isAuthenticated, listGrantedCompanies]);

  app.post('/sign-up-federated-auth', [Audit.logger, Auth.isAuthenticated, signUpFederatedAuth]);

  // devuelve un usuario
  app.get('/:userId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN, Types.AppRols.APP_STAFF_ADMISSION],
      allowStaffRelationship: true,
      allowSameUser: true,
    }),
    get,
  ]);

  // devuelve todos los usuarios
  app.get('/', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    find,
  ]);

  app.post('/sign-up', [Audit.logger, signUp]);

  app.post('/sign-in', [Audit.logger, Auth.isAuthenticated, signIn]);

  app.post('/by-user', [
    Audit.logger,
    Auth.isAuthenticated,
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN, Types.AppRols.APP_STAFF] }),
    createByUser,
  ]);

  app.post('/', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    create,
  ]);

  // allowStaffRelationship se habilita pero en el controller se evalua el perfil y en base a eso se actualizan uno u otros datos
  app.patch('/:userId', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({
      hasAppRole: [Types.AppRols.APP_ADMIN],
      allowStaffRelationship: true,
      allowSameUser: true,
    }),
    patch,
  ]);

  // separo en este endpoint para discriminar cuales campos
  // app.patch('/by-Staff/:userId', [
  //   Audit.logger,
  //   Auth.isAuthenticated,
  //   Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN], allowStaffRelationship: true }),
  //   patchByStaff,
  // ]);

  // aca siempre va con ID
  app.delete('/:id', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    remove,
  ]);

  app.post('/set-user-pw', [
    Audit.logger,
    Auth.isAuthenticated,
    Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    setUserPassword,
  ]);
};
