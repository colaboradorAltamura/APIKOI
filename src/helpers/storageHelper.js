import { FIREB_STORAGE_BUCKET } from '../config/appConfig';

const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { getStorage } = require('firebase-admin/storage');

const cwd = path.join(__dirname, '..');

exports.fileToPath = async function ({
  bucketName = FIREB_STORAGE_BUCKET,
  sourceFileName,
  destFileRelativePath,
}) {
  const destFilePath = path.join(cwd, destFileRelativePath);

  // Creates a client
  const storage = new Storage();

  const options = {
    destination: destFilePath,
  };

  // Downloads the file
  await storage.bucket(bucketName).file(sourceFileName).download(options);

  //   const myBucket = storage.bucket(bucketName);
  //   const file = myBucket.file(fileName);
  //   const content = await file.download();

  // return content;

  // console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`);
};

exports.downlaodImage = async function ({ bucketName = FIREB_STORAGE_BUCKET, storageFilePath }) {
  // Creates a client
  const storage = new Storage();

  // Downloads the file
  await storage.bucket(bucketName).file(storageFilePath).download();
};

exports.uploadFile = async function ({
  bucketName = FIREB_STORAGE_BUCKET,
  destination,
  buffer,
  isPublic,
}) {
  // Creates a client
  const storage = new Storage();

  // Downloads the file
  const bucketFile = storage.bucket(bucketName).file(destination);

  await bucketFile.save(buffer);
  if (isPublic) await bucketFile.makePublic();

  const publicUrl = bucketFile.publicUrl();
  return { isPublic, url: publicUrl, storage: { bucketName, destination } };
};

exports.fileToDownloadUrl = async function ({ filePath }) {
  // Creates a client

  const date = new Date(Date.now());

  // add a day
  date.setDate(date.getDate() + 1);

  const bucket = getStorage().bucket();

  console.log('Returning: ' + filePath);

  return await bucket.file(filePath).getSignedUrl({ action: 'read', expires: date });
  // Downloads the file
  // return await storage
  //   .bucket(bucketName)
  //   .file(filePath)
  //   .getSignedUrl({ action: 'read', expires: date });
};
