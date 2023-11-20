const admin = require('firebase-admin');
const { CustomError } = require('../../vs-core');

type Relationship = {
  collectionName: string;
  propertyName: string;
};
type IndexedCompoundFilter = {
  field: string;
  operator: string;
};

type FetchItemsType = {
  collectionName: string;
  limit: number;
  filters: any;
  indexedFilters: string[];
  indexedCompoundFilters: IndexedCompoundFilter[];
  offset: number;
};

type ListWithRelationshipsType = {
  limit: string;
  offset: string;
  filters: any;
  listByCollectionName: string;
  indexedFilters: string[];
  indexedCompoundFilters: IndexedCompoundFilter[];
  relationships: Relationship[];
  postProcessor?;
};

type BuildQuerySnapshotType = {
  ref: any;
  filters: any;
  indexedFilters: string[];
  indexedCompoundFilters: IndexedCompoundFilter[];
};

type FillItemsWithRelationshipsProps = {
  items: any;
  relationships: Relationship[];
};

const MULTIPLE_RELATIONSHIP_SUFFIX = '_SOURCE_ENTITIES';
const RELATIONSHIPS_PROP_NAME = '@dependencies';
const mapTofirestoreFilter = (key: string, value: string): number | string | Date => {
  if (key === 'state') return parseInt(value); // fix michel por state
  if (typeof value === 'string' && new Date(value).toString() !== 'Invalid Date') {
    return new Date(value);
  }

  return value;
};

const buildQuerySnapshot = ({
  ref,
  filters,
  indexedFilters,
  indexedCompoundFilters,
}: BuildQuerySnapshotType) => {
  let querySnapshot = ref;

  indexedCompoundFilters.forEach((sentence: IndexedCompoundFilter) => {
    const { field: key, operator } = sentence;
    const filter = filters[key];
    if (!filter || !filter[operator]) {
      console.log(`IS OUT: ${key} - ${indexedFilters}`);
      return;
    }

    let filterValue: string | string[] | number | Date;
    switch (operator) {
      case '$in':
        filterValue = filter.$in.split(',');
        console.log('Filter in: ', key, filterValue);
        querySnapshot = querySnapshot.where(key, 'in', filterValue);
        break;
      case '$equal':
        filterValue = mapTofirestoreFilter(key, filter.$equal);
        console.log('Filter equal: ', key, filterValue);
        querySnapshot = querySnapshot.where(key, '==', filterValue);
        break;
      case '$nequal':
        filterValue = mapTofirestoreFilter(key, filter.$nequal);
        console.log('Filter nequal: ', key, filterValue);
        querySnapshot = querySnapshot.where(key, '!=', filterValue);
        break;
      case '$contains':
        console.log('Filter contains: ', key, filter.$contains);
        querySnapshot = querySnapshot
          .where(key, '>=', filter.$contains)
          .where(key, '<=', filter.$contains + '\uf8ff');
        break;
      case '$arraycontains':
        filterValue = mapTofirestoreFilter(key, filter.$arraycontains);
        console.log('Filter arraycontains: ', key, filter.$arraycontains, filterValue);
        querySnapshot = querySnapshot.where(key, 'array-contains', filterValue);
        break;
      case '$gte':
        filterValue = mapTofirestoreFilter(key, filter.$gte);
        console.log('Filter gte: ', key, filterValue);
        querySnapshot = querySnapshot.where(key, '>=', filterValue);
        break;
    }
  });

  return querySnapshot;
};

const fetchItems = async ({
  collectionName,
  limit = 500,
  filters,
  indexedFilters,
  indexedCompoundFilters,
  offset = 0,
}: FetchItemsType) => {
  try {
    const db = admin.firestore();
    const ref = db.collection(collectionName);

    let querySnapshot = buildQuerySnapshot({
      ref,
      filters,
      indexedFilters,
      indexedCompoundFilters,
    });

    let totalCount;
    if (offset == 0) {
      totalCount = await querySnapshot.count().get();
      totalCount = totalCount.data().count;
    }

    querySnapshot = querySnapshot.offset(offset);
    querySnapshot = querySnapshot.limit(limit);

    console.log(
      'Find with Filters (' + collectionName + '): ' + JSON.stringify({ filters, indexedFilters })
    );

    querySnapshot = await querySnapshot.get();
    if (!querySnapshot.docs) return { items: [], count: 0 };

    const items = querySnapshot.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();

      if (data.createdAt) data.createdAt = data.createdAt.toDate();
      if (data.updatedAt) data.updatedAt = data.updatedAt.toDate();

      return { ...data, id };
    });

    items.sort((aa: { createdAt: number }, bb: { createdAt: number }) => {
      return bb.createdAt - aa.createdAt;
    });

    return { items, count: totalCount };
  } catch (err) {
    throw new CustomError.TechnicalError('ERROR_FETCH', null, err.message, err);
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

const fillItemsWithRelationships = async ({
  items,
  relationships,
}: FillItemsWithRelationshipsProps) => {
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

      const newRelPromise = new Promise<void>((resolve, reject) => {
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
              if (!filteredItem[RELATIONSHIPS_PROP_NAME]) {
                filteredItem[RELATIONSHIPS_PROP_NAME] = {};
              }

              filteredItem[RELATIONSHIPS_PROP_NAME][
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

                  filteredItem[RELATIONSHIPS_PROP_NAME][
                    rel.propertyName + MULTIPLE_RELATIONSHIP_SUFFIX
                  ].push(targetItem);
                });
              } else {
                const targetItem = targetItems.find((element) => {
                  return element.id === filteredItem[rel.propertyName];
                });

                if (!targetItem) continue;

                items[index][RELATIONSHIPS_PROP_NAME][
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

export const listWithRelationshipsV2 = async ({
  limit,
  offset,
  filters,
  listByCollectionName,
  indexedFilters,
  indexedCompoundFilters,
  relationships,
  postProcessor,
}: ListWithRelationshipsType) => {
  if (!filters) filters = {};
  const pageSize = parseInt(limit);

  console.log('listWithRelationships (' + listByCollectionName + ') with filters:', filters);

  const itemsData = await fetchItems({
    collectionName: listByCollectionName,
    filters,
    indexedFilters,
    indexedCompoundFilters,
    limit: pageSize,
    offset: parseInt(offset),
  });

  console.log('OK - all - fetch (' + listByCollectionName + '): ' + itemsData.items.length);

  if (itemsData.items && itemsData.items.length) {
    // obtengo las relaciones
    itemsData.items = await fillItemsWithRelationships({
      items: itemsData.items,
      relationships,
    });
  }

  let result = {
    items: itemsData.items,
    hasMore: itemsData.items.length == pageSize,
    total: itemsData.count,
    pageSize,
  };
  if (postProcessor) result = await postProcessor(result);

  return result;
};
