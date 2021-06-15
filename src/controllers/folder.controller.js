const folder = require('../models');

exports.getChildren = (req, res) => {
  if (req.params?.folderId === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }

};

exports.make = (req, res) => {
  if (req.body?.path === null) {
    return res.status(400).send({
      message: 'Missing folder id'
    });
  }

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