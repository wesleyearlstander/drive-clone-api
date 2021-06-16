const dbExecute = require('../config/database');
const model = require('../models');
const emptyFolder = require('../config/emptyFolder');
const { updateFileTreeForUser } = require('./directory.controller');

exports.getChildren = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id',
    });
  }
  return res.status(200).send(req.oidc.user);
};

exports.make = async (req, res) => {
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
      message: 'Folder did not exist',
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

exports.remove = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id',
    });
  }
};

exports.move = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id',
    });
  }
};

exports.rename = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id',
    });
  }
};
