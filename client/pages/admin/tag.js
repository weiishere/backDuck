const util = require('../../utils/util.js');
var config = require('../../config');

module.exports = {
  getTagsList: ({ ids }) => {
    wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.tagApi.list,
        data: ids ? { ids: ids.join(',') } : {},
        success: function (res) {
          if (res.data.code === '00001') {
            resolve(res.data);
          } else {
            reject && reject();
          }
        },
        fail: function () {
          wx.showToast({ title: "请求错误~" })
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    });
  },
  chooseTag: function (e) {
    const id = e.currentTarget.dataset.id;
    this.data.tagList.forEach((item) => {
      if (item.id === id) {
        item['active'] = item['active'] == true ? false : true;
      }
    });
    this.setData({
      tagList: this.data.tagList
    });
  },
  deleteTag: function (event) {
    const self = this;
    const _id = event.currentTarget.dataset.id; let index;
    util.getObject(this.data.tagList, 'id', _id, function (item, i) {
      if (item.id == _id) { index = i; }
    });
    wx.showModal({
      title: '提示',
      content: '你确定要删除此TAG信息-(' + event.currentTarget.dataset.name + ")吗？",
      success: function (res) {
        if (res.confirm) {
          util.singleRequest({
            url: config.tagApi.remove,
            postData: { id: _id },
            success: () => {
              self.data.tagList.splice(index, 1);
              self.setData({
                tagList: self.data.tagList
              });
            }
          });
        }
      }
    });
  },
  addTag: function (e) {
    const self = this;
    util.singleRequest({
      url: config.tagApi.insert,
      postData: { name: self.data.tagAddStr },
      success: function (params) {
        self.data.activeItem = util.getObject(self.data.fromsList, "key", 'tagSet');
        self.getTagsList({}).then((data) => {
          data.data.forEach((item) => {
            self.data.activeItem.value.forEach((item2) => {
              if (item.id === item2.id && item2.active) {
                item.active = true;
              }
            })
          });
          self.setData({
            tagAddStr: '',
            tagList: data.data
          });
        });
      }
    });
  },
  getTagsByGoodsId: function (goodsId) {
    wx.showLoading('加载中...');
    const self = this;
    return new Promise((resolve, reject) => {
      if (goodsId !== 0) {
        wx.request({
          url: config.goods2tagApi.list,
          data: { goodsId: goodsId },
          success: function (res) {
            if (res.data.data.length === 0) {
              resolve({ data: [] });
            } else {
              let ids = [];
              res.data.data.forEach((item) => {
                ids.push(item.tagId);
              });

              self.getTagsList({ ids: ids }).then((data) => {
                resolve(data);
              }, () => {
                reject && reject();
              });
            }
            // if (res.data.code === '00001') {
            //     resolve(res.data);
            // } else {
            //     reject && reject();
            // }
          },
          fail: function () {
            wx.showToast({ title: "请求错误~" })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      } else {
        wx.hideLoading();
        resolve({ data: [] })
      }

    });
  },
  updateGoods2Tag: (goodsId, tagIds, callback) => {
    const self = this;
    util.singleRequest({
      url: config.goods2tagApi.update,
      postData: { goodsId: goodsId, tagIds: tagIds.join(',') },
      success: function (params) {
        callback && callback();
      }
    });
  }
}