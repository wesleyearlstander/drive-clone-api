const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');

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
 * /user/profile:
 *   get:
 *     security:
 *       - Auth0:
 *          - openid
 *     summary: returns user profile
 *     tags: [user]
 *     responses:
 *       200:
 *         description: request success
 *       500:
 *         description: failed to get user profile
 *
 */
router.get('/profile', (req, res) => {
    if (req.oidc.user) {
        res.status = StatusCodes.OK;
        res.json(req.oidc.user);
    } else {
        res.status = StatusCodes.UNAUTHORIZED;
        res.json({
            message: 'Unauthorized to perform action'
        });
    }
});

module.exports = router;