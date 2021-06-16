const DriveItem = require('./drive-item.model');

class File extends DriveItem {
  constructor({name, extension, location}) {
    super(name);
    this.extension = extension;
    this.location = location;
  }

  getName() {
    return `${this.name}.${this.extension}`;
  }

}

module.exports = File;