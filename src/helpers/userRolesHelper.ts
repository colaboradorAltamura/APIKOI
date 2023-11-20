import * as Admin from 'firebase-admin';

// TODO - refactor de las primitivas a una clase externa

import { Collections } from '../types/collectionsTypes';
import { buildCompanyEmployeesSchemaWithFields } from '../vs-core/helpers/schemas';

export interface FirestoreBigQueryEventHistoryTrackerConfig {
  datasetId: string;
  tableId: string;
  datasetLocation?: string | undefined;
  transformFunction?: string | undefined;
  timePartitioning?: string | undefined;
  timePartitioningField?: string | undefined;
  timePartitioningFieldType?: string | undefined;
  timePartitioningFirestoreField?: string | undefined;
  clustering: string[] | null;
  wildcardIds?: boolean;
  bqProjectId?: string | undefined;
  backupTableId?: string | undefined;
  useNewSnapshotQuerySyntax?: boolean;
}

export class UserRolesHelper {
  // constructor() {}

  static async setUserClaims({
    userId,
    appRols,
    orgRols,
    userDefinedRols,
    enterpriseRols,
    appUserStatus,
  }) {
    if (!enterpriseRols) enterpriseRols = [];
    await Admin.auth().setCustomUserClaims(userId, {
      appRols,
      orgRols,
      userDefinedRols,
      enterpriseRols,
      appUserStatus,
    });
  }

  static fetchUserEnterpriseRols = async ({ organizationId, userId }) => {
    try {
      if (!organizationId || !userId) throw new Error('Missing organization id / user Id');

      const companyEmployeesSchema = buildCompanyEmployeesSchemaWithFields(organizationId);

      const db = Admin.firestore();
      const querySnapshot = await db
        .collection(companyEmployeesSchema.collectionName)
        // .where('organizationId', '==', organizationId) // es una collection dedicada a esta org, no hace falta este filtro
        .where('userId', '==', userId)

        .get();

      // console.log('Query enterpriseRols: ', {
      //   collectionName: companyEmployeesSchema.collectionName,
      //   organizationId,
      //   userId,
      //   result: querySnapshot.docs,
      // });

      if (!querySnapshot.docs || !querySnapshot.docs.length) return [];
      const items = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();

        if (data.createdAt) data.createdAt = data.createdAt.toDate();
        if (data.updatedAt) data.updatedAt = data.updatedAt.toDate();

        return { ...data, id };
      });

      return items;
    } catch (e) {
      console.error(
        'Error fetch org user rols with args: ' +
          JSON.stringify({ organizationId, userId } + '. ' + e.message)
      );

      throw e;
    }
  };

  static fetchUserOrgRols: any = async ({ organizationId, userId }) => {
    try {
      if (!organizationId || !userId) throw new Error('Missing organization id / user Id');

      const db = Admin.firestore();
      const querySnapshot = await db
        .collection(Collections.ORGANIZATION_USERS)
        .where('organizationId', '==', organizationId)
        .where('userId', '==', userId)
        .get();

      if (!querySnapshot.docs || !querySnapshot.docs.length) return [];
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

      return items;
    } catch (e) {
      console.error(
        'Error fetch org user rols with args: ' +
          JSON.stringify({ organizationId, userId } + '. ' + e.message)
      );

      throw e;
    }
  };

  static fetchUserRols: any = async ({ organizationId, userId }) => {
    try {
      if (!organizationId || !userId) throw new Error('Missing organization id / user Id');

      const db = Admin.firestore();
      const querySnapshot = await db
        .collection(Collections.USERS_ROLS)
        .where('organizationId', '==', organizationId)
        .where('userId', '==', userId)
        .get();

      if (!querySnapshot.docs || !querySnapshot.docs.length) return [];
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

      return items;
    } catch (e) {
      console.error(
        'Error fetch user defined rols with args: ' +
          JSON.stringify({ organizationId, userId } + '. ' + e.message)
      );

      throw e;
    }
  };
}
