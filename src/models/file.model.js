const DriveItem = require('./drive-item.model');

class File extends DriveItem {
  constructor({ name, _id }) {
    super(name);
    this.id = _id;
  }

  format() {
    return {
      name: this.name,
      _id: this._id,
    };
  }
}

module.exports = File;
