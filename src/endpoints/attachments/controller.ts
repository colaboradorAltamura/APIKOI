/* eslint-disable no-unused-vars */

import { ErrorHelper } from '../../vs-core-firebase';

const { Collections } = require('../../types/collectionsTypes');

const stream = require('stream');

const schemas = require('./schemas');

const { find, get, patch, remove } = require('../../vs-core-firebase/helpers/firestoreHelper');

const COLLECTION_NAME = Collections.ATTACHMENTS;

const { fileToDownloadUrl } = require('../../helpers/storageHelper');

exports.find = async function (req, res) {
  await find(req, res, COLLECTION_NAME);
};

exports.get = async function (req, res) {
  await get(req, res, COLLECTION_NAME);
};

exports.patch = async function (req, res) {
  const { userId } = res.locals;
  const auditUid = userId;

  await patch(req, res, auditUid, COLLECTION_NAME, schemas.update);
};

exports.remove = async function (req, res) {
  await remove(req, res, COLLECTION_NAME);
};

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  // const { data } = await google.drive({ version: 'v3' }).files.create({
  //   media: {
  //     mimeType: fileObject.mimeType,
  //     body: bufferStream,
  //   },
  //   requestBody: {
  //     name: fileObject.originalname,
  //     parents: ['DRIVE_FOLDER_ID'],
  //   },
  //   fields: 'id,name',
  // });
  // console.log(`Uploaded file ${data.name} ${data.id}`);
};

exports.create = async function (req, res) {
  try {
    const { body, files } = req;

    console.log('Files:', files);
    for (let ff = 0; ff < files.length; ff += 1) {
      await uploadFile(files[ff]);
    }

    console.log(body);
    res.status(200).send('Form Submitted');
  } catch (e) {
    res.send(e.message);
  }

  // await create(req, res, auditUid, COLLECTION_NAME, schemas.create);
};

exports.fileToDownloadUrl = async (req, res) => {
  try {
    const { refPath } = req.body;

    const downloadUrlArray = await fileToDownloadUrl({ filePath: refPath });

    res.status(200).send(downloadUrlArray);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
};
