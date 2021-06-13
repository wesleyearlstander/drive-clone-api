const express = require('express');
const fileRouter = express.Router();
const { upload } = require('../controllers/file.controller');

// TODO: Mohammed
fileRouter.post('/upload/file', upload);

// TODO: Mohammed
fileRouter.get('/download', (req, res) => {
});

// TODO: Governor
fileRouter.put('/move', (req, res) => {
});

// TODO: Governor
fileRouter.patch('/rename', (req, res) => {
});

// TODO: Governor
fileRouter.delete('/delete', (req, res) => {
});

module.exports = fileRouter;