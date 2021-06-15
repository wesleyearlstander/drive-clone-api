const File = require("./file.model");
const Folder = require("./folder.model");

class Drive {
  constructor(fileTree) {
    this.fileTree = fileTree;
  }

  map(directory) {
    const children = [];
    
    directory.files?.forEach(file => {
      children.push(new File(file))
    })

    directory.folders?.forEach(folder => {
      children.push(new Folder(folder))
    })
  }

}

module.exports = Drive;