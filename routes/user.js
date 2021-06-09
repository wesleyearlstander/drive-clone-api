const express = require("express");
const { requiresAuth } = require('express-openid-connect');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     jwt:
 *       type: object
 *       required:
 *         - accessToken
 *       properties:
 *         accessToken:
 *           type: string
 *           description: jwtAccessToken
 *       example:
 *         accessToken: eygakdfjakafda
 */

/**
 * @swagger
 * tags:
 *   name: user
 *   description: User APIs
 */




/**
 * @swagger
 * /user/login:
 *   get:
 *     summary: user login with userId and password
 *     tags: [user]
 *     responses:
 *       200:
 *         description: login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/jwt'
 *       401:
 *         description: login failed
 *
 */
router.get('/login', (req, res) => {
});

/**
 * @swagger
 * /user/logout:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: user logout
 *     tags: [user]
 *     responses:
 *       200:
 *         description: logout success
 *       500:
 *         description: logout failed
 *
 */
router.get('/logout', (req, res) => {
});

/**
 * @swagger
 * /user/profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: returns user profile
 *     tags: [user]
 *     responses:
 *       200:
 *         description: request success
 *       500:
 *         description: failed to get user profile
 *
 */
router.get('/profile', requiresAuth(), (req, res) => {
});

module.exports = router;