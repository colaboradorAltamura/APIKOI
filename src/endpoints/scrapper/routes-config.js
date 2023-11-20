const { scrappDolarHoyDolarCripto } = require('./controller');

const { Audit } = require('../../vs-core-firebase');

exports.scrapperRoutesConfig = function (app) {
  app.get('/dolar-cripto', [
    Audit.logger,
    // Auth.isAuthenticated,
    // Auth.isAuthorized({
    //   hasAppRole: [Types.AppRols.APP_ADMIN, Types.AppRols.APP_STAFF],
    // }),
    scrappDolarHoyDolarCripto,
  ]);
};
