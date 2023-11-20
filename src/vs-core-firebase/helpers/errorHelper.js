const fs = require('fs');
const { Logging } = require('@google-cloud/logging');
const httpContext = require('express-http-context');
const functions = require('firebase-functions');

const { EmailSender } = require('../email/emailSender');
const { CustomError } = require('../../vs-core');

const { WEBSITE_DOMAIN_URL, ENVIRONMENT, SYS_ADMIN_EMAIL } = process.env;

const isHttpError = function (err) {
  return err && err.isAxiosError && err.config && err.response;
};

const errorToJSON = function (error) {
  try {
    if (error && error instanceof CustomError.CustomError) {
      const newError = {
        message: error.message,
        code: error.code,
        name: error.name,
        stack: error.stack ? error.stack : null,
      };
      if (error.innerException && error.innerException.message) {
        newError.innerExceptionMessage = error.innerException.message;
        newError.innerExceptionStack = error.innerException.stack
          ? error.innerException.stack
          : null;
      }

      return newError;
    }
    return {
      message: error.message,
      stack: error.stack ? error.stack : null,
    };
  } catch (e) {
    console.log('Error en fn errorObjectToJSON', e);
    return error;
  }
};

const circularReplacer = () => {
  // Creating new WeakSet to keep
  // track of previously seen objects
  const seen = new WeakSet();

  return (key, value) => {
    // If type of value is an
    // object or value is null
    if (typeof value === 'object' && value !== null) {
      // If it has been seen before
      if (seen.has(value)) {
        return 'Object';
      }

      // Add current value to the set
      seen.add(value);
    }

    // return the value
    return value;
  };
};

const logger = {
  info: (data) => {
    logger.writeLog(data, functions.logger.log);
  },
  error: (data) => {
    logger.writeLog(data, functions.logger.error);
  },

  transformData: (object) => {
    const jsonString = JSON.stringify(object, circularReplacer());

    return JSON.parse(jsonString);
  },

  writeLog: (data, logFn) => {
    if (ENVIRONMENT === 'local') {
      if (data.message) console.log('Log Msj:', data.message);
      if (data.error) console.log('Log Err:', data.error);
      if (data.response) console.log('Log Response:', data.response);

      return;
    }

    try {
      logFn(data.message, {
        message: data.message,
        msg: data.message,
        textPayload: data.message,
        ...logger.transformData(data),
      });
    } catch (err) {
      console.error('Error escribiendo el log: ' + data.message);
    }

    if (process.env.NODE_ENV === 'production') return;

    console.log('ENVIRONMENT ES:', ENVIRONMENT, 'NODE_ENV:', process.env.NODE_ENV);

    // Instantiate the StackDriver Logging SDK. The project ID will
    // be automatically inferred from the Cloud Functions environment.
    const logging = new Logging();
    const log = logging.log('localhost-functions');

    // This metadata is attached to each log entry. This specifies a fake
    // Cloud Function called 'Custom Metrics' in order to make your custom
    // log entries appear in the Cloud Functions logs viewer.
    const METADATA = {
      severity: data.severity === SEVERITY_INFO ? 200 : 500,
      resource: {
        type: 'cloud_function',
        labels: {
          function_name: 'localLog',
          region: 'us-central1',
        },
      },
    };

    // Data to write to the log. This can be a JSON object with any properties
    // of the event you want to record.
    const logData = {
      message: data.message,
      msg: data.message,
      env: ENVIRONMENT,
      ...logger.transformData(data),
    };

    // Write to the log. The log.write() call returns a Promise if you want to
    // make sure that the log was written successfully.
    const entry = log.entry(METADATA, logData);
    log.write(entry);
  },
};

const SEVERITY_ERROR = 'error';
const SEVERITY_INFO = 'info';

const EVENT_TYPE_TRACE = 'trace';
const EVENT_TYPE_NAVIGATION = 'navigation';
const EVENT_TYPE_APP = 'app';

const EVENT_TYPE_CRON = 'cron';

exports.EVENT_TYPE_TRACE = EVENT_TYPE_TRACE;
exports.EVENT_TYPE_NAVIGATION = EVENT_TYPE_NAVIGATION;
exports.EVENT_TYPE_APP = EVENT_TYPE_APP;

const schemaVersion = '1.0';

exports.beautifyError = function (err) {
  if (isHttpError(err)) {
    return {
      message: 'HTTP ERROR ' + err.response.status,
      beautifyError: true,
      request: {
        endpoint: '[' + err.config.method + ']' + err.config.url,
        data: err.config.data,
      },
      response: {
        status: err.response.status,
        statusText: err.response.statusText,
        data: JSON.stringify(err.response.data),
      },
    };
  }

  return err;
};

async function notifyError(eventName, code, message, docId) {
  // console.log(eventName, code, message, docId);

  const HEADER_TITLE = eventName;
  const HEADER_BODY = 'Ocurrió un error  <br /> (' + docId + ') <br />' + code;
  const CONTENT_TITLE = code;
  const CONTENT_BODY = message;
  const BUTTON_TEXT = 'Ir al sitio';
  const BUTTON_LINK = WEBSITE_DOMAIN_URL;
  const emailTo = SYS_ADMIN_EMAIL;
  const SUBJECT = HEADER_TITLE;

  console.log('emailTo:', emailTo);
  await sendTemplateEmail(
    'src/vs-core-firebase/email/emailTemplates/error.html',
    HEADER_TITLE,
    HEADER_BODY,
    CONTENT_TITLE,
    CONTENT_BODY,
    BUTTON_TEXT,
    BUTTON_LINK,
    emailTo,
    SUBJECT
  );
}

