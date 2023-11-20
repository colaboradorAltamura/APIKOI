# vs-core

GCP application framework.
firebase login:ci >> obtiene token FIREBASE_TOKEN

## Project Status

[![license](https://img.shields.io/npm/l/vs-core.svg)](https://github.com/abdalamichel/vs-core/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/vs-core.svg)](https://github.com/abdalamichel/VS-Core/packages/1099576)
![Build Status](https://github.com/abdalamichel/vs-core/actions/workflows/github-npm-publish-on-release-created.yml/badge.svg)
[![codecov](https://codecov.io/gh/abdalamichel/vs-core/branch/master/graph/badge.svg)](https://codecov.io/gh/abdalamichel/vs-core)<br/>
[![NPM](https://nodei.co/npm/vs-core.png?downloads=true&downloadRank=true&stars=true)](https://github.com/abdalamichel/VS-Core/packages/1099576)

## Documentation

[Full API documentation](docs/API.md) - Learn about each method

## Getting Started

Setup your firebase application on https://firebase.google.com/

## Install

```sh
npm install @abdalamichel/vs-core@0.0.9 -g
```

### Creating a new application

- Initialize a new application (this will download the application [vs-core-template](https://github.com/abdalamichel/vs-core-template/))

```sh
vs-core init -n newapp
```

- Modify the application name in `package.json`
- Follow the steps in [vs-core-template/DEVELOPMENT.md](https://github.com/abdalamichel/vs-core-template/blob/master/DEVELOPMENT.md) to get your application
  running.

### USEFULL

- https://docs.github.com/es/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- npm i firebase@latest
  > VSCode utils
- nvm alias default v16.17.1

- $ npm login --scope=abdalamichel --registry=https://npm.pkg.github.com

- Username: USERNAME
- Password: TOKEN
- Email: PUBLIC-EMAIL-ADDRESS

- Para crear FIREBASE TOKEN
  firebase login:ci

- Crear los secrets:
- NODE_AUTH_TOKEN: ${{secrets.VS_GITHUB_NPM_TOKEN}}
- VS_GITHUB_NPM_TOKEN: ${{secrets.VS_GITHUB_NPM_TOKEN}}
- FIREBASE_TOKEN: ${{secrets.FIREBASE_TOKEN}}

Calendar integration:

- Configure google calendar api
- Create credential OAuth2 and set Authorized redirect URIs to "http://localhost:5001/\*\*\*/us-central1/googleOAuth/oauth2callback and the prod url
- copy the credential clientId and secret and configure .env and secrets (GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET)
- also configure redirect url in env, eg GOOGLE_OAUTH_REDIRECT_URL="http://localhost:5001/tryaconcagua-qa/us-central1/googleOAuth/oauth2callback"
- configure google calendar webhook url in env, eg: GOOGLE_CALENDAR_EVENT_WEBHOOK_URL="https://us-central1-tryaconcagua-qa.cloudfunctions.net/userCalendarEvents/google-event-webhook"

## Local setup

- Requirements:

  - nvm
  - git bash
  - vs code with eslint extension.

- Install nodejs version:

  - Open .nvmrs file to get required nodejs version (refered as \<version> down below)
  - Install version: "nvm install \<version>" in command line.
  - Activate nodejs in repo: "nvm use \<version>" in command line.

- Install dependencies:

  - Install app dependencies: "npm i" in command line.

- Set .env file:

  - Copy .env.template to a new file and rename it to ".env".

- Set Firebase env:

  - Login to Firebase: "firebase login" in command line.
  - Set Firebase alias: "firebase use \<alias>" in command line, where \<alias> refers to "default" (catedral) or "prod" (aconcagua-fb).

- Run app: "npm start" in command line.

const db = admin.firestore();
const ref = db
.collection(collectionName)
.where('state', '==', StateTypes.STATE_ACTIVE)
.where('companyId', '==', companyId);

const querySnapshot = await ref.get();

if (!querySnapshot.docs) return null;

const items = querySnapshot.docs.map((doc) => {
const id = doc.id;
const data = doc.data();

if (data.createdAt) data.createdAt = data.createdAt.toDate();
if (data.updatedAt) data.updatedAt = data.updatedAt.toDate();

return { ...data, id };
});

---

schemaFields

schemaId: 'patientPathologies'
fieldType: 'string' // multiRelationship | singleRelationship
relationshipName: 'patient'

id: 123
name:

---

Aux code:

// SI ES UN SCHEMA DE TIPO USER (EG: PATIENTS) ENTONCES BUSCAR POR LA COLECTION DE USERS
// if (entitySchemaWithFields.schemaType === EntitySchemaTypes.USER_ENTITY) {
// const filteredUsersResult = await listWithRelationships({
// limit,
// offset,
// filters,

    //     listByCollectionName: Collections.USERS,
    //     indexedFilters: entitySchemaWithFields.indexedFilters,
    //     relationships: queryRelationships,
    //   });

    //   // con los usuarios ya filtrados, voy a la tabla de la entidad por estos ids
    //   const entityItems = await fetchItemsByIds({
    //     collectionName: entitySchemaWithFields.collectionName,
    //     ids: filteredUsersResult.items.map((item) => {
    //       return item.id;
    //     }),
    //   });

    //   await fillItemsWithRelationships({ items: entityItems, relationships: queryRelationships });

    //   result = { ...filteredUsersResult, items: entityItems };
    // } else

TODO - Cuando hago path de una entidad que es tipo user entity entonces actualizar el user los primary fields

---

[GET] https://us-central1-ecommitment-qa.cloudfunctions.net/workers/allow-check-in/:patientId/:itineraryId/:itineraryType

Request Params: - patientId: string >> identificador de paciente
Request Query: - latitude: number >> geo actual del dispositivo - longitude: number >> geo actual del dispositivo
Response: - data: {allowed: boolean}

Validations: - < 200 meters lineales al paciente
        -
[GET] https://us-central1-ecommitment-qa.cloudfunctions.net/workers/allow-check-out/:patientId/:itineraryId/:itineraryType

Request Params: - patientId: string >> identificador de paciente
Request Query: - latitude: number >> geo actual del dispositivo - longiture: number >> geo actual del dispositivo
Response: - data: {allowed: boolean}

Validations: - < 200 meters lineales al paciente
        -
[GET] https://us-central1-ecommitment-qa.cloudfunctions.net/cms/patients/:id

Request Params: - id: string >> identificador de paciente

Response: - data: {
firstName: string,
lastName: string,
email: string,
phone, string
address, string
allowOffline: boolean
            }
[Headers]
[GET] https://us-central1-ecommitment-qa.cloudfunctions.net/workers/my-schedule

Request Params: - id: string >> identificador del worker

Response: - data: {
date: date,
intitalHour: time,
finalHour: time,
patientId: string,
addressId: string,
status: string,
            }
[Headers]
[GET] https://us-central1-ecommitment-qa.cloudfunctions.net/workers/daily-report/:patientId

Request Params: - id: string >> identificador del paciente

Response: - data: {
generalNotes: string, (está vacío)
goalType: string, (seria una lista?)
goalDescription: string,

}
[Headers]
[POST] https://us-central1-ecommitment-qa.cloudfunctions.net/workers/daily-report/:patientId

Request Params: - id: string >> identificador del paciente

RequestBody: - data: {
generalNotes: string,
goalType: string, (seria una lista?)
goalDescription: string,
goalScore: integer,
goalNotes: string,
            }

Response: - data: {"Reporte Diario Aceptado"}

Validations: - < existe un evento que coincide con la fecha del reporte?

timeoutSeconds: 540,
Usar para aumentar el Time Out al hacer debug        -
