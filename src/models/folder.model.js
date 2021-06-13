const DriveItem = require('./drive-item.model');

class Folder extends DriveItem {
  constructor(name) {
    super(name);
    this.children = []
  }

  add(DriveItem) {
    this.children.push(DriveItem);
  }
}

module.exports = Folder;