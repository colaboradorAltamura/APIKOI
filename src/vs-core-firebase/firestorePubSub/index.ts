import { DocumentSnapshot } from 'firebase-functions/lib/v1/providers/firestore';
import { Change } from 'firebase-functions';

export enum ChangeType {
  CREATE,
  DELETE,
  UPDATE,
  IMPORT,
}

export function getChangeType(change: Change<DocumentSnapshot>): ChangeType {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
}

export function getDocumentId(change: Change<DocumentSnapshot>): string {
  if (change.after.exists) {
    return change.after.id;
  }
  return change.before.id;
}
