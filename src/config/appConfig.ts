// import { Config } from '@abdalamichel/vs-core';
import { Config } from '../vs-core';

let environment = Config.getEnvConfig('ENVIRONMENT');

if (!environment) {
  Config.loadConfigSync();

  environment = Config.getEnvConfig('ENVIRONMENT');
}

export const ENVIRONMENT = environment;
export const SYS_ADMIN_EMAIL = Config.getEnvConfig('SYS_ADMIN_EMAIL');
export const NEW_USERS_TEMP_PASSWORD = Config.getEnvConfig('NEW_USERS_TEMP_PASSWORD');
export const DEFAULT_ORGANIZATION_ID = Config.getEnvConfig('DEFAULT_ORGANIZATION_ID');

export const FIREB_API_KEY = Config.getEnvConfig('FIREB_API_KEY');
export const FIREB_AUTH_DOMAIN = Config.getEnvConfig('FIREB_AUTH_DOMAIN');
export const FIREB_PROJECT_ID = Config.getEnvConfig('FIREB_PROJECT_ID');
export const FIREB_STORAGE_BUCKET = Config.getEnvConfig('FIREB_STORAGE_BUCKET');
export const FIREB_MESSAGING_SENDER_ID = Config.getEnvConfig('FIREB_MESSAGING_SENDER_ID');
export const FIREB_MEASURAMENT_ID = Config.getEnvConfig('FIREB_MEASURAMENT_ID');
export const FIREB_APP_ID = Config.getEnvConfig('FIREBASE_APP_ID');

export const ZOHO_CLIENT_ID = Config.getEnvConfig('ZOHO_CLIENT_ID');
export const ZOHO_CLIENT_SECRET = Config.getEnvConfig('ZOHO_CLIENT_SECRET');
export const ZOHO_REDIRECT_URL = Config.getEnvConfig('ZOHO_REDIRECT_URL');
export const ZOHO_REFRESH_TOKEN = Config.getEnvConfig('ZOHO_REFRESH_TOKEN');
export const ZOHO_DEFAULT_OWNER_ID = Config.getEnvConfig('ZOHO_DEFAULT_OWNER_ID');

export const AIRTABLE_API_KEY = Config.getEnvConfig('AIRTABLE_API_KEY');
export const GOOGLE_SERVICE_ACCOUNT_EMAIL = Config.getEnvConfig('GOOGLE_SERVICE_ACCOUNT_EMAIL');
export const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = Config.getEnvConfig(
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'
);

export const GOOGLE_OAUTH_CLIENT_ID = Config.getEnvConfig('GOOGLE_OAUTH_CLIENT_ID');
export const GOOGLE_OAUTH_CLIENT_SECRET = Config.getEnvConfig('GOOGLE_OAUTH_CLIENT_SECRET');
export const GOOGLE_OAUTH_REDIRECT_URL = Config.getEnvConfig('GOOGLE_OAUTH_REDIRECT_URL');
export const GOOGLE_CALENDAR_EVENT_WEBHOOK_URL = Config.getEnvConfig(
  'GOOGLE_CALENDAR_EVENT_WEBHOOK_URL'
);

export const API_URL_LEADS = Config.getEnvConfig('API_URL_LEADS');

export const MIGRATION_TARGET_DATABASE_URL = Config.getEnvConfig('MIGRATION_TARGET_DATABASE_URL');

export const EMAIL_INBOX_ADMISSION = Config.getEnvConfig('EMAIL_INBOX_ADMISSION');
export const EMAIL_INBOX_COMERCIAL = Config.getEnvConfig('EMAIL_INBOX_COMERCIAL');
export const EMAIL_INBOX_RECRUITER = Config.getEnvConfig('EMAIL_INBOX_RECRUITER');
export const EMAIL_INBOX_CLINIC = Config.getEnvConfig('EMAIL_INBOX_CLINIC');
export const EMAIL_INBOX_FINANZE = Config.getEnvConfig('EMAIL_INBOX_FINANZE');
