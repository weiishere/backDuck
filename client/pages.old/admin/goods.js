const util = require('../../utils/util.js');
var config = require('../../config');
const Pager = require('../../utils/pager.js');
module.exports = {
  goodsPager: new Pager({ pageSize: 10 }),
  bindgoodsTypePickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', this.data.menuList[+e.detail.value].id);
    this.getGoodsList({ category: +this.data.menuList[+e.detail.value].id }).then((res) => {
      this.goodsPager.init({ recordCount: res.recordCount });
      this.setData(
        {
          goods: {
            pager: this.goodsPager,
            list: res.list,
            chooseType: e.detail.value,
          },
          goodsSearchStr: ''
        });
    });
  },
  getGoodsList: function (param) {
    let chooseIndex = 0;
    var self = this;

    if (param && param.category) {
      //console.log(_item.type)
      const _item = util.getObject(this.data.menuList, 'id', param.category);
      if (_item.type === 'category') {
      } else if (_item.type === 'all') {
        delete param.category;
        param['orderby'] = 'createDate'
      } else if (_item.type === 'recommend') {
        //需要进行排序
        delete param.category;
        param['orderby'] = 'recommend,desc'
      }
      param['thisPage'] = param.thisPage || this.goodsPager.thisPage;
      param['pageSize'] = param.pageSize || this.goodsPager.pageSize;
    }
    wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.goodsApi.list,
        data: param,
        success: function (res) {
          if (res.data.code === '00001') {
            resolve({
              list: res.data.data.list,
              recordCount: res.data.data.recordCount,
              chooseType: chooseIndex
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
  getGoodsListWithLike: function (param) {
    let chooseIndex = 0;
    var self = this;

    if (param && param.category) {
      //console.log(_item.type)
      const _item = util.getObject(this.data.menuList, 'id', param.category);
      if (_item.type === 'category') {
      } else if (_item.type === 'all') {
        delete param.category;
        param['orderby'] = 'createDate'
      } else if (_item.type === 'recommend') {
        //需要进行排序
        delete param.category;
        param['orderby'] = 'recommend,desc'
      }
      param['thisPage'] = param.thisPage || this.goodsPager.thisPage;
      param['pageSize'] = param.pageSize || this.goodsPager.pageSize;
    }
    wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      wx.request({
        url: config.goodsApi.listWithLike,
        data: param,
        success: function (res) {
          if (res.data.code === '00001') {
            resolve({
              list: res.data.data.list,
              recordCount: res.data.data.recordCount,
              chooseType: chooseIndex
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
  getGoodsByPage: function (e) {
    if (!this.goodsPager.go(e.currentTarget.dataset.order)) { return false; }
    this.getGoodsList({ category: +this.data.menuList[this.data.goods.chooseType].id }).then((res) => {
      this.setData(
        {
          goods: {
            pager: this.goodsPager,
            list: res.list,
            chooseType: this.data.goods.chooseType
          }
        });
    }, () => {
      this.goodsPager.back();
    });
  },
  searchTextInput: function (e) {
    this.setData({
      goodsSearchStr: e.detail.value
    });
  },
  searchgoods: function () {
    this.getGoodsList({ name: this.data.goodsSearchStr }).then((res) => {
      this.goodsPager.init({ recordCount: res.recordCount });
      this.setData(
        {
          goods: {
            pager: this.goodsPager,
            list: res.list,
            chooseType: this.data.goods.chooseType
          }
        });
    });
  },
  addGoods: function (fromsList) {
    const postData = {};
    fromsList.forEach(item => {
      if (key === 'tagSet') {
        //标签设置
      } else {
        postData[item.key] = item.value;
      }
    });
    postData.introImage = postData.introImage && postData.introImage.join(',');
    util.singleRequest({
      url: config.goodsApi.insert,
      postData: postData
    });
  },
  updateGoods: function (fromsList) {
    const postData = {};
    const self = this;
    fromsList.forEach(item => {

      if (item.key === 'tagSet') {
        //标签设置
        let tags = [];

        item.value.forEach(tag => tags.push(tag.id));
        self.updateGoods2Tag(postData.id, tags);
      } else {
        postData[item.key] = item.value;
      }
    });
    postData.introImage = postData.introImage.join(',');
    util.singleRequest({
      url: config.goodsApi.update,
      postData: postData
    });
  },
  btuDeleteGoods: function (event) {
    const self = this;
    const _id = event.currentTarget.dataset.id; let index;
    const chooseGoods = util.getObject(this.data.goods.list, 'id', _id, function (item, i) {
      if (item.id == _id) { index = i; }
    });
    wx.showModal({
      title: '提示',
      content: '你确定要删除-(' + chooseGoods.name + ")吗？",
      success: (res) => {
        if (res.confirm) {
          util.singleRequest({
            url: config.goodsApi.remove,
            postData: { id: _id },
            success: () => {
              this.data.goods.list.splice(index, 1);
              this.setData({
                goods: this.data.goods
              });
            }
          });

        }
      }
    });
  },
  goEditGoods: function (event) {
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../edit/edit?mode=goods&action=edit&key=' + id
    })
  },
  goAddGoods: function () {
    wx.navigateTo({
      url: '../edit/edit?mode=goods&action=add'
    });
  }
}