const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const model = require('../models');
const {
  dbExecute,
  uploadFile,
  downloadFile,
  deleteFile,
  updateFileTreeForUser
} = require('../services');

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

const download = async (req, res) => {

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

    const driveRes = req.drive.remove(
      req.body.path,
      new model.File({
        name: req.body.name,
      })
    );

    if (driveRes.ok) {

      let dbRes = await dbExecute(deleteFile, [fileId]);

      response.code = dbRes.code;

      if (dbRes.ok) {

        const mongoDoc = req.drive.format();

        dbRes = await dbExecute(updateFileTreeForUser, [
          req.oidc.user.sub,
          mongoDoc,
        ]);

        if (dbRes.ok) {
          response.ok = true;
        } else {
          response.errors.push({
            message: dbRes.message
          });
        }

      } else {

        response.errors.push({
          message: dbRes.message
        });
      }
    } else {

      response.errors.push({
        message: driveRes.message
      });
    }
  }

  if (response.ok) {
    return res.status(response.code).send();
  } else {
    return res.status(response.code).send(response);
  }
};

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

module.exports = {
  upload,
  download,
  deleteCallback,
  renameFile,
  moveFile,
};
