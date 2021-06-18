const path = require('path');
const model = require('../models');
const {
  dbExecute,
  uploadFile,
  downloadFile,
  deleteFile,
  renameFileById,
  updateFileTreeForUser,
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
        message: err.message,
      });
    }
  });

  if (response.ok) {
    response = await dbExecute(uploadFile, [tempName, fileName]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    response = req.drive.add(
      req.body.path,
      new model.File({
        name: fileName,
        _id: response._id,
      })
    );

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({ errors: response.errors });
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
      message: 'Request body is missing path',
    });
  }

  if (!name) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing name',
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
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    response = await dbExecute(downloadFile, [response.id]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }
    const fileName = response.fileName;
    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    return res.download(`${publicFolder}${fileName}`);
  }

  return res.status(response.code).send({ errors: response.errors });
};

const deleteCallback = async (req, res) => {
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
      message: 'Request body is missing path',
    });
  }

  if (!name) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing name',
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
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    const fileId = response.id;

    response = req.drive.remove(
      path,
      new model.File({ name, _id: fileId })
    );

    if (!response.ok) {
      return res.status(response.code).send({
        errors: [response.error],
      });
    }

    response = await dbExecute(deleteFile, [fileId]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({ errors: response.errors });
};

const renameFile = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  const name = req.body?.currentName;
  const newName = req.body?.newName;
  const path = req.body?.path;

  if (!path) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing path',
    });
  }

  if (!name) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing currentName',
    });
  }

  if (!newName) {
    response.ok = false;
    response.errors.push({
      message: 'Request body is missing newName',
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
      return res
        .status(response.code)
        .send({ errors: response.error });
    }
    const fileId = response.id;

    response = req.drive.rename(
      req.body.path,
      new model.File({
        name: req.body.newName,
      }),
      new model.File({
        name,
      })
    );

    response = await dbExecute(renameFileById, [fileId, newName]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    const mongoDoc = req.drive.format();

    response = await dbExecute(updateFileTreeForUser, [
      req.oidc.user.sub,
      mongoDoc,
    ]);

    if (!response.ok) {
      return res
        .status(response.code)
        .send({ errors: response.errors });
    }

    return res.status(response.code).send();
  }

  return res.status(response.code).send({ errors: response.errors });
};

const moveFile = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  if (!req.body?.currentPath) {
    response.errors.push({
      message: "Request body is missing file's current path",
    });
    response.ok = false;
  }

  if (!req.body?.newPath) {
    response.errors.push({
      message: "Request body is missing file's new path",
    });
    response.ok = false;
  }

  if (!req.body?.name) {
    response.errors.push({
      message: "Request body is missing file's name",
    });
    response.ok = false;
  }

  if (!response.ok) {
    return res.status(response.code).send({
      errors: response.errors,
    });
  }

  response = req.drive.move(
    req.body.currentPath,
    req.body.newPath,
    new model.File({
      name: req.body.name,
    })
  );

  if (!response.ok) {
    return res.status(response.code).send({
      errors: [response.error],
    });
  }

  const mongoDoc = req.drive.format();

  response = await dbExecute(updateFileTreeForUser, [
    req.oidc.user.sub,
    mongoDoc,
  ]);

  if (!response.ok) {
    return res.status(response.code).send({
      errors: [response.error],
    });
  }

  return res.status(response.code).send();
};

module.exports = {
  upload,
  download,
  deleteCallback,
  renameFile,
  moveFile,
};
