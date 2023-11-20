/* eslint-disable no-console */
const admin = require('firebase-admin');

const { ErrorHelper } = require('../../vs-core-firebase');
const { UserRolesHelper } = require('../../helpers/userRolesHelper');
const { SYS_ADMIN_EMAIL } = require('../../config/appConfig');
const { createFirestoreDocument } = require('../../vs-core-firebase/helpers/firestoreHelper');
const { Collections } = require('../../types/collectionsTypes');
const { AppRols, UserStatusTypes } = require('../../vs-core/types');
const { generateAPIKey } = require('../../helpers/coreHelper');

exports.showEnv = async function (req, res) {
  try {
    return res.status(201).send({ env: process.env });
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.setUserClaimsByReq = async function (req, res) {
  try {
    const { userId, appRols, enterpriseRols, appUserStatus } = req.body;

    let user = null;

    if (!userId) {
      return res.status(400).send({ message: 'Missing fields' });
    }

    await UserRolesHelper.setUserClaims({ userId, appRols, enterpriseRols, appUserStatus });

    if (!user) user = await admin.auth().getUser(userId);

    return res.status(204).send({ user });
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.setUserProps = async function (req, res) {
  try {
    const { uid, password, displayName, email } = req.body;
    await admin.auth().updateUser(uid, {
      displayName,

      password,
      email,
    });

    return res.status(200).send();
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.switchMagic = async function (req, res) {
  try {
    const db = admin.firestore();

    const PARAMS_COLLECTION = 'params';

    const doc = await db.collection(PARAMS_COLLECTION).doc('magic').get();

    if (!doc.exists) {
      await db.collection(PARAMS_COLLECTION).doc('magic').set({ value: true });
    } else {
      const actualValue = { ...doc.data() };

      await db.collection(PARAMS_COLLECTION).doc('magic').update({ value: !actualValue.value });
    }

    return res.status(200).send();
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.createSysAdmin = async function (req, res) {
  try {
    const uId = 'sys-admin';

    console.log('Creating sys admin user (' + SYS_ADMIN_EMAIL + ')');

    let user = null;
    try {
      user = await admin.auth().getUserByEmail(SYS_ADMIN_EMAIL);
    } catch (e) {
      console.log('User not found, proceed');
    }

    if (user) {
      throw new Error('Duplicated user');
    }

    const newUserdata = await admin.auth().createUser({
      uid: uId,
      displayName: uId,

      email: SYS_ADMIN_EMAIL,
    });

    console.log('Firebase Auth User created ok');

    await createFirestoreDocument({
      collectionName: Collections.USERS,
      itemData: { email: SYS_ADMIN_EMAIL },
      auditUid: uId,
      id: uId,
    });

    console.log('Firestore User created ok');
    await UserRolesHelper.setUserClaims({
      userId: uId,
      appRols: [AppRols.APP_ADMIN],
      orgRols: [],
      userDefinedRols: [],
      enterpriseRols: [],
      appUserStatus: UserStatusTypes.USER_STATUS_TYPE_ACTIVE,
    });

    console.log('Return ');
    return res.status(200).send(newUserdata);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.createUserCustomToken = async function (req, res) {
  try {
    const userId = req.body.userId;

    console.log('Creating sys admin user (' + userId + ')');

    const customToken = await admin.auth().createCustomToken(userId, { customToken: true });

    console.log('Returning custom token OK');

    return res.status(200).send(customToken);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.createApiKey = async function (req, res) {
  try {
    const {
      apiKey,
      // hashedAPIKey
    } = generateAPIKey();

    return res.status(200).send(apiKey);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};
