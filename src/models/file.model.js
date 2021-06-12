const DriveItem = require("./drive-item.model");

class File extends DriveItem {
  constructor(name, extension) {
    super(name, null);
    this.extension = extension;
  }

}

module.exports = File;