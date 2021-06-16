const DriveItem = require('./drive-item.model');
const Iterator = require('./iterator.model');
const File = require('./file.model');

class Folder extends DriveItem {
  constructor(folder) {
    super(folder?.name);
    this.iterator = new Iterator(this.map(folder));
  }

  map(directory) {
    const children = [];

    directory.files?.forEach?.((file) => {
      children.push(new File(file));
    });

    directory.folders?.forEach?.((folder) => {
      children.push(new Folder(folder));
    });

    return children;
  }

  getIterator() {
    return this.iterator;
  }

  peformActionAtPath(paths, action, params) {
    let found = false;

    const cleanPaths = paths.filter((path) => !!path);

    if (cleanPaths.length === 0) {
      action(this, ...params);
      found = true;
    }

    this.iterator.each((item) => {
      if (item.getName() === cleanPaths[0]) {
        cleanPaths.shift();
        found = item.peformActionAtPath(cleanPaths, action, params);
      }
    });

    return found;
  }

  add(path, driveItem) {
    const paths = path.split('/');

    return this.peformActionAtPath(
      paths,
      (item, driveItem) => {
        item.iterator.add(driveItem);
      },
      [driveItem]
    );
  }

  remove(path, driveItem) {
    const paths = path.split('/');

    return this.peformActionAtPath(
      paths,
      (item, driveItem) => {
        item.iterator.remove(driveItem);
      },
      [driveItem]
    );
  }

  rename(path, newName, driveItem) {
    const paths = path.split('/');

    return this.peformActionAtPath(
      paths,
      (item, newName, driveItem) => {
        item.iterator.rename(newName, driveItem);
      },
      [newName, driveItem]
    );
  }

  move(currentPath, newPath, driveItem) {
    const paths = currentPath.split('/');
    let existingDriveItem = null;

    this.peformActionAtPath(
      paths,
      (item, driveItem) => {
        existingDriveItem = item.iterator.getChild(driveItem);
      },
      [driveItem]
    );

    const added = this.add(newPath, existingDriveItem);

    if (added) {
      const removed = this.remove(currentPath, existingDriveItem);

      return removed;
    }

    return added;
  }

  format() {
    const mongoDoc = {
      files: [],
      folders: [],
    };

    this.iterator.each((child) => {
      if (child?.getIterator?.() ?? false) {
        mongoDoc.folders.push(child.format());
      } else {
        mongoDoc.files.push(child.format());
      }
    });

    if (this.name) {
      mongoDoc.name = this.name;
    }

    return mongoDoc;
  }
}

module.exports = Folder;
