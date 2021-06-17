const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const { uploadFile, downloadFile } = require('../services');
const model = require('../models');
const { dbExecute } = require('../services/db.service');
const { updateFileTreeForUser } = require('../services');

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
        err,
      });
    } else {
      res.status = StatusCodes.OK;
      res.json({
        message: 'Upload Success',
        err,
      });
    }
  });

  uploadFile(tempName, fileName);
};

async function download(req, res) {
  const fileId = req.body.fileId;

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
          fs.statSync(`${publicDir}${dbRes.fileName}`).size / 1024;
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
      `${publicDir}${dbRes.fileName}`
    ).size;
    while (currentFileSizeInKB < dbRes.fileSize) {
      currentFileSizeInKB = fs.statSync(
        `${publicDir}${dbRes.fileName}`
      ).size;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    res.download(`${publicDir}${dbRes.fileName}`);
  } else {
    res.status = StatusCodes.BAD_REQUEST;
    res.json({
      message: 'Error: Download Failed',
    });
  }
}

const renameFile = async (req, res) => {
  if (!req.body.path) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      code: StatusCodes.BAD_REQUEST,
      message: 'Missing file path',
    });
  }

  if (!req.body.currentName) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      code: StatusCodes.BAD_REQUEST,
      message: 'Missing file current name',
    });
  }

  if (!req.body.newName) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      code: StatusCodes.BAD_REQUEST,
      message: 'Missing file new name',
    });
  }

  const response = req.drive.rename(
    req.body.path,
    req.body.newName,
    new model.File({
      name: req.body.currentName,
    })
  );

  if (!response) {
    return res.status(StatusCodes.NOT_FOUND).send({
      message: 'File or path did not exist',
    });
  }

  const mongoDoc = req.drive.format();

  const updateFileTree = await dbExecute(updateFileTreeForUser, [
    req.oidc.user.sub,
    mongoDoc,
  ]);

  // TODO: check negative scenarios
  // TODO: Remove any children file objects from db

  return res.status(StatusCodes.NO_CONTENT).send();
}

const moveFile = async (req, res) => {
  if (!req.body.currentPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder current path'
    });
  }

  if (!req.body.newPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder new path'
    });
  }

  if (!req.body.fileName) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name'
    });
  }

  const response = req.drive.move(
    req.body.currentPath,
    req.body.newPath,
    new model.File({
      name: req.body.fileName
    })
  );

  if (!response) {
    return res.status(404).send({
      message: 'File or path did not exist'
    });
  }
  
  const mongoDoc = req.drive.format();

  const updateFileTree = await dbExecute(updateFileTreeForUser, [
    req.oidc.user.sub,
    mongoDoc
  ]);

  // TODO: check negative scenarios

  res.status = StatusCodes.NO_CONTENT;
  res.send();
}

const deleteFile = async (req, res) => {
  if (!req.body.path) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder path',
    });
  }

  if (!req.body.name) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name',
    });
  }

  const response = req.drive.remove(
    req.body.path,
    new model.File({
      name: req.body.name,
    })
  );

  if (!response) {
    return res.status(404).send({
      message: 'Folder or path did not exist',
    });
  }

  const mongoDoc = req.drive.format();

  const updateFileTree = await dbExecute(updateFileTreeForUser, [
    req.oidc.user.sub,
    mongoDoc,
  ]);

  // TODO: check negative scenarios
  // TODO: Remove any children file objects from db

  return res.status(204).send();
}

module.exports = {
  upload,
  download,
  renameFile,
  moveFile,
  deleteFile
};
