const axios = require('axios');
const FormData = require('form-data');
/* eslint-disable camelcase */
const httpContext = require('express-http-context');
const { HttpClient, CustomError } = require('../vs-core');

const { LoggerHelper } = require('../vs-core-firebase');

const { AIRTABLE_API_KEY } = require('../config/appConfig');
const { beautifyError } = require('../vs-core-firebase/helpers/errorHelper');

exports.invoke_post_api = async function ({ endpoint, payload, noTrace }) {
  const httpMethod = 'POST';

  const apiUrl = endpoint;

  let result = null;

  const traceStart = new Date();

  try {
    const authHeader = httpContext.get('request-authorization-header');
    const spanId = httpContext.get('span-id');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader ? authHeader.authorization : null,
      },
    };

    if (spanId) config.headers.spanid = spanId;

    result = await HttpClient.httpPost(apiUrl, {
      data: payload,
      ...config,
    });

    // Calculate the difference in milliseconds
    const difference_ms = new Date().getTime() - traceStart.getTime();

    const isErrorResponse = !result || !result.data;

    const responseStatusCode = result && result.status ? result.status : '400';

    LoggerHelper.serviceLogger({
      severity: isErrorResponse ? LoggerHelper.SEVERITY_ERROR : LoggerHelper.SEVERITY_INFO,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: !noTrace ? result : 'noTrace',
    });

    if (isErrorResponse) {
      throw new CustomError.TechnicalError(
        'API_HTTP_ERROR',
        responseStatusCode,
        'Hubo un error en la respuesta de API' // TODO - Michel poner desc de api
      );
    }
    return result;
  } catch (e) {
    if (e.response) {
      // eslint-disable-next-line no-console
      console.error(
        'ERROR HTTP CLIENT',
        e.message,
        e.isAxiosError,
        JSON.stringify(e.response),
        'ERROR DATA HTTP CLIENT:',
        JSON.stringify(e.response.data)
      );
    }
    const responseStatusCode = result && result.status ? result.status : '400';

    const difference_ms = new Date().getTime() - traceStart.getTime();
    LoggerHelper.serviceLogger({
      severity: LoggerHelper.SEVERITY_ERROR,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: null,
      error: e,
    });

    throw e;
  }
};

exports.invoke_get_api = async function ({ endpoint, noTrace }) {
  const httpMethod = 'GET';

  const apiUrl = endpoint;

  let result = null;

  const traceStart = new Date();

  try {
    const authHeader = httpContext.get('request-authorization-header');
    const spanId = httpContext.get('span-id');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader ? authHeader.authorization : null,
      },
    };

    if (spanId) config.headers.spanid = spanId;

    result = await HttpClient.httpGet(apiUrl, {
      ...config,
    });

    // Calculate the difference in milliseconds
    const difference_ms = new Date().getTime() - traceStart.getTime();

    const isErrorResponse = !result || !result.data;

    const responseStatusCode = result && result.status ? result.status : '400';

    LoggerHelper.serviceLogger({
      severity: isErrorResponse ? LoggerHelper.SEVERITY_ERROR : LoggerHelper.SEVERITY_INFO,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: null,
      response: !noTrace ? result : 'noTrace',
    });

    if (isErrorResponse) {
      throw new CustomError.TechnicalError(
        'API_HTTP_ERROR',
        responseStatusCode,
        'Hubo un error en la respuesta de API' // TODO - Michel poner desc de api
      );
    }
    return result;
  } catch (e) {
    const responseStatusCode = result && result.status ? result.status : '400';

    const difference_ms = new Date().getTime() - traceStart.getTime();
    LoggerHelper.serviceLogger({
      severity: LoggerHelper.SEVERITY_ERROR,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: null,
      response: null,
      error: e,
    });

    throw e;
  }
};

exports.invokePatchAirtable = async function ({ endpoint, payload, noTrace }) {
  const httpMethod = 'PATCH';

  const baseUrl = 'https://api.airtable.com/v0/app7xJezTyZNEVRGE';
  const apiUrl = baseUrl + endpoint;

  let result = null;

  const traceStart = new Date();

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + AIRTABLE_API_KEY,
      },
    };

    result = await HttpClient.httpPatch(apiUrl, {
      data: payload,
      ...config,
    });

    // Calculate the difference in milliseconds
    const difference_ms = new Date().getTime() - traceStart.getTime();

    const isErrorResponse = !result || !result.data;

    const responseStatusCode = result && result.status ? result.status : '400';

    LoggerHelper.serviceLogger({
      severity: isErrorResponse ? LoggerHelper.SEVERITY_ERROR : LoggerHelper.SEVERITY_INFO,
      message: 'AIRTABLE Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: !noTrace ? result : 'noTrace',
    });

    if (isErrorResponse) {
      throw new CustomError.TechnicalError(
        'AIRTABLE_HTTP_ERROR',
        responseStatusCode,
        'Hubo un error en la respuesta de API' // TODO - Michel poner desc de api
      );
    }
    return result;
  } catch (e) {
    if (e.response) {
      // eslint-disable-next-line no-console
      console.error(
        'ERROR HTTP CLIENT',
        e.message,
        e.isAxiosError,
        JSON.stringify(e.response),
        'ERROR DATA HTTP CLIENT:',
        JSON.stringify(e.response.data)
      );
    }
    const responseStatusCode = result && result.status ? result.status : '400';

    const difference_ms = new Date().getTime() - traceStart.getTime();
    LoggerHelper.serviceLogger({
      severity: LoggerHelper.SEVERITY_ERROR,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: null,
      error: e,
    });

    throw e;
  }
};

