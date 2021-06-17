const express = require('express');
const fileRouter = express.Router();
const { buildDrive } = require('../middleware');
const {
  upload,
  download,
  deleteCallback,
  moveFile,
  renameFile
} = require('../controllers');

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
 *       - in: formData
 *         name: path
 *         type: string
 *         required: true
 *         description: specify path to upload file
 *     tags: [file]
 *     responses:
 *       204:
 *         description: upload success
 *       400:
 *         description: upload failed
 */
fileRouter.post('/upload', [buildDrive], upload);

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
 *             path:
 *               type: string
 *             name:
 *               type: string
 *     tags: [file]
 *     responses:
 *       200:
 *         description: download success
 *       400:
 *         description: download failed
 *
 */
fileRouter.post('/download', [buildDrive], download);

/**
 * @swagger
 * /v1/files/move:
 *   put:
 *     summary: move a file
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *          currentPath:
 *            type: string
 *          newPath:
 *            type: string
 *          fileName:
 *            type: string
 *     tags: [file]
 *     responses:
 *       200:
 *         description: file renamed successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
fileRouter.put('/move', [buildDrive], moveFile);

/**
 * @swagger
 * /v1/files/rename:
 *   patch:
 *     summary: rename a file
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *          path:
 *            type: string
 *          currentName:
 *            type: string
 *          newName:
 *            type: string
 *     tags: [file]
 *     responses:
 *       200:
 *         description: file renamed successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
fileRouter.patch('/rename', [buildDrive], renameFile);

/**
 * @swagger
 * /v1/files/delete:
 *   delete:
 *     summary: deletes a file
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *        type: object
 *        properties:
 *          path:
 *            type: string
 *          name:
 *            type: string
 *          fileId:
 *            type: string
 *     tags: [file]
 *     responses:
 *       200:
 *         description: file renamed successfully
 *       404:
 *         description: file not found
 *       500:
 *          description: internal server error
 *
 */
fileRouter.delete('/delete', [buildDrive], deleteCallback);

module.exports = fileRouter;
