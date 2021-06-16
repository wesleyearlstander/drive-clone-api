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

  format() {
    return {
      name: this.name,
      extension: this.extension,
      location: this.location
    }
  }

}

module.exports = File;