class Iterator {
  constructor(items) {
    this.index = 0;
    this.items = items;
  }

  first() {
    this.reset();
    return this.next();
  }

  next() {
    return this.items?.[this.index++];
  }

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    this.items = this.items.filter((driveItem) => {
      return driveItem.getName() !== item.getName();
    });
  }

  rename(newDriveItem, item) {
    this.each((child) => {
      if (child.getName() === item.getName()) {
        child.name = newDriveItem.name;
      }
    });
  }

  getChild(item) {
    if (!this.hasNext()) {
      return;
    }
    const child = this.items.find((driveItem) => {
      return driveItem.getName() === item.getName();
    });

    return child;
  }

  hasNext() {
    return this.index <= this.items?.length;
  }

  each(callback) {
    for (
      let item = this.first();
      this.hasNext();
      item = this.next()
    ) {
      if (typeof callback === 'function') {
        callback(item);
      }
    }
  }

  reset() {
    this.index = 0;
  }
}

module.exports = Iterator;
