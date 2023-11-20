#!/usr/bin/env bash
set -e

echo "deploying..."

# echo "//registry.npmjs.org/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc
# echo "@abdalamichel:registry=https://npm.pkg.github.com/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc
# echo "@abdalamichel:registry=https://npm.pkg.github.com/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc
# echo "//npm.pkg.github.com/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc

 # ~/.npmrc

rm -f .npmrc
touch .npmrc

echo "//npm.pkg.github.com/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc

rm -f .env
touch .env

echo "ENVIRONMENT="${ENVIRONMENT} >> .env
echo "FIREB_PROJECT_ID="${FIREB_PROJECT_ID} >> .env
echo "FIREB_API_KEY="${FIREB_API_KEY} >> .env
echo "FIREB_AUTH_DOMAIN="${FIREB_AUTH_DOMAIN} >> .env
echo "FIREB_STORAGE_BUCKET="${FIREB_STORAGE_BUCKET} >> .env
echo "FIREB_MESSAGING_SENDER_ID="${FIREB_MESSAGING_SENDER_ID} >> .env
echo "FIREB_APP_ID="${FIREB_APP_ID} >> .env
echo "FIREB_MEASURAMENT_ID="${FIREB_MEASURAMENT_ID} >> .env

echo "SYS_ADMIN_EMAIL="${SYS_ADMIN_EMAIL} >> .env
echo "NEW_USERS_TEMP_PASSWORD="${NEW_USERS_TEMP_PASSWORD} >> .env
echo "DEFAULT_ORGANIZATION_ID="${DEFAULT_ORGANIZATION_ID} >> .env

echo "ZOHO_CLIENT_ID="${ZOHO_CLIENT_ID} >> .env
echo "ZOHO_CLIENT_SECRET="${ZOHO_CLIENT_SECRET} >> .env
echo "ZOHO_REDIRECT_URL="${ZOHO_REDIRECT_URL} >> .env
echo "ZOHO_REFRESH_TOKEN="${ZOHO_REFRESH_TOKEN} >> .env

echo "AIRTABLE_API_KEY="${AIRTABLE_API_KEY} >> .env

echo "GOOGLE_OAUTH_CLIENT_ID="${GOOGLE_OAUTH_CLIENT_ID} >> .env
echo "GOOGLE_OAUTH_CLIENT_SECRET="${GOOGLE_OAUTH_CLIENT_SECRET} >> .env
echo "GOOGLE_OAUTH_REDIRECT_URL="${GOOGLE_OAUTH_REDIRECT_URL} >> .env
echo "GOOGLE_CALENDAR_EVENT_WEBHOOK_URL="${GOOGLE_CALENDAR_EVENT_WEBHOOK_URL} >> .env

echo "WHATSAPP_TOKEN="${WHATSAPP_TOKEN} >> .env
echo "OPENAI_ORGANIZATION="${OPENAI_ORGANIZATION} >> .env
echo "OPENAI_APIKEY="${OPENAI_APIKEY} >> .env

echo "MIGRATION_TARGET_DATABASE_URL="${MIGRATION_TARGET_DATABASE_URL} >> .env

echo "EMAIL_INBOX_ADMISSION="${EMAIL_INBOX_ADMISSION} >> .env
echo "EMAIL_INBOX_COMERCIAL="${EMAIL_INBOX_COMERCIAL} >> .env
echo "EMAIL_INBOX_RECRUITER="${EMAIL_INBOX_RECRUITER} >> .env
echo "EMAIL_INBOX_CLINIC="${EMAIL_INBOX_CLINIC} >> .env
echo "EMAIL_INBOX_FINANZE="${EMAIL_INBOX_FINANZE} >> .env

# firebase deploy --project $FIREB_PROJECT_ID --token "$FIREBASE_TOKEN" --only functions:admin,functions:users,functions:products,functions:leads,functions:aspects,functions:attachments,functions:levels,functions:packages,functions:practitioners,functions:tasks,functions:userTasks
# firebase deploy --project $FIREB_PROJECT_ID --token "$FIREBASE_TOKEN" --only functions
# firebase deploy --project $FIREB_PROJECT_ID --token "$FIREBASE_TOKEN" --only functions:users,functions:admin,functions:leads,functions:products,functions:staff,functions:attachments,functions:usersByStaff,functions:userTouchpoints,functions:hookedEvents,functions:insights,functions:userProducts,functions:googleOAuth,functions:userCalendars,functions:userCalendarEvents,functions:companies,functions:companyEmployees,functions:companyClients,functions:companyProfiles,functions:companyDepartments,functions:onUserTouchpointCreate,functions:onUserTouchpointUpdate,functions:onHookedEventCreate,functions:onHookedEventUpdate,functions:onUserCalendarEventBronzeCreate,functions:vaultInstallments,functions:vaultTransactions,functions:onVaultCreate_ThenCreateCompanyClientRelationship,functions:scrapper,functions:transactionRequests,functions:cronUpdateUSDValuation,functions:marketCaps,functions:reminders
# firebase deploy --project $FIREB_PROJECT_ID --token "$FIREBASE_TOKEN" --only "functions:index.js"
firebase deploy --project $FIREB_PROJECT_ID --token "$FIREBASE_TOKEN" --only functions
#,functions:admin
#,functions:leads
#,functions:staff
#,functions:usersByStaff
#,functions:attachments
#,functions:insights
#,functions:googleOAuth
#,functions:userCalendars
#,functions:userCalendarEvents
#,functions:onUserCalendarEventBronzeCreate
#,functions:companies
#,functions:companyEmployees
#,functions:companyClients
#,functions:companyProfiles
#,functions:companyDepartments
#,functions:remindersApp
#,functions:usersBigQueryRealTimeStream
#,functions:leadsBigQueryRealTimeStream

echo "deploy complete!"
