const model = require('../models');
const { updateFileTreeForUser, dbExecute } = require('../services');

exports.getChildren = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id',
    });
  }
  return res.status(200).send(req.oidc.user);
};

exports.makeFolder = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  if (!req.body?.path) {
    response.errors.push({
      message: "Request body is missing folder's path",
    });
    response.ok = false;
  }

  if (!req.body?.name) {
    response.errors.push({
      message: "Request body is missing folder's name",
    });
    response.ok = false;
  }

  if (!response.ok) {
    return res.status(response.code).send({
      errors: response.errors,
    });
  }

  response = req.drive.add(
    req.body.path,
    new model.Folder({
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
    return res.status(response.code).send(response.errors);
  }

  return res.status(response.code).send();
};

exports.removeFolder = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  if (!req.body?.path) {
    response.errors.push({
      message: "Request body is missing folder's path",
    });
    response.ok = false;
  }

  if (!req.body?.name) {
    response.errors.push({
      message: "Request body is missing folder's name",
    });
    response.ok = false;
  }

  if (!response.ok) {
    return res.status(response.code).send({
      errors: response.errors,
    });
  }
  const path = req.body.path;
  const driveItem = new model.Folder({
    name: req.body.name,
  });
  // TODO: Remove any children file objects from db
  response = req.drive.getDescendantFileIds(path, driveItem);

  if (!response.ok) {
    return res.status(response.code).send(response.error);
  }

  await response.ids?.forEach((id) => {
    dbExecute(deleteFile, [id]);
  });

  response = req.drive.remove(path, driveItem);

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

exports.moveFolder = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  if (!req.body?.currentPath) {
    response.errors.push({
      message: "Request body is missing folder's current path",
    });
    response.ok = false;
  }

  if (!req.body?.newPath) {
    response.errors.push({
      message: "Request body is missing folder's new path",
    });
    response.ok = false;
  }

  if (!req.body?.name) {
    response.errors.push({
      message: "Request body is missing folder's name",
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
    new model.Folder({
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

exports.renameFolder = async (req, res) => {
  let response = {
    ok: true,
    errors: [],
    code: 400,
  };

  if (!req.body?.path) {
    response.errors.push({
      message: "Request body is missing folder's path",
    });
    response.ok = false;
  }

  if (!req.body?.currentName) {
    response.errors.push({
      message: "Request body is missing folder's current name",
    });
    response.ok = false;
  }

  if (!req.body?.newName) {
    response.errors.push({
      message: "Request body is missing folder's new name",
    });
    response.ok = false;
  }

  if (!response.ok) {
    return res.status(response.code).send({
      errors: response.errors,
    });
  }

  response = req.drive.rename(
    req.body.path,
    new model.Folder({
      name: req.body.newName,
    }),
    new model.Folder({
      name: req.body.currentName,
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
