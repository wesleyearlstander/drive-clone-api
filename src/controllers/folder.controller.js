const dbExecute = require('../config/database');
const folder = require('../models');

exports.getChildren = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }
  return res.status(200).send(req.oidc.user)

};



exports.make = async (req, res) => {
  if (!req.body?.path) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder path'
    });
  }


  // const paths = req.body.path.split('/');

  return res.status(200).send(req.drive);


  // Does this path exist
  // documents/secret

};

exports.remove = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }
};

exports.move = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }
};

exports.rename = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }
};