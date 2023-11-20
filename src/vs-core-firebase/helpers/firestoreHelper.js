/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const admin = require('firebase-admin');

const Fuse = require('fuse.js');

const { creationStruct, updateStruct } = require('../audit');
const { ErrorHelper } = require('../index');

const { Types } = require('../../vs-core');

const { CustomError } = require('../../vs-core');

const _ = require('lodash');
const { URL } = require('url');

exports.secureDataArgsValidation = ({ secureArgs, data }) => {
  if (!secureArgs) return;

  Object.keys(secureArgs).forEach((key) => {
    if (data[key] !== secureArgs[key]) {
      throw new CustomError.TechnicalError(
        'SECURITY_ERROR_DATA_MISSMATCH',
        null,
        'Security error data missmatch (' + key + ' > ' + data[key] + ' > ' + secureArgs[key] + ')',
        null
      );
    }
  });
};

exports.secureArgsValidation = async ({ collectionName, id, secureArgs }) => {
  if (!secureArgs) return;

  const existentItem = await fetchSingleItem({ collectionName, id });

  exports.secureDataArgsValidation({ secureArgs, data: existentItem });
};

const mapTofirestoreFilter = (key, value) => {
  if (key === 'state') return parseInt(value); // fix michel por state
  // if (value === '0' || value === '1') return value; // fix michel por state

  if (typeof value === 'string' && new Date(value) !== 'Invalid Date' && !isNaN(new Date(value))) {
    return new Date(value);
  }

  return value;
};

const buildQuerySnapshot = ({ ref, filters, filterState, indexedFilters }) => {
  let querySnapshot = ref;

  if (typeof filterState !== 'undefined' && filterState !== null) {
    querySnapshot = querySnapshot.where('state', '==', filterState);
  }
  // querySnapshot = querySnapshot.orderBy('createdAt', 'asc');

  // console.log('COLLECTION:' + collectionName, indexedFilters, filters);

  if (filters && indexedFilters && indexedFilters.length) {
    const filtersKeys = Object.keys(filters);

    filtersKeys.forEach((key) => {
      if (!indexedFilters.includes(key)) return;

      if (filters[key].$equal) {
        console.log('');
        const filterValue = mapTofirestoreFilter(key, filters[key].$equal);

        console.log('Filter equal: ', key, filterValue);

        querySnapshot = querySnapshot.where(key, '==', filterValue);
      }

      if (filters[key].$nequal) {
        const filterValue = mapTofirestoreFilter(key, filters[key].$nequal);

        querySnapshot = querySnapshot.where(key, '!=', filterValue);
      }

      if (filters[key].$contains) {
        // lo dejo pasar pq no existe contains en filtro de indice de firestore
      }

      if (filters[key].$arraycontains) {
        const filterValue = mapTofirestoreFilter(key, filters[key].$arraycontains);

        console.log('Paso 3', key, filters[key].$arraycontains, filterValue);
        querySnapshot = querySnapshot.where(key, 'array-contains', filterValue);
      }

      if (filters[key].$in) {
        const filterValue = filters[key].$in.split(',');

        // if (filterValue.length === 1) filterValue = filterValue[0];

        console.log('Paso 4', key, filters[key].$in, filterValue);
        querySnapshot = querySnapshot.where(key, 'in', filterValue);
      }

      if (filters[key].$gte) {
        const filterValue = mapTofirestoreFilter(key, filters[key].$gte);

        console.log('Filter gte: ', key, filterValue);

        querySnapshot = querySnapshot.where(key, '>=', filterValue);
      }
    });
  }

  return querySnapshot;
};

// equal: Equals
// nequal: Not equals
// lt: Lower than
// gt: Greater than
// lte: Lower than or equal to
// gte: Greater than or equal to
// in: Included in an array of values
// nin: Isn't included in an array of values
// contains: Contains
// ncontains: Doesn't contain
// containss: Contains case sensitive
// ncontainss: Doesn't contain case sensitive
const countItems = async function ({
  collectionName,

  filterState,
  filters,
  indexedFilters,
}) {
  try {
    const db = admin.firestore();
    const ref = db.collection(collectionName);

    console.log(
      'Count with Filters (' + collectionName + '): ' + JSON.stringify({ filters, indexedFilters })
    );

    let querySnapshot = buildQuerySnapshot({ ref, filters, filterState, indexedFilters });

    querySnapshot = await querySnapshot.get();

    return querySnapshot.size;
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH', null, err.message, err);
  }
};

