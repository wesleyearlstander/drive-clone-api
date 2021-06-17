const express = require('express');
const fileRouter = express.Router();
const { upload, download, deleteCallback } = require('../controllers');
const { StatusCodes } = require('http-status-codes');

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
 *         name: fileSpecifier
 *         description: specifies fileId at filePath to be downloaded
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

/**
 * @swagger
 * /v1/files/delete:
 *   delete:
 *     summary: deletes specified file
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: fileSpecifier
 *         description: specifies fileId at filePath to be deleted
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
 *         description: delete success
 *       500:
 *         description: delete failed
 *
 */
fileRouter.delete('/delete', deleteCallback);

module.exports = fileRouter;
