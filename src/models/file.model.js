const DriveItem = require('./drive-item.model');

class File extends DriveItem {
  constructor({name, extension, location}) {
    super(name, null);
    this.extension = extension;
    this.location = location;
  }

}

module.exports = File;