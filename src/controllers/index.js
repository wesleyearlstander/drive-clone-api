const { upload, download } = require('./file.controller');
const {
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
} = require('./folder.controller');

module.exports = {
  upload,
  download,
  makeFolder,
  renameFolder,
  moveFolder,
  removeFolder,
};