// equal: Equals
// nequal: Not equals
// lt: Lower than
// gt: Greater than
// lte: Lower than or equal to
// gte: Greater than or equal to
// in: Included in an array of values
// nin: Isn't included in an array of values
// contains: Contains
// ncontains: Doesn't contain
// containss: Contains case sensitive
// ncontainss: Doesn't contain case sensitive
const fetchItems = async function ({
  collectionName,
  limit = 500,
  filterState,
  filters,
  indexedFilters,
}) {
  try {
    const db = admin.firestore();
    const ref = db.collection(collectionName);

    console.log(
      'Find with Filters (' +
        collectionName +
        '): ' +
        JSON.stringify({ filters, indexedFilters }, filterState)
    );

    let querySnapshot = buildQuerySnapshot({
      ref: ref.limit(limit),
      filters,
      filterState,
      indexedFilters,
    });

    querySnapshot = await querySnapshot.get();
    if (!querySnapshot.docs) return [];
    // let querySnapshot = null;
    // if (typeof filterState !== 'undefined' && filterState !== null)
    //   querySnapshot = await ref
    //     .where('state', '==', filterState)
    //     .limit(limit)
    //     .orderBy('createdAt', 'asc')
    //     .get();
    // else querySnapshot = await ref.limit(limit).orderBy('createdAt', 'asc').get();

    const items = querySnapshot.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();

      if (data.createdAt) data.createdAt = data.createdAt.toDate();
      if (data.updatedAt) data.updatedAt = data.updatedAt.toDate();

      return { ...data, id };
    });

    items.sort((aa, bb) => {
      return bb.createdAt - aa.createdAt;
    });

    return items;
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH', null, err.message, err);
  }
};

const fetchSingleItem = async function ({ collectionName, id }) {
  try {
    const db = admin.firestore();
    const doc = await db.collection(collectionName).doc(id).get();

    if (!doc.exists) return null;

    const item = { ...doc.data(), id };

    if (item.createdAt) item.createdAt = item.createdAt.toDate();
    if (item.updatedAt) item.updatedAt = item.updatedAt.toDate();

    return item;
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH_SINGLE', null, err.message, err);
  }
};

const updateSingleItem = async function ({ collectionName, id, auditUid, itemData, secureArgs }) {
  await exports.secureArgsValidation({ collectionName, id, secureArgs });

  try {
    const updates = { ...itemData, ...updateStruct(auditUid) };

    const db = admin.firestore();

    // Update document.
    const updatedDoc = await db.collection(collectionName).doc(id).update(updates);

    return updatedDoc;
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_UPDATE_SINGLE', null, err.message, err);
  }
};

const deleteSingleItem = async function ({ collectionName, id }) {
  try {
    const db = admin.firestore();

    // delete document.
    await db.collection(collectionName).doc(id).delete();
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_DELETE_SINGLE', null, err.message, err);
  }
};

exports.deleteLogicalSingleItem = async function ({ collectionName, id, auditUid }) {
  try {
    const db = admin.firestore();

    const data = {
      state: Types.StateTypes.STATE_INACTIVE,
    };
    const updates = { ...data, ...updateStruct(auditUid) };

    // Update document.
    await db.collection(collectionName).doc(id).update(updates);
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_DELETE_LOGICAL_SINGLE', null, err.message, err);
  }
};

