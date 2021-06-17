const { findUserTreeById, dbExecute } = require('../services');
const { Folder } = require('../models');

const buildDrive = async (req, res, next) => {
  const fileTree = await dbExecute(findUserTreeById, [
    req.oidc.user.sub,
  ]);

  const userDrive = new Folder(fileTree.module);

  req.drive = userDrive;
  next();
};

module.exports = buildDrive;
