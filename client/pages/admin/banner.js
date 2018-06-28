const util = require('../../utils/util.js');
var config = require('../../config');
module.exports = {

  /**暂没提供async函数支持 */
  // getAsyncList: async function () {
  //   await wx.request({
  //     url: config.bannerApi.list,
  //     data: {},
  //     success: function (res) {
  //       resolve(res);
  //     },
  //     fail: function () {
  //       wx.showToast({ title: "请求错误~" })
  //     }
  //   })
  // },
  getBannerList: function (param) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.bannerApi.list,
        data: param || {},
        success: function (res) {
          resolve(res.data);
        },
        fail: function () {
          wx.showToast({ title: "请求错误~" })
        }
      });
    });
  },
  //**删除banner */
  btuDeleteBanner: function (event) {
    const self = this;
    const _id = event.currentTarget.dataset.id; let index;
    const chooseBanner = util.getObject(this.data.imgUrls, 'id', _id, function (item, i) {
      if (item.id == _id) { index = i; }
    });
    wx.showModal({
      title: '提示',
      content: '你确定要删除banner-(' + chooseBanner.title + ")吗？",
      success: function (res) {
        if (res.confirm) {
          //delete cooseBanner;
          util.singleRequest({
            url: config.bannerApi.remove,
            postData: { id: _id },
            success: () => {
              self.data.imgUrls.splice(index, 1);
              self.setData({
                imgUrls: self.data.imgUrls
              });
            }
          });
        }
      }
    });
  },
  addBanner: function (fromsList) {
    const postData = {};
    fromsList.forEach(item => {
      postData[item.key] = item.value;
    });
    util.singleRequest({
      url: config.bannerApi.insert,
      postData: postData
    });
  },
  updateBanner: function (fromsList) {
    const postData = {};
    fromsList.forEach(item => {
      postData[item.key] = item.value;
    });
    util.singleRequest({
      url: config.bannerApi.update,
      postData: postData
    });
  },
  goEditBanner: function (event) {
    //console.log('goEditBanner');
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../edit/edit?mode=banner&action=edit&key=' + id
    })
  },
  goAddBanner: function () {
    wx.navigateTo({
      url: '../edit/edit?mode=banner&action=add'
    });
  }
}