const fetchItemsByIds = async function ({ collectionName, ids }) {
  try {
    const db = admin.firestore();

    const refs = [];
    for (const item of ids) {
      const ref = admin.firestore().collection(collectionName).doc(item);

      refs.push(ref);
    }
    // then use getAll
    const snapshots = await db.getAll(...refs);

    const items = [];

    snapshots.forEach((snapshot) => {
      const id = snapshot.id;
      const data = snapshot.data();

      if (data) {
        if (data.createdAt) data.createdAt = data.createdAt.toDate();
        if (data.updatedAt) data.updatedAt = data.updatedAt.toDate();
        if (data.birthDate) data.birthDate = data.birthDate.toDate();

        items.push({ ...data, id });
      }
    });

    return items;
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH', null, err.message, err);
  }
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
// equal: Equals
// nequal: Not equals
// lt: Lower than
// gt: Greater than
// lte: Lower than or equal to
// gte: Greater than or equal to
// in: Included in an array of values
// nin: Isn't included in an array of values
// contains: Contains
// ncontains: Doesn't contain
// containss: Contains case sensitive
// ncontainss: Doesn't contain case sensitive

const filterItems = function ({ items, limit = 100, offset = 0, filters, indexedFilters }) {
  if (!items || items.length === 0) return { items: [], hasMore: false, total: 0, pageSize: limit };

  offset = parseInt(offset);

  let filteredItems = items;

  const orItems = [];

  let withOr = false;
  // key, value, operator

  if (filters) {
    let filtersKeys = Object.keys(filters);

    if (indexedFilters) {
      filtersKeys = filtersKeys.filter((key) => {
        return !indexedFilters.find((item) => {
          return item === key;
        });
      });
    }

    filtersKeys.forEach((key) => {
      if (filters[key].$contains) {
        const fuse = new Fuse(filteredItems, {
          threshold: 0.3,
          // minMatchCharLength: 2,
          keys: [key],
        });

        const auxFilteredItems = fuse.search(filters[key].$contains);

        filteredItems = auxFilteredItems.map((element) => {
          return element.item;
        });
      }

      if (filters[key].$equal) {
        filteredItems = filteredItems.filter((element) => {
          return element[key] === filters[key].$equal;
        });
      }

      if (filters[key].$in) {
        // Si no es array lo normalizo a array
        if (!Array.isArray(filters[key].$in)) {
          filters[key].$in = [filters[key].$in];
        }

        filteredItems = filteredItems.filter((item) => {
          // console.log('item[key]:', item[key], 'filters[key].$in:', filters[key].$in);
          return (
            item[key] &&
            filters[key].$in.find((search) => {
              if (Array.isArray(item[key])) {
                return item[key].find((lpm) => {
                  return lpm === search;
                });
              }

              return search === item[key];
            })
          );
        });
      }

      if (filters[key].$or) {
        withOr = true;
        const fuse = new Fuse(filteredItems, {
          threshold: 0.3,
          minMatchCharLength: 2,
          keys: [key],
        });

        const auxFilteredItems = fuse.search(filters[key].$or);

        auxFilteredItems.forEach((element) => {
          if (
            !orItems.find((orIt) => {
              return orIt === element.item;
            })
          ) {
            orItems.push(element.item);
          }
        });
      }

      if (filters[key].$nequal) {
        filteredItems = filteredItems.filter((element) => {
          return element[key] !== filters[key].$nequal;
        });
      }
    });
  }

  if (withOr) filteredItems = orItems.filter(onlyUnique);

  const hasMore = offset + limit < filteredItems.length;

  // los que puede ver son sus totales, no todos
  const totalItems = filteredItems.length;

  filteredItems = filteredItems.slice(offset, offset + limit);

  return { items: filteredItems, hasMore, total: totalItems, pageSize: limit };
};

const sanitizeData = async function ({ data, validationSchema }) {
  const _validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true, // remove unknown keys from the validated data
  };

  const itemData = await validationSchema.validateAsync(data, _validationOptions);

  return itemData;
};

const sanitizeReqData = async function ({ req, validationSchema }) {
  const itemdata = await sanitizeData({ data: req.body, validationSchema });

  return itemdata;
};

const createFirestoreDocumentId = async function ({ collectionName }) {
  const db = admin.firestore();

  const newDoc = db.collection(collectionName).doc();
  const itemId = newDoc.id;
  return itemId;
};

const createFirestoreDocument = async function ({ collectionName, itemData, auditUid, id, state }) {
  const db = admin.firestore();

  let newDoc = null;

  if (id) {
    newDoc = db.collection(collectionName).doc(id);
  } else {
    newDoc = db.collection(collectionName).doc();
    id = newDoc.id;
  }

  const dbItemData = {
    ...itemData,
    id,

    state:
      state !== null && state !== '' && typeof state !== 'undefined'
        ? state
        : Types.StateTypes.STATE_ACTIVE,
    ...creationStruct(auditUid),
    ...updateStruct(auditUid),
  };

  await db.collection(collectionName).doc(id).set(dbItemData);

  return dbItemData;
};

