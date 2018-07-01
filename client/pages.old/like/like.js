const util = require('../../utils/util.js');
const config = require('../../config');
const Pager = require('../../utils/pager.js');

module.exports = {
  data: {
    likeList: [],
    isLikeMore: true,
    isLikeReload: true
  },
  handler: {
    likerPager: new Pager({ pageSize: 5 }),
    likeShow: function () {
      if (this.data.isLikeReload) {
        this.setData({
          likeList: [],
          isLikeMore: true
        });
        this.likerPager.thisPage = 1;
      }
      if (this.data.likeList.length === 0) {
        this.renderLikeList((data) => {
          this.data.isLikeReload = false;
          this.likerPager.init({ recordCount: data.recordCount });
        })
      }
    },
    renderLikeList: function (callback) {
      if (!this.data.isLikeMore) { return; }
      if (this.likerPager.go('next')) {
        this.getLikeList().then((data) => {
          typeof callback === "function" && callback(data);
          const _data = this.data.likeList.concat(data.list);
          this.setData({
            likeList: _data,
            isLikeMore: _data.length == 0 ? false : true
          });
        });
      }
    },
    getLikeList: function () {
      const self = this;
      wx.showLoading('加载中...');
      return new Promise((resolve, reject) => {
        wx.request({
          url: config.likeApi.list,
          data: {
            pageSize: self.likerPager.pageSize,
            thisPage: self.likerPager.thisPage,
            open_id: self.data.userInfo.openId
          },
          success: function (res) {
            if (res.data.code === '00001') {
              resolve({
                list: res.data.data.list,
                recordCount: res.data.data.recordCount
              });
            } else {
              reject();
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
    addLike: function ({ goodsId, open_id, success }) {
      util.singleRequest({
        url: config.likeApi.insert,
        postData: {
          goodsId: goodsId,
          open_id: open_id
        },
        alert: false,
        success: function (data) {
          success && success(data);
        }
      });
    },
    removeLike: function (event) {
      const self = this;
      const likeId = event.currentTarget.dataset.likeId;
      let index;
      const chooseItem = util.getObject(this.data.likeList, 'goodsId', likeId, function (item, i) {
        if (item.goodsId == likeId) { index = i; }
      });
      wx.showModal({
        title: '提示',
        content: '亲，您确定要取消此产品的关注吗？',
        success: function (res) {
          if (res.confirm) {
            util.singleRequest({
              url: config.likeApi.remove,
              postData: {
                id: likeId
              },
              alert: true,
              success: function () {
                self.data.likeList.splice(index, 1);
                self.setData({
                  likeList: self.data.likeList
                });
              }
            });
          }
          self.data.isLikeReload = true;
        }
      });
    }
  }
}