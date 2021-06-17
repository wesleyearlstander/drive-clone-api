const express = require('express');
const folderRouter = express.Router();
const {
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
} = require('../controllers');
const { buildDrive } = require('../middleware');

/**
 * @swagger
 * tags:
 *   name: folder
 *   description: Folder APIs
 */

/**
 * @swagger
 * definitions:
 *   Folder:
 *     title: Folder
 *     example:
 *       name: documents
 *     type: object
 *     properties:
 *       name:
 *         description: The folder's name
 *         type: string
 *     required:
 *     - name
 *   File:
 *     title: File
 *     example:
 *       name: meme.png
 *     type: object
 *     properties:
 *       name:
 *         description: The folder's name
 *         type: string
 *     required:
 *     - name
 *   Error:
 *     type: object
 *     properties:
 *       errors:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *   MakeFolderObject:
 *     title: MakeFolderObject
 *     example:
 *       path: /
 *       name: folderInRoot
 *     type: object
 *     properties:
 *       path:
 *         type: string
 *       name:
 *         type: string
 *     required:
 *     - path
 *     - name
 *   MoveFolderObject:
 *     title: MoveFolderObject
 *     example:
 *       currentPath: /
 *       newPath: /folderMadeWithDbConnection
 *       name: folderInRoot
 *     type: object
 *     properties:
 *       currentPath:
 *         type: string
 *       newPath:
 *         type: string
 *       name:
 *         type: string
 *     required:
 *     - currentPath
 *     - newPath
 *     - name
 *   RenameFolderObject:
 *     title: RenameFolderObject
 *     example:
 *       path: /
 *       currentName: folderInRoot
 *       newName: folderInRootv2
 *     type: object
 *     properties:
 *       path:
 *         type: string
 *       currentName:
 *         type: string
 *       newName:
 *         type: string
 *     required:
 *     - path
 *     - currentName
 *     - newName
 */

/**
 * @swagger
 * /v1/folders:
 *   post:
 *     summary: Creates a new folder in the specified directory
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/MakeFolderObject'
 *     tags: [folder]
 *     responses:
 *       '201':
 *         description: Folder was created
 *       '400':
 *         description: The request was malformed
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Request body is missing folder's path
 *       '403':
 *         description: User does not have permission to perform requested operation
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: User has insufficient privileges to perform requested action
 *       '404':
 *         description: The resource was not found
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Path or item does not exist
 *       '422':
 *         description: The request was not malformed but there was a semantic issue
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Item in current directory with given name already exists
 */
folderRouter.post('/', [buildDrive], makeFolder);
/**
 * @swagger
 * /v1/folders:
 *   delete:
 *     summary: Removes a folder from the specified directory
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/MakeFolderObject'
 *     tags: [folder]
 *     responses:
 *       '204':
 *         description: Folder was deleted
 *       '400':
 *         description: The request was malformed
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Request body is missing folder's path
 *       '403':
 *         description: User does not have permission to perform requested operation
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             code: '403'
 *             message: User has insufficient privileges to perform requested action
 */
folderRouter.delete('/', [buildDrive], removeFolder);
/**
 * @swagger
 * /v1/folders:
 *   put:
 *     summary: moves a folder between two directories
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/MoveFolderObject'
 *     tags: [folder]
 *     responses:
 *       '201':
 *         description: Folder was moved
 *       '400':
 *         description: The request was malformed
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Request body is missing folder's current path
 *       '403':
 *         description: User does not have permission to perform requested operation
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: User has insufficient privileges to perform requested action
 *       '404':
 *         description: The resource was not found
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Requested drive item does not exist
 */
folderRouter.put('/', [buildDrive], moveFolder);
/**
 * @swagger
 * /v1/folders:
 *   patch:
 *     summary: renames a folder in the specified directory
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       required: true
 *       schema:
 *         $ref: '#/definitions/RenameFolderObject'
 *     tags: [folder]
 *     responses:
 *       '204':
 *         description: Folder was renamed
 *       '400':
 *         description: The request was malformed
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Request body is missing folder's path
 *       '403':
 *         description: User does not have permission to perform requested operation
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             code: '403'
 *             message: User has insufficient privileges to perform requested action
 *       '404':
 *         description: The resource was not found
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             code: '404'
 *             message: Path or item does not exist
 *       '422':
 *         description: The request was not malformed but there was a semantic issue
 *         schema:
 *           $ref: '#/definitions/Error'
 *         examples:
 *           application/json:
 *             message: Item in current directory with given name already exists
 */
folderRouter.patch('/', [buildDrive], renameFolder);

module.exports = folderRouter;
