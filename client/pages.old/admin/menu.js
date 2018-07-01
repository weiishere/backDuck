const util = require('../../utils/util.js');
const config = require('../../config');

module.exports = {
  getMenuList: function (param) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.menuApi.list,
        data: param || {},
        success: function (res) {
          if (res.data.code === '00001') {
            resolve(res.data);
          } else {
            reject && reject();
          }
        },
        fail: function () {
          wx.showToast({ title: "请求错误~" })
        }
      })
    });
  },
  //**删除菜单 */
  btuDeleteMenu: function (event) {
    const self = this;
    const _id = event.currentTarget.dataset.id; let index;
    const chooseMenu = util.getObject(this.data.menuList, 'id', _id, function (item, i) {
      if (item.id == _id) { index = i; }
    });
    wx.showModal({
      title: '提示',
      content: '你确定要删除菜单-(' + chooseMenu.name + ")吗？",
      success: function (res) {
        if (res.confirm) {
          util.singleRequest({
            url: config.menuApi.remove,
            postData: { id: _id },
            success: () => {
              self.data.menuList.splice(index, 1);
              self.setData({
                menuList: self.data.menuList
              });
            }
          });
        }
      }
    });
  },
  addMenu: function (fromsList) {
    const postData = {};
    fromsList.forEach(item => {
      postData[item.key] = item.value;
    });
    util.singleRequest({
      url: config.menuApi.insert,
      postData: postData
    });
  },
  updateMenu: function (fromsList) {
    const postData = {};
    fromsList.forEach(item => {
      postData[item.key] = item.value;
    });
    util.singleRequest({
      url: config.menuApi.update,
      postData: postData
    });
  },
  goEditMenu: function (event) {
    //console.log('goEditBanner');
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../edit/edit?mode=menu&action=edit&key=' + id
    })
  },

  goAddMenu: function () {
    wx.navigateTo({
      url: '../edit/edit?mode=menu&action=add'
    });
  }
}