/* eslint-disable id-length */
import * as _ from 'lodash';
import { IEntitySchemaField } from '../vs-core/types/schemas';
import { DynamicComponentTypes } from '../vs-core/types/dynamics';
import { v4 as uuidv4 } from 'uuid';

const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const monthLongNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dayOfWeekShortNames = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

exports.areEqualStringLists = function (list1, list2) {
  let areEqual = true;
  list1.forEach((element: any) => {
    if (
      !list2.find((l2) => {
        return l2 === element;
      })
    ) {
      areEqual = false;
      return;
    }
  });

  return areEqual;
};

const DOCUMENT_COMPARE_EXCLUDE_KEYS = ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'];

exports.DOCUMENT_COMPARE_EXCLUDE_KEYS = DOCUMENT_COMPARE_EXCLUDE_KEYS;

const areDeepEqualArrays = function (array1, array2) {
  if (!array1 && !array2) return true;
  if (!array1 && array2) return false;
  if (array1 && !array2) return false;

  // TODO - Tiene sentido tmb recibir un array de keys a exluir ?
  return !_.isEqual(array1, array2);
};

exports.areDeepEqualArrays = areDeepEqualArrays;

const areDeepEqual = function (element1, element2, exludeKeys) {
  if (!element1 && !element2) return true;
  if (!element1 && element2) return false;
  if (element1 && !element2) return false;

  if (Array.isArray(element1) && Array.isArray(element2)) {
    return areDeepEqualArrays(element1, element2);
  }

  let element1Keys = Object.keys(element1);
  let element2Keys = Object.keys(element2);

  if (exludeKeys) {
    element1Keys = element1Keys.filter((key) => {
      return !exludeKeys.includes(key);
    });

    element2Keys = element2Keys.filter((key) => {
      return !exludeKeys.includes(key);
    });
  }

  if (!_.isEqual(element1Keys, element2Keys)) return false;

  let areEqual = true;
  element1Keys.forEach((key) => {
    if (!_.isEqual(element1[key], element2[key])) areEqual = false;
  });

  return areEqual;
};

exports.areDeepEqual = areDeepEqual;

const deg2rad = (deg: any) => {
  return deg * (Math.PI / 180);
};

// Hash the API key
function hashValue(value) {
  const { createHash } = require('crypto');

  const hash = createHash('sha256').update(value).digest('hex');

  return hash;
}

export const generateAPIKey = () => {
  const apiKey = uuidv4();
  const hashedAPIKey = hashValue(apiKey);

  return { hashedAPIKey, apiKey };
};

export const areDeepEqualDocuments = function (document1, document2) {
  return areDeepEqual(document1, document2, DOCUMENT_COMPARE_EXCLUDE_KEYS);
};

export const toDateObject = (dirtyDate: any) => {
  if (!dirtyDate) return null;

  if (dirtyDate instanceof Date) return dirtyDate;

  if (dirtyDate._seconds) return new Date(dirtyDate._seconds * 1000);
  else if (typeof dirtyDate === 'string') return new Date(dirtyDate);

  return null;
};

export const dateToShortString = function (date: any) {
  if (!date) return '';

  return date.toLocaleDateString('en-GB');
};

export const parseDateToShortString = function (date: any) {
  const dateObj = toDateObject(date);

  if (!dateObj) return '';

  return dateToShortString(dateObj);
};

export const parseDateToDateTimeString = function (date: any) {
  const dateObj = toDateObject(date);

  if (!dateObj) return '';

  const dateString = dateToShortString(dateObj);

  return `${dateString} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export const getDayOfWeekShortName = function (date: any) {
  return dayOfWeekShortNames[date.getUTCDay()];
};

export const getMonthShortName = function (date: any) {
  return monthShortNames[date.getUTCMonth()];
};

export const getMonthLongName = function (date: any) {
  return monthLongNames[date.getUTCMonth()];
};

export const enumValuesToArray = (enumType) => {
  return Object.keys(enumType).filter((item) => {
    return isNaN(Number(item));
  });
};

export const getDistanceFromLatLonInKm = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
};

export const processSchemaFieldItem = (item: any, schemaFields: IEntitySchemaField[]) => {
  if (!item) return item;

  schemaFields.forEach((field) => {
    if (field.fieldType === DynamicComponentTypes.FORM_DATE && item[field.name]) {
      if (!item[field.name].toDate) {
        item[field.name] = ''; // contemplo cambio de tipo de dato, si ahora es date y no tiene la fn entonces no lo devuelvo
      } else {
        item[field.name] = item[field.name].toDate();
      }
    }
  });
};

export const processSchemaFieldItems = (items: any[], schemaFields: IEntitySchemaField[]) => {
  if (items) {
    items.forEach((item) => {
      exports.processSchemaFieldItem(item, schemaFields);
    });
  }
};

export function valueOrDefaut(val: any): any {
  if (typeof val === 'undefined') {
    return null;
  }

  return val;
}

/*
import { nameof } from "./some-relative-import";
interface SomeInterface {
   someProperty: number;
 }
// with types
 console.log(nameof<SomeInterface>("someProperty")); // "someProperty"
// with values
const myVar: SomeInterface = { someProperty: 5 };
console.log(nameof(myVar, "someProperty")); // "someProperty"
*/
export function nameof<TObject>(obj: TObject, key: keyof TObject): string;
export function nameof<TObject>(key: keyof TObject): string;
export function nameof(key1: any, key2?: any): any {
  return key2 ?? key1;
}

export const MULTIPLE_RELATIONSHIP_SUFFIX = '_SOURCE_ENTITIES';
export const RELATIONSHIPS_PROP_NAME = '@dependencies';

// eg: obj: { userId: 'bla', otherProps: '', userId_SOURCE_ENTITIES: [{ id: 'bla' } ]}, key: 'userId'
export const getSourceEntityData = function ({ obj, key }: any) {
  if (!obj) return null;

  const objPropValue = obj[key];

  if (!objPropValue) return null;

  const objPropList = obj[RELATIONSHIPS_PROP_NAME]
    ? obj[RELATIONSHIPS_PROP_NAME][key + MULTIPLE_RELATIONSHIP_SUFFIX]
    : null;

  if (!objPropList) return null;

  if (Array.isArray(objPropValue)) {
    return objPropList.filter((item: any) => {
      return objPropValue.find((item2) => {
        return item2 === item.id;
      });
    });
  }
  return objPropList.find((item: any) => {
    return item.id === objPropValue;
  });
};
