const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const { dbExecute, uploadFile, downloadFile, deleteFile } = require('../services');

const publicFolder = `${path.dirname(require.main.filename)}/public/`;

const upload = async (req, res) => {

  let response = {
    ok: false,
    errors: [],
    code: 400,
  };

  const startup_image = req.files.imageFile;
  const fileName = startup_image.name;
  const tempName = Math.random().toString(36).substring(2) + fileName;

  startup_image.mv(`${publicFolder}${tempName}`, (err) => {

    if (err) {
      response.errors.push({
        message: err.message
      });
    }
  });

  if (!response.errors.length) {
    const dbRes = await dbExecute(uploadFile, [tempName, fileName]);

    response.code = dbRes.code;

    if (dbRes.ok) {
      response.ok = true;
    } else {

      response.errors.push({
        message: dbRes.message
      });
    }
  }

  if (response.ok) {
    return res.status(response.code).send();
  } else {
    return res.status(response.code).send(response);
  }
};

async function download(req, res) {

  let response = {
    ok: false,
    errors: [],
    code: 400,
  };

  const fileId = req.body?.fileId;
  const filePath = req.body?.filePath;

  if (!fileId) {
    response.errors.push({
      message: 'Request body is missing fileId'
    });
  }

  if (!filePath) {
    response.errors.push({
      message: 'Request body is missing filePath'
    });
  }

  let dbRes;

  if (!response.errors.length) {

    dbRes = await dbExecute(downloadFile, [fileId]);

    response.code = dbRes.code;

    if (dbRes.ok) {
      response.ok = true;
    } else {

      response.errors.push({
        message: dbRes.message
      });
    }
  }

  if (response.ok) {
    res.status(response.code)
    return res.download(`${publicFolder}${dbRes.fileName}`);
  } else {
    return res.status(response.code).send(response);
  }
}

const deleteCallback = async (req, res) => {

  let response = {
    ok: false,
    errors: [],
    code: 400,
  };

  const fileId = req.body?.fileId;
  const filePath = req.body?.filePath;

  if (!fileId) {
    response.errors.push({
      message: 'Request body is missing fileId'
    });
  }

  if (!filePath) {
    response.errors.push({
      message: 'Request body is missing filePath'
    });
  }

  if (!response.errors.length) {
    const dbRes = await dbExecute(deleteFile, [fileId]);

    response.code = dbRes.code;

    if (dbRes.ok) {
      response.ok = true;
    } else {

      response.errors.push({
        message: dbRes.message
      });
    }
  }

  if (response.ok) {
    return res.status(response.code).send();
  } else {
    return res.status(response.code).send(response);
  }
};

module.exports = {
  upload,
  download,
  deleteCallback
};