exports.invokePostWhatsApp = async function ({ phoneNumberId, token, payload, noTrace }) {
  const httpMethod = 'POST';

  // const baseUrl =
  //   'https://graph.facebook.com/v15.0/' + phoneNumberId + '/messages?access_token=' + token;

  const baseUrl = 'https://graph.facebook.com/v15.0/' + phoneNumberId + '/messages';

  const apiUrl = baseUrl;

  let result = null;

  const traceStart = new Date();

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    result = await HttpClient.httpPost(apiUrl, {
      data: payload,
      ...config,
    });

    // Calculate the difference in milliseconds
    const difference_ms = new Date().getTime() - traceStart.getTime();

    const isErrorResponse = !result;

    const responseStatusCode = result && result.status ? result.status : '400';

    LoggerHelper.serviceLogger({
      severity: isErrorResponse ? LoggerHelper.SEVERITY_ERROR : LoggerHelper.SEVERITY_INFO,
      message: 'WHATSAPP Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: !noTrace ? result : 'noTrace',
    });

    if (isErrorResponse) {
      throw new CustomError.TechnicalError(
        'WHATSAPP_HTTP_ERROR',
        responseStatusCode,
        'Hubo un error en la respuesta de API' // TODO - Michel poner desc de api
      );
    }
    return result;
  } catch (e) {
    const responseStatusCode = e.beautifyError ? e.response.status : '400';

    const difference_ms = new Date().getTime() - traceStart.getTime();
    LoggerHelper.serviceLogger({
      severity: LoggerHelper.SEVERITY_ERROR,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: null,
      error: e,
    });

    throw e;
  }
};

exports.invokePostWhatsAppMedia = async function ({ phoneNumberId, token, file }) {
  // const baseUrl =
  //   'https://graph.facebook.com/v15.0/' + phoneNumberId + '/messages?access_token=' + token;

  const apiUrl = 'https://graph.facebook.com/v15.0/' + phoneNumberId + '/media';

  const axios = require('axios');

  const data = new FormData();
  data.append('messaging_product', 'whatsapp');
  data.append('file', file);

  const config = {
    method: 'post',
    url: apiUrl,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data',
      ...data.getHeaders(),
    },
    data,
  };

  try {
    const response = await axios(config);

    return response;
  } catch (e) {
    console.log('PASO POR ACA', e.message, beautifyError(e));
    throw e;
  }
};

exports.invokeGetFacebookGraph = async function ({ rawUrl, url, token, payload, noTrace }) {
  const httpMethod = 'GET';

  let baseUrl = 'https://graph.facebook.com/v15.0' + url;

  if (rawUrl) baseUrl = rawUrl;

  const apiUrl = baseUrl;

  let result = null;

  const traceStart = new Date();

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    result = await HttpClient.httpPost(apiUrl, {
      data: payload,
      ...config,
    });

    // Calculate the difference in milliseconds
    const difference_ms = new Date().getTime() - traceStart.getTime();

    const isErrorResponse = !result;

    const responseStatusCode = result && result.status ? result.status : '400';

    LoggerHelper.serviceLogger({
      severity: isErrorResponse ? LoggerHelper.SEVERITY_ERROR : LoggerHelper.SEVERITY_INFO,
      message: 'FACEBOOKGRAPH Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: !noTrace ? result : 'noTrace',
    });

    if (isErrorResponse) {
      throw new CustomError.TechnicalError(
        'FACEBOOKGRAPH_HTTP_ERROR',
        responseStatusCode,
        'Hubo un error en la respuesta de API' // TODO - Michel poner desc de api
      );
    }
    return result;
  } catch (e) {
    const responseStatusCode = e.beautifyError ? e.response.status : '400';

    const difference_ms = new Date().getTime() - traceStart.getTime();
    LoggerHelper.serviceLogger({
      severity: LoggerHelper.SEVERITY_ERROR,
      message: 'API Invoke: (' + responseStatusCode + ') [' + httpMethod + '] ' + apiUrl,

      service: apiUrl,
      elapsedTime: difference_ms,
      request: payload,
      response: null,
      error: e,
    });

    throw e;
  }
};

exports.invokeDownloadFile = async ({ url, token }) => {
  const headers = { 'Content-Type': 'application/json' };

  if (token) headers.Authorization = 'Bearer ' + token;

  const response = await axios.get(url, {
    responseType: 'stream', // esta era LA clave !
    headers,
  });
  // console.log('RESPONSE ES:', response.data);

  // return Buffer.from(response.data, 'binary').toString('base64');
  return response.data;
  // return Buffer.from(response.data, 'binary');
  // .then((response) => Buffer.from(response.data, 'binary'));
  // .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
};
