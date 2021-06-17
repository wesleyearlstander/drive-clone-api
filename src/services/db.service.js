const dotenv = require('dotenv');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { MongoClient, GridFSBucket, ObjectID } = require('mongodb');

const appDir = path.dirname(require.main.filename);

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
      message: err.message
    };
  }

  return {
    ok: true,
    code: 204
  };
}

async function uploadFile(tempName, fileName) {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  client.connect(function (error, client) {
    assert.ifError(error);

    const db = client.db('drive-clone-db');

    const bucket = new GridFSBucket(db);

    fs.createReadStream(appDir + '/public/' + tempName)
      .pipe(bucket.openUploadStream(fileName))
      .on('error', function (error) {
        assert.ifError(error);
      })
      .on('finish', function (res) {
        console.log('done!');
      });
  });
}

async function downloadFile(fileId) {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  let result = await dbExecute(findFileById, [fileId]).catch(
    console.error
  );

  let fileName, fileSize;

  if (result) {
    fileName =
      Math.random().toString(36).substring(2) + result.filename;
    fileSize = result.length;

    client.connect(function (error, client) {
      assert.ifError(error);

      const db = client.db('drive-clone-db');

      const bucket = new GridFSBucket(db);

      bucket
        .openDownloadStream(new ObjectID(fileId))
        .pipe(fs.createWriteStream(appDir + '/public/' + fileName))
        .on('error', function (error) {
          assert.ifError(error);
        })
        .on('finish', function () {
          console.log('done!');
        });
    });
  }

  return {
    fileName,
    fileSize,
  };
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
  const res = await client
    .db('drive-clone-db')
    .collection('userFileTrees')
    .replaceOne({ _id: sub }, { module: updatedFileTree });

  return res;
}

module.exports = {
  dbExecute,
  uploadFile,
  downloadFile,
  deleteFile,
  findUserTreeById,
  createFileTreeForUser,
  updateFileTreeForUser,
};
