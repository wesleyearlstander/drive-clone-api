const express = require('express');
const fileRouter = express.Router();
const { upload } = require('../controllers/file.controller');
const { StatusCodes } = require('http-status-codes');

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
 * /files/move:
 *   put:
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
fileRouter.put('/move', (req, res) => {
  /**
   * Get user identity
   * Retrieve user file structure
   * Modify user file structure
   */
  const user = req.oidc.accessToken;
  console.log(user);
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
/**
 * @swagger
 * /files/rename:
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
    message: `File ${file} renamed to ${name}`
  });
});
/**
 * @swagger
 * /files/delete:
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
      message: `File: ${file} not found`
    });
  }
  
  res.status = StatusCodes.NO_CONTENT;
  res.send();
})

module.exports = fileRouter;
