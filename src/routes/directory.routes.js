const express = require('express');
const DirectoryRouter = express.Router();
const { folderController } = require('../controllers');
const buildDrive = require('../middleware/buildDrive');

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

// /**
//  * @swagger
//  * /v1/directory/:id:
//  *   get:
//  *     summary: Returns the list of all children in the directory
//  *     responses:
//  *       200:
//  *         description: The list of all items in the directory
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 anyOf:
//  *                   - $ref: '#/components/schemas/File'
//  *                   - $ref: '#/components/schemas/Folder'
//  *       204:
//  *         description: Directory is empty
//  *       400:
//  *         $ref: '#/components/responses/BadRequest'
//  *       403:
//  *         $ref: '#/components/responses/Forbidden'
//  *       404:
//  *         $ref: '#/components/responses/NotFound'
//  */
// DirectoryRouter.get('/:id', folderController.getChildren);

/**
 * @swagger
 * /v1/directory:
 *   post:
 *     summary: Creates a new folder in the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                  type: string
 *               name:
 *                   type: string
 *             required:
 *               - path
 *               - name
 *             example:
 *               path: /
 *               name: folderInRoot
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
DirectoryRouter.post('/', [buildDrive], folderController.make);
/**
 * @swagger
 * /v1/directory:
 *   delete:
 *     summary: Removes a folder from the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                  type: string
 *               name:
 *                   type: string
 *             required:
 *               - path
 *               - name
 *             example:
 *               path: /
 *               name: folderInRoot
 *     responses:
 *       204:
 *         description: Folder was deleted
 *       400:
 *        $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
DirectoryRouter.delete('/', [buildDrive], folderController.remove);
/**
 * @swagger
 * /v1/directory:
 *   put:
 *     summary: moves a folder between two directories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPath:
 *                  type: string
 *               newPath:
 *                  type: string
 *               name:
 *                   type: string
 *             required:
 *               - currentPath
 *               - newPath
 *               - name
 *             example:
 *               currentPath: /
 *               newPath: /folderMadeWithDbConnection
 *               name: folderInRoot
 *     responses:
 *       204:
 *         description: Folder was moved
 *       400:
 *        $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
DirectoryRouter.put('/', [buildDrive], folderController.move);
/**
 * @swagger
 * /v1/directory:
 *   patch:
 *     summary: renames a folder in the specified directory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                  type: string
 *               currentName:
 *                   type: string
 *               newName:
 *                   type: string
 *             required:
 *               - path
 *               - currentName
 *               - newName
 *             example:
 *               path: /
 *               currentName: folderInRoot
 *               newName: folderInRootv2
 *     responses:
 *       204:
 *         description: Folder was renamed
 *       400:
 *        $ref: '#/components/responses/BadRequest'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
DirectoryRouter.patch('/', [buildDrive], folderController.rename);

module.exports = DirectoryRouter;
