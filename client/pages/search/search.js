const util = require('../../utils/util.js');
const { getTagsList} = require('../admin/tag.js');

module.exports = {
  data: {
    searchVislble: false,
    searchisIn: false,
    tagList: [],
    tagList_copy: []
  },
  handler: {
    searchOrder: function (event) {
      const order = event.currentTarget.dataset.order;
      if (order === 'back') {
        this.setData({
          searchisIn: false
        });
        setTimeout(() => {
          this.setData({
            searchVislble: false,
            tagList: []
          });
        }, 400);
      }
    },
    goSearch: function () {
      this.setData({
        searchVislble: true
      });
      setTimeout(() => {
        this.setData({
          searchisIn: true
        });
      }, 10);
      setTimeout(() => {
        if (this.data.tagList_copy.length === 0) {
          getTagsList({}).then((data) => {
            this.data.tagList_copy = data.data;
            this.setData({
              tagList: data.data
            });
          });
        } else {
          this.setData({
            tagList: util.clone(this.data.tagList_copy)
          });
        }
      }, 400);
    },
    
  }
}