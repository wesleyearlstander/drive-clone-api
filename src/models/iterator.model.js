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

  hasNext() {
    return this.index <= this.items?.length
  }

  each(callback) {
    for (let item = this.first(); this.hasNext(); item = this.next()) {
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