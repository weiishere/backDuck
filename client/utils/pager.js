
module.exports = class Pager {
  constructor({ pageSize }) {
    this.pageSize = pageSize;
    this.thisPage = 1;
  }
  init({ recordCount, pageSize, thisPage }) {
    this.recordCount = recordCount;
    pageSize && (this.pageSize = pageSize);
    this.pageCount = (recordCount % this.pageSize > 0 ? parseInt(recordCount / this.pageSize) + 1 : parseInt(recordCount / this.pageSize));
    this.thisPage = thisPage === 0 ? 0 : (thisPage || 1);
  }
  go(order) {
    let result = false;
    if (!this.pageCount) {
      //用于还没初始化出
      return true;
    }
    this.thisPageCopy = this.thisPage;
    if (typeof (order) === 'number') {
      if (this.pageCount >= order) {
        this.thisPage = order;
        result = true;
      }
    } else if (order === 'previous') {
      if (this.thisPage !== 1) {
        this.thisPage--;
        result = true;
      }
    } else if (order === 'next') {
      if (this.thisPage < this.pageCount) {
        this.thisPage++;
        result = true;
      }
    }
    else if (order === 'first') {
      if (this.thisPage !== 1) {
        this.thisPage = 1;
        result = true;
      }

    } else if (order === 'end') {
      if (this.thisPage !== this.pageCount) {
        this.thisPage = this.pageCount;
        result = true;
      }
    }
    return result;
  }
  back() {
    this.thisPage = this.thisPageCopy;
    return true;
  }
}