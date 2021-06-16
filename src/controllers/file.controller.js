const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const { uploadFile, downloadFile } = require('../config/database');

const publicDir = `${path.dirname(require.main.filename)}/public/`;

const upload = (req, res) => {

  const startup_image = req.files.imageFile;
  const fileName = startup_image.name;
  const tempName = Math.random().toString(36).substring(2) + fileName;

  startup_image.mv(`${publicDir}${tempName}`, function (err) {
    if (err) {
      res.status = StatusCodes.BAD_REQUEST;
      res.json({
        message: 'Error: Upload Failed',
        err
      });
    } else {
      res.status = StatusCodes.OK;
      res.json({
        message: 'Upload Success',
        err
      });
    }
  });

  uploadFile(tempName, fileName);

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
        await new Promise(resolve => setTimeout(resolve, 1000));
        noFile = fs.statSync(`${publicDir}${dbRes.fileName}`).size/1024;
        break;
      } catch (e) {
        if (e.code === 'ENOENT') {
        } else {
          console.log(e);
          break;
        }
      }
    }
    let currentFileSizeInKB = fs.statSync(`${publicDir}${dbRes.fileName}`).size;
    while (currentFileSizeInKB < dbRes.fileSize) {
      currentFileSizeInKB = fs.statSync(`${publicDir}${dbRes.fileName}`).size;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    res.download(`${publicDir}${dbRes.fileName}`);
  } else {

    res.status = StatusCodes.BAD_REQUEST;
    res.json({
      message: 'Error: Download Failed',
    });
  }
};

module.exports = {
  upload,
  download
};
