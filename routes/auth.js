const express = require("express");
const { requiresAuth } = require('express-openid-connect');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     auth:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Auth Token
 *       example:
 *         token: some-private-random-token
 */

 /**
  * @swagger
  * tags:
  *   name: auth
  *   description: auth APIs
  */

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: checks if user is authenticated
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: Logged in OR Logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               items:
 *                 $ref: '#/components/schemas/auth'
 */
 router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

router.get('/callback', (req, res) => {
  res.redirect("/synth");
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;