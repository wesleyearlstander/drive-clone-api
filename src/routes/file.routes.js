const express = require('express');
const fileRouter = express.Router();
const { upload } = require('../controllers/file.controller');
const { StatusCodes } = require('http-status-codes');

// TODO: Mohammed
FileRouter.post('/upload/file', upload);

// TODO: Mohammed
fileRouter.get('/download', (req, res) => {});

fileRouter.put('/move', (req, res) => {
  const file = req.query.file;
  const directory = req.query.directory;

  if (!file) {
    res.status = StatusCodes.NOT_FOUND;
    res.json({
      message: 'File Not Found',
    });
  }

  res.status = StatusCodes.OK;
  res.json({
    message: `${file} has been moved to ${directory}`,
  });
});

fileRouter.patch('/rename', (req, res) => {
  const file = req.query.file;
  const name = req.query.name;

  if (!file) {
    res.status = StatusCodes.NOT_FOUND;
    res.json({
      message: `File: ${file} not found`,
    });

    if (!name) {
      res.status = StatusCodes.BAD_REQUEST;
      res.json({
        message: 'Please provide new file name',
      });
    }
  }

  res.status = StatusCodes.OK;
  res.json({
    message: `File ${file} renamed to ${name}`,
  });
});

fileRouter.delete('/delete', (req, res) => {
  const file = req.query.file;

  if (!file) {
    res.status = StatusCodes.NOT_FOUND;
    res.json({
      message: `File: ${file} not found`,
    });
  }

  res.status = StatusCodes.NO_CONTENT;
  res.send();
});

module.exports = fileRouter;
