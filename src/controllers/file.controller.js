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
    let dbRes = await dbExecute(uploadFile, [tempName, fileName]);

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
  const fileId = req.body?.fileId;

  if (!fileId) {
    return res.status(400).send({
      code: 400,
      message: 'Missing fileId',
    });
  }

  const dbRes = await downloadFile(fileId);

  if (dbRes) {
    let noFile = true;
    while (noFile) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        noFile =
          fs.statSync(`${publicFolder}${dbRes.fileName}`).size / 1024;
        break;
      } catch (e) {
        if (e.code === 'ENOENT') {
        } else {
          console.log(e);
          break;
        }
      }
    }
    let currentFileSizeInKB = fs.statSync(
      `${publicFolder}${dbRes.fileName}`
    ).size;
    while (currentFileSizeInKB < dbRes.fileSize) {
      currentFileSizeInKB = fs.statSync(
        `${publicFolder}${dbRes.fileName}`
      ).size;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    res.download(`${publicFolder}${dbRes.fileName}`);
  } else {
    res.status = StatusCodes.BAD_REQUEST;
    res.json({
      message: 'Error: Download Failed',
    });
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
    let dbRes = await dbExecute(deleteFile, [fileId]);

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
