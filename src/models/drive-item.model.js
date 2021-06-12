class DriveItem {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }

  getName() {
    return this.name;
  }

  add(DriveItem) {
    this.children.push(DriveItem);
  }

  remove(DriveItem) {
    this.children.splice(this.children.findIndex(DriveItem));
  }

  getChild(DriveItem) {
    this.children.find((child) => {
      return child.name === DriveItem.name
    });
  }
}

module.exports = DriveItem;