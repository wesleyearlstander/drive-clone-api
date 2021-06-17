const dotenv = require('dotenv');
const assert = require('assert');
const util = require('util');
const stream = require('stream');
const fs = require('fs');
const path = require('path');
const { MongoClient, GridFSBucket, ObjectID } = require('mongodb');

const publicFolder = `${path.dirname(require.main.filename)}/public/`;

dotenv.config();

async function dbExecute(func, params) {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  let result;

  try {
    await client.connect();

    result = await func(client, ...params);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
  return result;
}

async function findFileById(client, _id) {
  let res = await client
    .db('drive-clone-db')
    .collection('fs.files')
    .findOne({ _id: new ObjectID(_id) });
  return res;
}

async function deleteFile(client, fileId) {
  let db = client.db('drive-clone-db');
  const bucket = new GridFSBucket(db);

  try {
    await bucket.delete(new ObjectID(fileId));
  } catch (err) {

    return {
      ok: false,
      code: 400,
      errors: err.message
    };
  }

  return {
    ok: true,
    code: 204
  };
}

async function renameFileById(client, fileId, newFileName) {
  let db = client.db('drive-clone-db');
  const bucket = new GridFSBucket(db);

  try {
    await bucket.rename(new ObjectID(fileId), newFileName);
  } catch (err) {

    return {
      ok: false,
      code: 400,
      errors: err.message
    };
  }

  return {
    ok: true,
    code: 204
  };
}

async function uploadFile(client, tempName, fileName) {
  const db = client.db('drive-clone-db');
  const bucket = new GridFSBucket(db);

  try {
    const readStream = fs.createReadStream(`${publicFolder}${tempName}`);
    const uploadStream = bucket.openUploadStream(fileName);

    let res = await util.promisify(stream.pipeline)(readStream, uploadStream);

    return {
      ok: true,
      code: 204,
      _id: uploadStream.id
    };
  } catch (err) {

    return {
      ok: false,
      code: 401,
      errors: err.message
    };
  }
}

async function downloadFile(client, fileId) {

  try {

    let result = await dbExecute(findFileById, [fileId]).catch(console.error);

    if (result) {
      const fileName = Math.random().toString(36).substring(2) + result.filename;

      const db = client.db('drive-clone-db');
      const bucket = new GridFSBucket(db);

      try {
        const writeStream = fs.createWriteStream(`${publicFolder}${fileName}`);
        const uploadStream = bucket.openDownloadStream(new ObjectID(fileId));

        await util.promisify(stream.pipeline)(uploadStream, writeStream);

        return {
          ok: true,
          code: 204,
          fileName,
        };
      } catch (err) {

        return {
          ok: false,
          code: 400,
          errors: err.message
        };
      }
    }
  } catch (err) {

    return {
      ok: false,
      code: 400,
      errors: err.message
    };
  }
}

async function findUserTreeById(client, _id) {
  let res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .findOne({ _id });
  return res;
}

async function createFileTreeForUser(client, sub, initialFileTree) {
  let res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .insertOne({ _id: sub, ...initialFileTree });

  return res;
}

async function updateFileTreeForUser(client, sub, updatedFileTree) {
  try {
    await client
      .db('drive-clone-db')
      .collection('userFileTrees')
      .replaceOne({ _id: sub }, { module: updatedFileTree });

    return {
      ok: true,
      code: 204,
    };
  } catch (error) {
    return {
      ok: false,
      error: err?.errmsg,
      code: err?.code || 500,
    };
  }
}

module.exports = {
  dbExecute,
  uploadFile,
  downloadFile,
  deleteFile,
  renameFileById,
  findUserTreeById,
  createFileTreeForUser,
  updateFileTreeForUser,
};