const getFirebaseUsersByIds = async function (userIds) {
  try {
    const listUsers = await admin.auth().getUsers(
      userIds.map((id) => {
        return { uid: id };
      })
    );

    const users = listUsers.users.map((user) => {
      const customClaims = user.customClaims;
      const enterpriseRols =
        customClaims && customClaims.enterpriseRols ? customClaims.enterpriseRols : null;
      const appRols = customClaims && customClaims.appRols ? customClaims.appRols : null;
      const appUserStatus =
        customClaims && customClaims.appUserStatus ? customClaims.appUserStatus : null;

      // enterpriseRols[ {companyId, rols: [ENTERPRISE_SALES, ENTERPRISE_ADMIN]}]
      // appRols: decodedToken.appRols, // [APP_ADMIN]

      // Estos son leads que validaron OK el celular mediante sms token... no son users
      // if (user.providerData.length === 1 && user.providerData[0].providerId === 'phone') {
      //   return null;
      // }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        appUserStatus,
        appRols,
        enterpriseRols,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
        providerData: user.providerData,
      };
    });

    return users;
    // return users.filter((user) => {
    //   return user !== null;
    // });
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH_USERS', null, err.message, err);
  }
};

const getFirebaseUserById = async function (userId) {
  try {
    const user = await admin.auth().getUser(userId);

    const customClaims = user.customClaims;
    const enterpriseRols =
      customClaims && customClaims.enterpriseRols ? customClaims.enterpriseRols : null;
    const appRols = customClaims && customClaims.appRols ? customClaims.appRols : null;
    const appUserStatus =
      customClaims && customClaims.appUserStatus ? customClaims.appUserStatus : null;

    // enterpriseRols[ {companyId, rols: [ENTERPRISE_SALES, ENTERPRISE_ADMIN]}]
    // appRols: decodedToken.appRols, // [APP_ADMIN]

    // Estos son leads que validaron OK el celular mediante sms token... no son users
    // if (user.providerData.length === 1 && user.providerData[0].providerId === 'phone') {
    //   return null;
    // }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
      appUserStatus,
      appRols,
      enterpriseRols,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
      providerData: user.providerData,
    };

    // return users.filter((user) => {
    //   return user !== null;
    // });
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH_USER', null, err.message, err);
  }
};

const getFirebaseUserByEmail = async function (email) {
  try {
    const user = await admin.auth().getUserByEmail(email);

    const customClaims = user.customClaims;
    const enterpriseRols =
      customClaims && customClaims.enterpriseRols ? customClaims.enterpriseRols : null;
    const appRols = customClaims && customClaims.appRols ? customClaims.appRols : null;

    // enterpriseRols[ {companyId, rols: [ENTERPRISE_SALES, ENTERPRISE_ADMIN]}]
    // appRols: decodedToken.appRols, // [APP_ADMIN]

    // Estos son leads que validaron OK el celular mediante sms token... no son users
    // if (user.providerData.length === 1 && user.providerData[0].providerId === 'phone') {
    //   return null;
    // }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      appRols,
      enterpriseRols,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
      providerData: user.providerData,
    };

    // return users.filter((user) => {
    //   return user !== null;
    // });
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH_USER_BY_EMAIL', null, err.message, err);
  }
};

exports.fetchItems = fetchItems;
exports.countItems = countItems;

exports.fetchSingleItem = fetchSingleItem;
exports.updateSingleItem = updateSingleItem;
exports.deleteSingleItem = deleteSingleItem;

exports.filterItems = filterItems;
exports.sanitizeReqData = sanitizeReqData;
exports.sanitizeData = sanitizeData;
exports.createFirestoreDocument = createFirestoreDocument;
exports.createFirestoreDocumentId = createFirestoreDocumentId;
exports.fetchItemsByIds = fetchItemsByIds;

exports.getFirebaseUserById = getFirebaseUserById;
exports.getFirebaseUserByEmail = getFirebaseUserByEmail;
exports.getFirebaseUsersByIds = getFirebaseUsersByIds;

const MULTIPLE_RELATIONSHIP_SUFFIX = '_SOURCE_ENTITIES';
exports.MULTIPLE_RELATIONSHIP_SUFFIX = MULTIPLE_RELATIONSHIP_SUFFIX;
exports.RELATIONSHIPS_PROP_NAME = '@dependencies';

