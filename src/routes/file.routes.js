const express = require('express');
const fileRouter = express.Router();
const { upload } = require('../controllers/file.controller');
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

// TODO: Mohammed
fileRouter.post('/upload/file', upload);

// TODO: Mohammed
fileRouter.get('/download', (req, res) => {});
/**
 * @swagger
 * /v1/files/move:
 *   put:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                currentPath:
 *                    type: string
 *                fileName:
 *                    type: string
 *                newPath:
 *                    type: string
 *             required:
 *               - currentPath
 *               - newPath
 *               - fileName
 *             example:
 *               currentPath: /
 *               newPath: /new
 *               fileName: /
 *     summary: modifies users file structure
 *     tags: [files]
 *     responses:
 *       200:
 *         description: files moved successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
fileRouter.put('/move', [buildDrive], async (req, res) => {
  /**
   * Modify user file structure
   */

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
