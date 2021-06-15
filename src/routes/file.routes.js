const express = require("express");
const FileRouter = express.Router();
const { upload } = require("../controllers/file.controller");

// TODO: Mohammed
FileRouter.post('/upload/file', upload);

// TODO: Mohammed
FileRouter.get('/download', (req, res) => {
});

// TODO: Governor
FileRouter.put('/move', (req, res) => {
});

// TODO: Governor
FileRouter.patch('/rename', (req, res) => {
});

// TODO: Governor
FileRouter.delete('/delete', (req, res) => {
});

module.exports = FileRouter;