const DriveItem = require('./drive-item.model');
const File = require('./file.model');

class Folder extends DriveItem {
  constructor(folder) {
    super(folder?.name);
    this.children = this.map(folder);
  }

  map(directory) {
    const children = [];
    
    directory.files?.forEach(file => {
      children.push(new File(file))
    })

    directory.folders?.forEach(folder => {
      children.push(new Folder(folder))
    })

    return children;
  }

  add(DriveItem) {
    this.children.push(DriveItem);
  }
}

module.exports = Folder;