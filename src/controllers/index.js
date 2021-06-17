const {
  upload,
  download,
  deleteCallback,
  renameFile,
  moveFile,
} = require('./file.controller');

const {
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
  getChildren,
} = require('./folder.controller');

module.exports = {
  upload,
  download,
  deleteCallback,
  renameFile,
  moveFile,
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
  getChildren,
};