exports.find = async function (req, res, collectionName, indexedFilters, postProcessor) {
  try {
    // const { userId } = res.locals ? res.locals : {};
    // const auditUid = userId;

    // / movies?filters[movies]=USA&fields[]=id&fields[]=name
    let { limit, offset, filters, state } = req.query;

    if (limit) limit = parseInt(limit);

    let filterState = state;
    if (!filterState) filterState = Types.StateTypes.STATE_ACTIVE;

    // console.log({ collectionName, filterState, filters, indexedFilters });
    const items = await fetchItems({
      limit,
      collectionName,
      filterState,
      filters,
      indexedFilters,
    });

    console.log('OK - all - fetch (' + collectionName + '): ' + items.length);

    const filteredItems = filterItems({ items, limit, offset, filters, indexedFilters });

    if (filteredItems.items) {
      console.log('OK - all - filter (' + collectionName + '): ' + filteredItems.items.length);
    }

    let result = filteredItems;
    if (postProcessor) result = await postProcessor(result);
    return res.send(result);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.get = async function (req, res, collectionName, postProcessor) {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError.TechnicalError('ERROR_MISSING_ARGS', null, 'Id not recived', null);
    }

    const item = await fetchSingleItem({ collectionName, id });

    console.log('OK - get (' + collectionName + ')' + JSON.stringify(item));

    let result = item;
    if (postProcessor) result = await postProcessor(item);
    return res.send(result);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.patch = async function (req, res, auditUid, collectionName, validationSchema, secureArgs) {
  const result = await exports.patchInner({
    req,
    res,
    body: req.body,
    auditUid,
    collectionName,
    validationSchema,
    secureArgs,
  });

  return result;
};

exports.patchInner = async function ({
  req,
  res,
  body,
  auditUid,
  collectionName,
  validationSchema,
  secureArgs,
}) {
  try {
    const { id } = req.params;

    if (!id) throw new CustomError.TechnicalError('ERROR_MISSING_ARGS', null, 'Invalid args', null);

    console.log('Patch args (' + collectionName + '):', JSON.stringify(body));

    const itemData = await sanitizeData({ data: body, validationSchema });

    const doc = await updateSingleItem({
      collectionName,
      id,
      auditUid,
      itemData,
      secureArgs,
    });

    console.log('Patch data: (' + collectionName + ')', JSON.stringify(itemData));

    return res.status(204).send(doc);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.remove = async function (req, res, collectionName, secureArgs) {
  const { id } = req.params;

  await exports.secureArgsValidation({ collectionName, id, secureArgs });

  try {
    const { userId } = res.locals; // user id

    const db = admin.firestore();

    const data = {
      state: Types.StateTypes.STATE_INACTIVE,
    };
    const updates = { ...data, ...updateStruct(userId) };

    // Update document.
    const updatedDoc = await db.collection(collectionName).doc(id).update(updates);

    return res.status(204).send(updatedDoc);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.create = async function (req, res, auditUid, collectionName, validationSchema) {
  const result = await exports.createInner({
    req,
    res,
    body: req.body,
    auditUid,
    collectionName,
    validationSchema,
  });

  return result;
};

exports.createInner = async function ({
  req,
  res,
  body,
  auditUid,
  collectionName,
  validationSchema,
  documentId,
}) {
  try {
    console.log('Create args (' + collectionName + '):', JSON.stringify(body));

    const itemData = await sanitizeData({ data: body, validationSchema });

    const createArgs = { collectionName, itemData, auditUid };

    if (documentId) createArgs.id = documentId;

    const dbItemData = await createFirestoreDocument(createArgs);

    console.log('Create data: (' + collectionName + ')', dbItemData);

    return res.status(201).send(dbItemData);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.fillItemsWithRelationships = async ({ items, relationships }) => {
  if (!items || !items.length) return;

  if (relationships && relationships.length) {
    const relationshipPromises = [];
    relationships.forEach((rel) => {
      const ids = [];

      items.forEach((item) => {
        if (!item[rel.propertyName]) return;

        if (Array.isArray(item[rel.propertyName])) {
          item[rel.propertyName].forEach((subitem) => {
            ids.push(subitem);
          });
        } else ids.push(item[rel.propertyName]);
      });

      if (!ids.length) return;

      const newRelPromise = new Promise((resolve, reject) => {
        console.log(
          'Quering (FIND RELATIONSHIP) by id (' + rel.collectionName + '): ' + JSON.stringify(ids)
        );

        fetchItemsByIds({
          collectionName: rel.collectionName,
          ids,
        })
          .then((targetItems) => {
            for (let index = 0; index < items.length; index++) {
              const filteredItem = items[index];
              if (!filteredItem[exports.RELATIONSHIPS_PROP_NAME]) {
                filteredItem[exports.RELATIONSHIPS_PROP_NAME] = {};
              }

              filteredItem[exports.RELATIONSHIPS_PROP_NAME][
                rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
              ] = [];

              // si no tiene la prop sigo con el siguiente item
              if (!filteredItem[rel.propertyName]) continue;

              if (Array.isArray(filteredItem[rel.propertyName])) {
                filteredItem[rel.propertyName].forEach((subItem) => {
                  const targetItem = targetItems.find((element) => {
                    return element.id === subItem;
                  });

                  if (!targetItem) return;

                  filteredItem[exports.RELATIONSHIPS_PROP_NAME][
                    rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
                  ].push(targetItem);
                });
              } else {
                const targetItem = targetItems.find((element) => {
                  return element.id === filteredItem[rel.propertyName];
                });

                if (!targetItem) continue;

                // filteredItems.items[index] = { ...targetItem, ...filteredItem };
                items[index][exports.RELATIONSHIPS_PROP_NAME][
                  rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
                ].push(targetItem);
              }
            }

            console.log(
              'OK  (FIND RELATIONSHIP) by id (' + rel.collectionName + '): ' + JSON.stringify(ids)
            );

            return resolve();
          })
          .catch((e) => {
            console.log(
              'Error (FIND RELATIONSHIP) by id (' +
                rel.collectionName +
                '): ' +
                JSON.stringify(ids),
              e
            );
            reject(e);
          });
      });

      relationshipPromises.push(newRelPromise);
    });

    await Promise.all(relationshipPromises);
  }

  return items;
};

exports.listByProp = async function ({
  req,
  res,
  primaryEntityPropName,
  primaryEntityValue,
  primaryEntityCollectionName,
  listByCollectionName,
  indexedFilters,
  relationships,
  postProcessor,
  overridePrimaryRelationshipOperator,
}) {
  try {
    // / movies?filters[movies]=USA&fields[]=id&fields[]=name
    const { limit, offset, filters, state } = req.query;

    const result = await exports.listByPropInner({
      limit,
      offset,
      filters,
      state,

      primaryEntityPropName,
      primaryEntityValue,
      primaryEntityCollectionName,
      listByCollectionName,
      indexedFilters,
      relationships,
      postProcessor,
      overridePrimaryRelationshipOperator,
    });
    return res.send(result);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};

exports.listByPropInner = async function ({
  limit,
  offset,
  filters,

  primaryEntityPropName,
  primaryEntityValue,

  listByCollectionName,
  indexedFilters,
  relationships,
  postProcessor,
  overridePrimaryRelationshipOperator,
}) {
  if (limit) limit = parseInt(limit);

  let filtersClone = _.cloneDeep(filters);

  if (!filtersClone) filtersClone = {};
  // { staffId: { '$equal': 'oKlebI6i03FAAZHsLWzn' } }

  if (overridePrimaryRelationshipOperator) {
    filtersClone[primaryEntityPropName] = {
      [overridePrimaryRelationshipOperator]: primaryEntityValue,
    };
  } else filtersClone[primaryEntityPropName] = { $equal: primaryEntityValue };

  console.log('listByPropInner (' + listByCollectionName + ') with filters:', filtersClone);

  const items = await fetchItems({
    limit,
    collectionName: listByCollectionName,
    // filterState,
    filters: filtersClone,
    indexedFilters,
  });

  console.log('OK - all - fetch (' + listByCollectionName + '): ' + items.length);

  const filteredItems = filterItems({
    items,
    limit,
    offset,
    filters: filtersClone,
    indexedFilters,
  });

  if (filteredItems.items) {
    console.log('OK - all - filter(' + listByCollectionName + '): ' + filteredItems.items.length);
  }

  if (filteredItems.items && filteredItems.items.length) {
    // obtengo las relaciones
    filteredItems.items = await exports.fillItemsWithRelationships({
      items: filteredItems.items,
      relationships,
    });
  }

  // console.log('filteredItems:', filteredItems);
  let result = filteredItems;
  if (postProcessor) result = await postProcessor(result);
  return result;
};

exports.listWithRelationships = async function ({
  limit,
  offset,
  filters,

  listByCollectionName,
  indexedFilters,
  relationships,
  postProcessor,
}) {
  if (limit) limit = parseInt(limit);

  if (!filters) filters = {};
  // { staffId: { '$equal': 'oKlebI6i03FAAZHsLWzn' } }

  console.log('listWithRelationships (' + listByCollectionName + ') with filters:', filters);

  const items = await fetchItems({
    limit,
    collectionName: listByCollectionName,
    // filterState,
    filters,
    indexedFilters,
  });

  console.log('OK - all - fetch (' + listByCollectionName + '): ' + items.length);

  const filteredItems = filterItems({ items, limit, offset, filters, indexedFilters });

  if (filteredItems.items) {
    console.log('OK - all - filter(' + listByCollectionName + '): ' + filteredItems.items.length);
  }

  if (filteredItems.items && filteredItems.items.length) {
    // obtengo las relaciones
    filteredItems.items = await exports.fillItemsWithRelationships({
      items: filteredItems.items,
      relationships,
    });
  }

  // console.log('filteredItems:', filteredItems);
  let result = filteredItems;
  if (postProcessor) result = await postProcessor(result);
  return result;
};

exports.getWithRelationships = async function ({
  id,

  collectionName,

  relationships,
  postProcessor,
}) {
  console.log('getWithRelationships (' + collectionName + ') (' + id + ')');

  // filters.push({ key: primaryEntityPropertyName, value: primaryEntityId, operator: '$equal' });

  const item = await fetchSingleItem({
    collectionName,
    id,
    // filterState,
    // filters,
    // indexedFilters,
  });

  console.log('OK - getWithRelationships - fetch (' + collectionName + ') (' + id + ')');

  // obtengo las relaciones
  if (relationships && relationships.length) {
    const relationshipPromises = [];
    relationships.forEach((rel) => {
      const ids = [];

      if (!item[rel.propertyName]) return;

      if (Array.isArray(item[rel.propertyName])) {
        item[rel.propertyName].forEach((subitem) => {
          ids.push(subitem);
        });
      } else ids.push(item[rel.propertyName]);

      if (!ids.length) return;

      const newRelPromise = new Promise((resolve, reject) => {
        console.log(
          'Quering (GET WITH RELATIONSHIPS) by id (' +
            rel.collectionName +
            ') (' +
            id +
            '): ' +
            JSON.stringify(ids)
        );

        fetchItemsByIds({
          collectionName: rel.collectionName,
          ids,
        })
          .then((targetItems) => {
            if (!item[exports.RELATIONSHIPS_PROP_NAME]) {
              item[exports.RELATIONSHIPS_PROP_NAME] = {};
            }
            item[exports.RELATIONSHIPS_PROP_NAME][rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX] =
              [];

            // si no tiene la prop sigo con el siguiente item
            if (item[rel.propertyName]) {
              if (Array.isArray(item[rel.propertyName])) {
                item[rel.propertyName].forEach((subItem) => {
                  const targetItem = targetItems.find((element) => {
                    return element.id === subItem;
                  });

                  if (!targetItem) return;

                  item[exports.RELATIONSHIPS_PROP_NAME][
                    rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
                  ].push(targetItem);
                });
              } else {
                const targetItem = targetItems.find((element) => {
                  return element.id === item[rel.propertyName];
                });

                if (targetItem) {
                  // filteredItems.items[index] = { ...targetItem, ...filteredItem };
                  item[exports.RELATIONSHIPS_PROP_NAME][
                    rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
                  ].push(targetItem);
                }
              }
            }

            console.log(
              'OK  (GET WITH RELATIONSHIPS) by id (' +
                rel.collectionName +
                ') (' +
                id +
                '): ' +
                JSON.stringify(ids)
            );

            return resolve();
          })
          .catch((e) => {
            console.log(
              'Error (GET WITH RELATIONSHIPS) by id (' +
                rel.collectionName +
                ') (' +
                id +
                '): ' +
                JSON.stringify(ids),
              e
            );
            reject(e);
          });
      });

      relationshipPromises.push(newRelPromise);
    });

    await Promise.all(relationshipPromises);
  }

  let result = item;
  if (postProcessor) result = await postProcessor(result);
  return result;
};

exports.parseUrlParams = (req) => {
  console.log('req.url:', req.url);
  let path = new URL(`https://domain.com/${req.url}`).pathname;

  // split and remove empty element;
  path = path.split('/').filter(function (e) {
    return e.length > 0;
  });

  // remove the first component 'callmethod'
  // path = path.slice(1);

  return path;
};
