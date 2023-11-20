const { validateSubscription, receiveMessage, openaiText, openaiImage } = require('./controller');

const { Audit } = require('../../vs-core-firebase');
const { Auth } = require('../../vs-core-firebase');

exports.whatsappRoutesConfig = function (app) {
  app.get('/', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    validateSubscription,
  ]);

  app.post('/openai/text', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    openaiText,
  ]);

  app.post('/openai/image', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    openaiImage,
  ]);

  app.post('/', [
    Audit.logger,
    Auth.allowAnonymous,
    // Auth.isAuthorized({ hasAppRole: [Types.AppRols.APP_ADMIN] }),
    receiveMessage,
  ]);
};
