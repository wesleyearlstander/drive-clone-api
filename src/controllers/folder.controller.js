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
  if (!req.body?.path) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder path',
    });
  }

  if (!req.body?.name) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name',
    });
  }

  const response = req.drive.add(
    req.body.path,
    new model.Folder({
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

  // Todo: check negative scenarios

  return res.status(204).send();
};

exports.removeFolder = async (req, res) => {
  if (!req.body?.path) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder path',
    });
  }

  if (!req.body?.name) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name',
    });
  }

  const response = req.drive.remove(
    req.body.path,
    new model.Folder({
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
};

exports.moveFolder = async (req, res) => {
  if (!req.body?.currentPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder current path',
    });
  }

  if (!req.body?.newPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder new path',
    });
  }

  if (!req.body?.name) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name',
    });
  }

  const response = req.drive.move(
    req.body.currentPath,
    req.body.newPath,
    new model.Folder({
      name: req.body.name,
    })
  );

  if (!response) {
    return res.status(404).send({
      message: 'Folder or paths did not exist',
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
};

exports.renameFolder = async (req, res) => {
  if (!req.body?.path) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder path',
    });
  }

  if (!req.body?.currentName) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder current name',
    });
  }

  if (!req.body?.newName) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder new name',
    });
  }

  const response = req.drive.rename(
    req.body.path,
    req.body.newName,
    new model.Folder({
      name: req.body.currentName,
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
};
