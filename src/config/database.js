const dotenv = require('dotenv');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {MongoClient, GridFSBucket, ObjectID} = require('mongodb');

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

async function uploadFile(tempName, fileName) {

  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  client.connect(function(error, client) {
    assert.ifError(error);

    const db = client.db('drive-clone-db');

    const bucket = new GridFSBucket(db);

    fs.createReadStream(appDir + '/public/' + tempName).
      pipe(bucket.openUploadStream(fileName)).
      on('error', function(error) {
        assert.ifError(error);
      }).
      on('finish', function(res) {
        console.log('done!');
      });
  });
}

async function findFileById(client, _id) {
  let res = await client.db('drive-clone-db').collection('fs.files').findOne({_id: new ObjectID(_id)});
  return res;
}

async function downloadFile(fileId) {

  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@drive-clone-cluster.cuxyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  let result = await dbExecute(findFileById, [fileId]).catch(console.error);

  let fileName, fileSize;

  if (result) {
    fileName = Math.random().toString(36).substring(2) + result.filename;
    fileSize = result.length;

    client.connect(function(error, client) {
      assert.ifError(error);

      const db = client.db('drive-clone-db');

      const bucket = new GridFSBucket(db);

      bucket.openDownloadStream(new ObjectID(fileId)).
        pipe(fs.createWriteStream(appDir + '/public/' + fileName)).
        on('error', function(error) {
          assert.ifError(error);
        }).
        on('finish', function() {
          console.log('done!');
        });
    });
  }

  return {
    fileName,
    fileSize
  };
}

module.exports = {
  dbExecute,
  uploadFile,
  downloadFile
};