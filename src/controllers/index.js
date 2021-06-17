const { upload, download, deleteCallback } = require('./file.controller');
const {
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
} = require('./folder.controller');

module.exports = {
  upload,
  download,
  deleteCallback,
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
};
