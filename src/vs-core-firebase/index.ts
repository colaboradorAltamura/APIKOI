import * as Audit from './audit';
import * as LoggerHelper from './helpers/loggerHelper';
import * as ErrorHelper from './helpers/errorHelper';

import { allowAnonymous, isAuthenticated } from './auth/authenticated';
import { isAuthorized, userIsGranted } from './auth/authorized';
import { isAuthorizedCms, isAuthorizedPublicCms } from './auth/authorizedCms';
import { EmailSender } from './email/emailSender';
import { BigQuery } from './bigquery';
import { DialogFlow } from './dialogflow';
import { getChangeType, getDocumentId } from './firestorePubSub';

const Auth = {
  allowAnonymous,
  isAuthenticated,
  isAuthorized,
  isAuthorizedCms,
  isAuthorizedPublicCms,
  userIsGranted,
};

export {
  Audit,
  Auth,
  LoggerHelper,
  ErrorHelper,
  EmailSender,
  BigQuery,
  DialogFlow,
  getChangeType,
  getDocumentId,
};
