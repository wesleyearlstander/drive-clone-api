const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * tags:
 *   name: user
 *   description: User APIs
 */

/**
 * @swagger
 * /v1/users/profile:
 *   get:
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
      message: 'Unauthorized to perform action',
    });
  }
});

module.exports = router;