async function sendTemplateEmail(
  template,
  HEADER_TITLE,
  HEADER_BODY,
  CONTENT_TITLE,
  CONTENT_BODY,
  BUTTON_TEXT,
  BUTTON_LINK,
  emailTo,
  SUBJECT
) {
  try {
    let html = fs.readFileSync(template, {
      encoding: 'utf-8',
    });

    html = html.replace('%%HEADER_TITLE%%', HEADER_TITLE);
    html = html.replace('%%HEADER_BODY%%', HEADER_BODY);
    html = html.replace('%%CONTENT_TITLE%%', CONTENT_TITLE);
    // html = html.replace("%%CONTENT_BODY%%", emailCsv);
    html = html.replace('%%CONTENT_BODY%%', CONTENT_BODY);

    html = html.replace('%%BUTTON_TEXT%%', BUTTON_TEXT);
    html = html.replace('%%BUTTON_LINK%%', BUTTON_LINK);

    // const mailResponse =
    await EmailSender.send({
      // from: '"TrendArt" <' + GMAIL_EMAIL + '>',
      to: emailTo,

      // bcc: SYS_ADMIN_EMAIL,
      message: { subject: SUBJECT, text: null, html },
    });

    console.log('Mail sended: (' + SUBJECT + ')');
  } catch (e) {
    console.log('Mail not sended:', e.message, e.code, e.response, e.responseCode, e.command);
    throw e;
  }
}

const errorLogger = async function ({
  uid,

  eventType,
  message,
  error,

  errorCode,
  data,
  notifyAdmin,
}) {
  const severity = SEVERITY_ERROR;

  if (!uid) {
    const locals = httpContext.get('locals');

    if (locals) uid = locals.uid;
  }

  if (!errorCode) {
    if (error && error instanceof CustomError.CustomError) {
      errorCode = error.code ? error.code : null;
    } else errorCode = null;
  }

  try {
    logger.error({
      uid: uid || null,

      message,
      spanId: httpContext.get('span-id'),
      schemaVersion,
      eventType: eventType || null,
      env: ENVIRONMENT,
      errorCode,
      severity: severity || null,
      data: data || null,
      error: error ? errorToJSON(error) : null,
    });
  } catch (err) {
    console.error(
      'Error in appLogger (1): ',
      uid,
      errorCode,
      severity,
      eventType,
      message,
      data,
      'INNER ERROR:',
      err
    );
  }

  try {
    if (notifyAdmin && ENVIRONMENT !== 'local') {
      await notifyError(message, errorCode, JSON.stringify(message), uid);
    }
  } catch (err) {}
};

exports.handleError = function (req, res, err, notifyAdmin) {
  if (err instanceof CustomError.CustomError) {
    handleCustomError(req, res, err, err.httpCode, notifyAdmin);
    return;
  }

  let newErr = err;
  let message = null;
  if (isHttpError(err)) {
    newErr = exports.beautifyError(err);
    message = `handleError - Error fetching: ${newErr.request.endpoint} - Response: [${newErr.response.status}] ${newErr.response.data}`;
  } else {
    message = `${newErr.message}`;
  }

  errorLogger({
    message,
    eventType: EVENT_TYPE_NAVIGATION,
    error: newErr,
    data: getIOLoggingInfo(req, res),
    notifyAdmin,
  });

  res.status(500).send({ message });
};

exports.handleCronError = function ({ message, error }) {
  let newErr = error;
  let newMessage = '(' + ENVIRONMENT + ')' + message;

  if (isHttpError(error)) {
    newErr = exports.beautifyError(error);
    newMessage = `handleCronError - Error fetching: ${message} ${newErr.request.endpoint} - Response: [${newErr.response.status}] ${newErr.response.data}`;
  }

  errorLogger({
    message: newMessage,
    eventType: EVENT_TYPE_CRON,
    error: newErr,
    notifyAdmin: true,
  });

  throw error;
};

const getIOLoggingInfo = function (req) {
  const { method, socket } = req;
  const { remoteAddress, remoteFamily } = socket;

  const requestHeaders = {
    originHeader: req.header('origin'),
    referer: req.header('referer'),
  };

  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  return {
    timestamp: Date.now(),

    request: {
      requestHeaders,

      method,
      remoteAddress,
      remoteFamily,
      fullUrl,
    },
  };
};

const handleCustomError = function (req, res, err, httpCode, notifyAdmin) {
  let retHttpCode = 500;
  if (httpCode) retHttpCode = httpCode;

  const message = `handleCustomError (${retHttpCode}) : ${err.code} - ${err.message}`;

  errorLogger({
    message,
    eventType: EVENT_TYPE_NAVIGATION,
    error: err,
    data: getIOLoggingInfo(req, res),
    notifyAdmin,
  });

  if (err.innerException) {
    errorLogger({
      message: message + '(InnerException)',
      eventType: EVENT_TYPE_NAVIGATION,
      error: err.innerException,
      data: getIOLoggingInfo(req, res),
      notifyAdmin,
    });
  }

  return res.status(retHttpCode).send({
    code: err.code,
    message: err.message,
    errorType: err.name,
    isCustomError: true,
  });
};

exports.getCustomError = function (err) {
  if (
    err &&
    err.isAxiosError &&
    err.response &&
    err.response.data &&
    err.response.data.isCustomError
  ) {
    return new CustomError.CustomError(
      err.response.data.code,
      err.response.status,
      err.response.data.message
    );
  }
  return null;
};

exports.handleCustomError = handleCustomError;
