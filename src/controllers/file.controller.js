const { StatusCodes } = require('http-status-codes');
const path = require('path');
const fs = require('fs');
const model = require('../models');
const {
  dbExecute,
  uploadFile,
  downloadFile,
  deleteFile,
  renameFileById,
  updateFileTreeForUser
} = require('../services');

const publicFolder = `${path.dirname(require.main.filename)}/public/`;

const upload = async (req, res) => {

  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  const startup_image = req.files.imageFile;
  const fileName = startup_image.name;
  const tempName = Math.random().toString(36).substring(2) + fileName;

  startup_image.mv(`${publicFolder}${tempName}`, (err) => {

    if (err) {
      response.ok = false;
      response.errors.push({
        message: err.message
      });
    }
  });

  if (response.ok) {

    response = await dbExecute(uploadFile, [tempName, fileName]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    response = req.drive.add(
      req.body.path,
      new model.File({
        name: fileName,
        _id: response._id
      })
    );

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({errors: response.errors});
};

const download = async (req, res) => {

  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  const name = req.body?.name;
  const path = req.body?.path;

  if (!path) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing path'
    });
  }

  if (!name) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing name'
    });
  }

  if (response.ok) {

    response = req.drive.getChild(
      path,
      new model.File({
        name,
      })
    );

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    response = await dbExecute(downloadFile, [response.id]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }
    const fileName = response.fileName;
    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    return res.download(`${publicFolder}${fileName}`);
  }

  return res.status(response.code).send({errors: response.errors});
}

const deleteCallback = async (req, res) => {

  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  const fileId = req.body?.fileId;
  const name = req.body?.name;
  const path = req.body?.path;

  if (!fileId) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing fileId'
    });
  }

  if (!path) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing path'
    });
  }

  if (!name) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing name'
    });
  }

  if (response.ok) {

    response = await dbExecute(deleteFile, [fileId]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    response = req.drive.remove(
      path,
      new model.File({
        name,
      })
    );

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({errors: response.errors});
};

const renameFile = async (req, res) => {

  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  const currentName = req.body?.currentName;
  const newName = req.body?.newName;
  const path = req.body?.path;

  if (!path) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing path'
    });
  }

  if (!currentName) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing currentName'
    });
  }

  if (!newName) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing newName'
    });
  }

  if (response.ok) {

    response = req.drive.getChild(
      path,
      new model.File({
        currentName,
      })
    );

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }
    const fileId = response.id;

    response = req.drive.rename(
      req.body.path,
      req.body.newName,
      new model.File({
        name: req.body.currentName,
      })
    );

    response = await dbExecute(renameFileById, [fileId, newName]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {

      return res.status(response.code).send({errors: response.errors});
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({errors: response.errors});
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
