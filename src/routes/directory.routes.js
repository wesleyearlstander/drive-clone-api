const express = require('express');
const DirectoryRouter = express.Router();
const { FolderController } = require('../controllers');

/**
 * @swagger
 * components:
 *  schemas:
 *    Folder:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: The folder's name
 *      example:
 *        name: documents
 *    File:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *          description: The folder's name
 *      example:
 *        name: meme.png
 *    Error:
 *      type: object
 *      properties:
 *        code:
 *          type: string
 *        message:
 *          type: string
 *      required:
 *        - code
 *        - message
 *      example:
 *        code: 400
 *        message: Missing folder id
 *  responses:
 *    BadRequest:
 *      description: The request was malformed
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Error'
 *          example:
 *            code: 400
 *            message: Missing folder id
 *    NotFound:
 *      description: The resource was not found
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Error'
 *          example:
 *            code: 404
 *            message: Resource was not found
 *    Forbidden:
 *      description: User does not have permission to perform requested operation
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Error'
 *          example:
 *            code: 403
 *            message: User has insufficient privileges to perform requested action
 */

/**
 * @swagger
 * /directory/:id:
 *   get:
 *     summary: Returns the list of all children in the directory
 *     responses:
 *       200:
 *         description: The list of all items in the directory
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 anyOf:
 *                   - $ref: '#/components/schemas/File'
 *                   - $ref: '#/components/schemas/Folder'
 *       204:
 *         description: Directory is empty
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
DirectoryRouter.get(
  '/:id',
  FolderController.getChildren
);

/**
 * @swagger
 * /directory:
 *   post:
 *     summary: Creates a new folder in the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Folder' 
 *     responses:
 *       204:
 *         description: Folder was created
 *       400:
 *        $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
DirectoryRouter.post(
  '/:id',
  FolderController.make
);

DirectoryRouter.delete(
  '/:id',
  FolderController.remove
);

DirectoryRouter.put(
  '/:id',
  FolderController.move
);

DirectoryRouter.patch(
  '/:id',
  FolderController.rename
);

module.exports = DirectoryRouter;