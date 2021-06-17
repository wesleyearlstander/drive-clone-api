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
    let found = {
      ok: false,
      error: 'Path or item does not exist',
      code: 404,
    };

    const cleanPaths = paths.filter((path) => !!path);

    if (cleanPaths.length === 0) {
      return (found = action(this, ...params));
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
        if (item.iterator.getChild(driveItem)) {
          return {
            ok: false,
            error: {
              message:
                'Item in current directory with given name already exists',
            },
            code: 422,
          };
        }
        item.iterator.add(driveItem);
        return {
          ok: true,
          code: 201,
        };
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
        return {
          ok: true,
          code: 204,
        };
      },
      [driveItem]
    );
  }

  rename(path, newDriveItem, driveItem) {
    const paths = path.split('/');

    return this.peformActionAtPath(
      paths,
      (item, newDriveItem, driveItem) => {
        if (item.iterator.getChild(newDriveItem)) {
          return {
            ok: false,
            error:
              'Item in current directory with given name already exists',
            code: 422,
          };
        }
        item.iterator.rename(newDriveItem, driveItem);
        return {
          ok: true,
          code: 204,
        };
      },
      [newDriveItem, driveItem]
    );
  }

  move(currentPath, newPath, driveItem) {
    const paths = currentPath.split('/');
    let existingDriveItem = null;

    this.peformActionAtPath(
      paths,
      (item, driveItem) => {
        existingDriveItem = item.iterator.getChild(driveItem);
        return {
          ok: true,
          code: 204,
        };
      },
      [driveItem]
    );

    if (!existingDriveItem) {
      return {
        ok: false,
        error: 'Requested drive item does not exist',
        code: 404,
      };
    }

    const added = this.add(newPath, existingDriveItem);

    if (added.ok) {
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
