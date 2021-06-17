const express = require('express');
const fileRouter = express.Router();
const { upload, download } = require('../controllers');
const { StatusCodes } = require('http-status-codes');
const model = require('../models');
const { updateFileTreeForUser } = require('../controllers/directory.controller');
const buildDrive = require('../middleware/buildDrive');
const dbExecute = require('../config/database');

/**
 * @swagger
 * tags:
 *   name: files
 *   description: Files Endpoints
 */

/**
 * @swagger
 * tags:
 *   name: file
 *   description: File APIs
 */

/**
 * @swagger
 * /v1/files/upload:
 *   x-swagger-route-controller: bus_api
 *   post:
 *     operationId: upload
 *     summary: uploads a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: imageFile
 *         type: file
 *         description: The file to upload.
 *     tags: [file]
 *     responses:
 *       200:
 *         description: upload success
 *       500:
 *         description: upload failed
 */
fileRouter.post('/upload', upload);

/**
 * @swagger
 * /v1/files/download:
 *   post:
 *     summary: downloads requested file
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: The user to create.
 *         schema:
 *           type: object
 *           properties:
 *             fileId:
 *               type: string
 *             filePath:
 *               type: string
 *     tags: [file]
 *     responses:
 *       200:
 *         description: download success
 *       500:
 *         description: download failed
 *
 */
fileRouter.post('/download', download);

  if (!req.body.currentPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder current path',
    });
  }

  if (!req.body.newPath) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder new path',
    });
  }

  if (!req.body.fileName) {
    return res.status(400).send({
      code: 400,
      message: 'Missing folder name',
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
      message: 'File or path did not exist',
    });
  }
  
  const mongoDoc = req.drive.format();

  const updateFileTree = await dbExecute(updateFileTreeForUser, [
    req.oidc.user.sub,
    mongoDoc,
  ]);

  // TODO: check negative scenarios

  res.status = StatusCodes.NO_CONTENT;
  res.send();
});
/**
 * @swagger
 * /v1/files/rename:
 *   patch:
 *     summary: rename a file
 *     tags: [files]
 *     responses:
 *       200:
 *         description: file renamed successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
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
/**
 * @swagger
 * /v1/files/delete:
 *   delete:
 *     summary: rename a file
 *     tags: [files]
 *     responses:
 *       200:
 *         description: file deleted successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
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
