import { NEW_USERS_TEMP_PASSWORD } from '../../config/appConfig';
import { Collections } from '../../types/collectionsTypes';
import { CustomError, Types } from '../../vs-core';
import { creationStruct, updateStruct } from '../../vs-core-firebase/audit';

const admin = require('firebase-admin');

const createUser = async function ({ auditUid, userData, appUserStatus, password }) {
  let userId = userData.id;
  let avatarUrl = null;

  console.log('createUser: ' + JSON.stringify(userData));

  // TODO MICHEL escenarios de existencia de uid o de email
  if (userId) {
    const CREATE_USER_INVALID_EMAIL_OR_ID_ERROR_CODE = 'CREATE_USER_INVALID_EMAIL_OR_ID';

    try {
      console.log('Se busca usuario con id ' + userId);

      const firestoreUser = await admin.auth().getUser(userId);
      console.log('usuario con id ' + userId + ' encontrado con éxito');

      avatarUrl = firestoreUser.photoURL;
      if (firestoreUser.email !== userData.email) {
        const errorMessage =
          'El usuario con id ' +
          userId +
          ' ya existía, pero el email es distinto al informado (' +
          firestoreUser.email +
          ' != ' +
          userData.email +
          ')';
        console.error(errorMessage);

        throw new CustomError.TechnicalError(
          CREATE_USER_INVALID_EMAIL_OR_ID_ERROR_CODE,
          null,
          errorMessage,
          null
        );
      }
    } catch (e) {
      if (e.code === CREATE_USER_INVALID_EMAIL_OR_ID_ERROR_CODE) {
        throw e;
      }

      console.log('El usuario con id ' + userId + ' no existia, se procede a crearlo');
      // si no existe intento crearlo
      const creationResult = await admin.auth().createUser({
        uid: userId,
        displayName: userData.firstName + ' ' + userData.lastName,

        password: NEW_USERS_TEMP_PASSWORD,
        email: userData.email,
      });

      avatarUrl = creationResult.photoURL;

      console.log('Usuario creado con éxito ' + userId);
    }
  } else {
    try {
      console.log('Se busca usuario con email ' + userData.email);
      const firestoreUser = await admin.auth().getUserByEmail(userData.email);
      console.log(
        'El usuario con el email ' +
          userData.email +
          ' ya existía, se utiliza este id ' +
          firestoreUser.uid
      );

      userId = firestoreUser.uid;
      avatarUrl = firestoreUser.photoURL;
    } catch (e) {
      console.log(
        'El usuario con mail: ' +
          userData.email +
          ' no existia, se procede a crearlo y se autogenera un uid'
      );

      const firestoreUser = await admin.auth().createUser({
        displayName: userData.firstName + ' ' + userData.lastName,

        password: password || NEW_USERS_TEMP_PASSWORD,
        email: userData.email,
      });

      console.log('Se generó el usuario:' + firestoreUser.uid);
      userId = firestoreUser.uid;
      avatarUrl = firestoreUser.photoURL;
    }
  }

  const newUserData = {
    ...userData,
    avatarUrl: avatarUrl ? avatarUrl : null,
    appUserStatus,
    state: Types.StateTypes.STATE_ACTIVE,
    id: userId,

    ...creationStruct(auditUid),
    ...updateStruct(auditUid),
  };

  const db = admin.firestore();

  await db.collection(Collections.USERS).doc(userId).set(newUserData);

  console.log('Entity created OK');
  return newUserData;
};

export { createUser };
