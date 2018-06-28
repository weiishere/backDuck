/*
 * @Author: weisheres.huang 
 * @Date: 2018-01-30 10:36:37 
 * @Last Modified by:   weishere.huang 
 * @Last Modified time: 2018-01-30 10:36:37 
 */
const util = require('../../utils/util.js');
var config = require('../../config');
const goodsManager = require('../admin/goods.js');
const bannerManager = require('../admin/banner.js');
const menuManager = require('../admin/menu.js');
const tagManager = require('../admin/tag.js');
//const Towxml = require('../../utils/towxml/main');


Page({
  data: {
    fromsList: [
      {
        template: 'text',
        key: 'id',
        value: '未设定',
        activeClass: 'imageUploadWrapper',
        title: '主键值',
        disabled: true
      }
    ],
    activeItem: {},
    buttonName: '提交',
    tagViewShow: false,
    tagList: [],
    tagAddStr: ""
  },
  ...goodsManager,
  ...bannerManager,
  ...menuManager,
  ...tagManager,
  initBannerView: function (param) {
    // const towxml = new Towxml();
    // let data = towxml.toJson('<s>sdddddddfff</s>', 'markdown');
    //设置文档显示主题，默认'light'
    //data.theme = 'dark';
    let initData = (item) => {
      return [
        {
          template: 'imageUpload',
          key: 'imageUrl',
          activeClass: 'imageUploadWrapper',
          title: 'banner主图',
          value: item && item.imageUrl
        },
        {
          template: 'input',
          key: 'title',
          title: 'banner主题标题',
          value: item && item.title
        },
        {
          template: 'freeText',
          key: 'article',
          title: '主内容',
          value: item && item.article
        }
      ]
    }
    param.action === 'edit' && wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      if (param.action === 'edit') {
        this.getBannerList({ id: param.key }).then((data) => {
          wx.hideLoading();
          resolve(initData(data.data[0]));
        }, () => { wx.hideLoading(); reject(); });
      } else {
        resolve(initData());
      }
    });
  },
  initMenuView: function (param) {
    let initData = (item) => {
      let result = [
        {
          template: 'input',
          key: 'name',
          title: '菜单名称',
          value: item && item.name
        },
        {
          template: 'input',
          key: 'icon',
          title: '图标名称',
          value: item && item.icon
        },
        {
          template: 'select',
          key: 'type',
          title: '类别特征',
          selectList: [
            { value: 'category', name: 'category(用于产品类型)' },
            { value: 'all', name: 'all(按照最新更新时间排列)' },
            { value: 'recommend', name: 'recommend(推荐列表)' },
            { value: 'hide', name: 'hide(隐藏菜单)' }
          ],
          changeBack: function (fromList) { },
          chooseIndex: 0,
          value: item ? item.type : 'category'
        }
      ]
      //处理选择器picker的显示Index，因为只是处理了value还不够，虽然不影响功能，但是下拉初始显示可能不正确
      if (item) {
        let _item = util.getObject(result, 'key', 'type');
        let index = util.getObject(_item.selectList, 'value', item.type);
        _item.chooseIndex = _item.selectList.indexOf(index);
      }
      return result;
    }
    param.action === 'edit' && wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      if (param.action === 'edit') {
        this.getMenuList({ id: param.key }).then((data) => {
          wx.hideLoading();
          resolve(initData(data.data[0]));
        }, () => { wx.hideLoading(); reject(); });
      } else {
        resolve(initData());
      }
    });
  },
  initGoodsView: function (param) {
    let initData = (item) => {
      //获取并初始化menu列表Ks
      Promise.all([this.getMenuList(), this.getTagsByGoodsId(item ? item.id : 0)]).then((value) => {
        const data = value[0];
        let _menuList = util.getObject(this.data.fromsList, "key", 'category');
        data.data.forEach((item) => {
          _menuList.selectList.push({ value: item.id, name: item.name });
        });
        if (item) {
          //处理类别下拉选项
          _menuList.chooseIndex = +_menuList.selectList.indexOf(util.getObject(_menuList.selectList, 'value', +item.category));
          let _tagList = util.getObject(this.data.fromsList, "key", 'tagSet');
          _tagList.value = value[1].data;
        } else {
          _menuList.value = _menuList.selectList[0].value
        }

        this.setData({
          fromsList: this.data.fromsList
        });
      });
      let result = [
        {
          template: 'imageUpload',
          key: 'mainImage',
          activeClass: 'imageUploadWrapper',
          title: '产品主图',
          value: item && item.mainImage
        },
        {
          template: 'input',
          key: 'name',
          title: '主标题',
          value: item && item.name
        },
        {
          template: 'input',
          key: 'remark',
          title: '备注',
          value: item && item.remark
        },
        {
          template: 'input',
          key: 'recommend',
          type: 'number',
          title: '推荐值(值越大越靠前)',
          value: item && item.recommend
        },
        {
          template: 'trigger',
          key: 'tagSet',
          title: '产品标签(搜索关键字/特征)',
          showDesc: '标签设置',
          activeClass: 'tagChooseButton',
          value: []
        },
        {
          template: 'input',
          key: 'price',
          title: '价格',
          value: item && item.price
        },
        {
          template: 'select',
          key: 'unit',
          title: '单位',
          selectList: [
            { value: '件', name: '-件-' },
            { value: '个', name: '-个-' },
            { value: '瓶', name: '-瓶-' },
            { value: '罐', name: '-罐-' },
            { value: '箱', name: '-箱-' },
            { value: '套', name: '-套-' },
            { value: '对', name: '-对-' },
            { value: '副', name: '-副-' }
          ],
          chooseIndex: 0,
          value: item ? item.unit : '件'
        },
        {
          template: 'select',
          key: 'category',
          title: '类别',
          selectList: [],
          chooseIndex: 0,
          //value: item ? item.category : menuSelectList[0].name
        },
        {
          template: 'imageUpload',
          key: 'introImage',
          activeClass: 'imageUploadWrapper',
          title: '图片介绍(最多5张)',
          maxLength: 5,
          value: item && (item.introImage ? (item.introImage.split(',')) : [])
        },
        {
          template: 'freeText',
          key: 'introduction',
          title: '主内容',
          value: item && item.introduction
        }
      ]
      //处理选择器picker的显示Index，因为只是处理了value还不够，虽然不影响功能，但是下拉初始显示可能不正确
      if (item) {
        let _unitItem = util.getObject(result, 'key', 'unit');
        _unitItem.chooseIndex = +_unitItem.selectList.indexOf(util.getObject(_unitItem.selectList, 'value', item.unit));
      }
      return result;
    }
    param.action === 'edit' && wx.showLoading('加载中...');
    return new Promise((resolve, reject) => {
      if (param.action === 'edit') {
        this.getGoodsList({ id: param.key }).then((data) => {
          wx.hideLoading();
          resolve(initData(data.list[0]));
        }, () => { wx.hideLoading(); reject(); });
      } else {
        resolve(initData());
      }
    });
  },
  pickerChange: function (e) {
    //const goodstype = util.getObject(this.data.goodsType, 'id', e.detail.value);
    //if (!this.data.activeItem || e.currentTarget.dataset.key !== this.data.activeItem.key) {
    this.data.activeItem = util.getObject(this.data.fromsList, "key", e.currentTarget.dataset.key);
    //}
    this.data.activeItem.chooseIndex = e.detail.value;
    this.data.activeItem.value = this.data.activeItem.selectList[this.data.activeItem.chooseIndex].value;
    // util.getObject(this.data.fromsList, "key", "unit", function (item, i) {
    //   if (item.key === 'unit') {
    //     item.chooseIndex = e.detail.value;
    //   }
    // })
    this.data.activeItem.changeBack && this.data.activeItem.changeBack(this.data.fromsList);
    this.setData({
      fromsList: this.data.fromsList
    })
  },
  setActiveItem: function (key) {
    if (e.detail.key !== this.data.activeItem.key) {
      util.getObject(this.data.fromsList, "key", e.detail.key, (item, i) => {
        if (item.key === e.currentTarget.dataset.key) {
          this.data.activeItem.item = item;
        }
      });
    }
  },
  textInput: function (e) {
    if (!this.data.activeItem || e.currentTarget.dataset.key !== this.data.activeItem.key) {
      this.data.activeItem = util.getObject(this.data.fromsList, "key", e.currentTarget.dataset.key);
    }
    this.data.activeItem.value = e.detail.value;
  },
  doUpload: function (e) {
    // 选择图片
    const self = this;
    self.data.activeItem = util.getObject(self.data.fromsList, "key", e.currentTarget.dataset.key);//这里必须再获取一次，待探究（是否是赋值给了self呢）

    wx.chooseImage({
      count: e.currentTarget.dataset.maxLength,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths;
        if (self.data.activeItem.value instanceof Array && self.data.activeItem.value.length + filePath.length >= e.currentTarget.dataset.maxLength) {
          util.showModel('最多上传' + e.currentTarget.dataset.maxLength + '张图片');
          return;
        }
        util.showBusy('正在上传')
        filePath.forEach(item => {
          // 上传图片
          wx.uploadFile({
            url: config.service.uploadUrl,
            filePath: item,
            name: 'file',
            success: function (res) {
              res = JSON.parse(res.data);
              if (+e.currentTarget.dataset.maxLength === 1) {
                util.showSuccess('上传图片成功');
                self.data.activeItem.value = res.data.imgUrl;
              } else {
                //第二次获取activeItem时指针不指向fromsList了，很奇怪，这里每次都重新获取一次
                self.data.activeItem = util.getObject(self.data.fromsList, "key", e.currentTarget.dataset.key);
                if (!self.data.activeItem.value) self.data.activeItem.value = [];
                self.data.activeItem.value.push(res.data.imgUrl);
                if (self.data.activeItem.value.length === filePath.length) {
                  util.showSuccess('成功上传' + filePath.length + '张图片');
                  self.data.activeItem.title = '图片介绍(还可以上传' + (e.currentTarget.dataset.maxLength - self.data.activeItem.value.length) + '张)'
                }
              }
              self.setData({
                fromsList: self.data.fromsList
              });
            },
            fail: function (e) {
              util.showModel('上传图片失败');
            }
          })
        });
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },
  trigger: function (e) {
    const self = this;
    self.data.activeItem = util.getObject(self.data.fromsList, "key", e.currentTarget.dataset.key);
    if (e.currentTarget.dataset.key === 'tagSet') {
      if (self.data.tagList.length === 0) {
        this.getTagsList({}).then((data) => {
          data.data.forEach((item) => {
            self.data.activeItem.value.forEach((item2) => {
              if (item.id === item2.id) {
                item.active = true;
              }
            })
          });
          self.data.activeItem.value = data.data;
          self.setData({
            tagViewShow: true,
            tagList: data.data
          });
        });
      } else {
        self.setData({
          tagViewShow: true
        });
      }
    }
  },
  tagTextInput: function (e) {
    this.setData({
      tagAddStr: e.detail.value
    });
  },
  tagSubmit: function (e) {
    const type = e.currentTarget.dataset.type;
    let chooseTag = [];
    if (type === 'submit') {
      this.data.tagList.forEach((item) => {
        if (item.active) {
          chooseTag.push(item);
        }
      });
      let _tagList = util.getObject(this.data.fromsList, "key", 'tagSet');
      _tagList.value = chooseTag;
      this.setData({
        tagViewShow: false,
        fromsList: this.data.fromsList
      });
    } else {
      this.setData({
        tagViewShow: false
      });
    }

  },
  btuDeleteImage: function (e) {
    const self = this;
    wx.showModal({
      title: '提示',
      content: '你确定要删除此图片吗？此操作不可恢复',
      success: function (res) {
        if (res.confirm) {
          const _src = e.currentTarget.dataset.src;
          const _item = util.getObject(self.data.fromsList, "key", e.currentTarget.dataset.key);
          _item.value.remove(_src);
          _item.title = '图片介绍(还可以上传' + (_item.maxLength - _item.value.length) + '张)'
          self.setData({
            fromsList: self.data.fromsList
          });
        }
      }
    });

  },
  submit: function () {
    // this.data.fromsList.forEach((item) => {
    //   if (item.template === 'trigger') {

    //   }
    // });
    if (this.data.action === 'add') {
      switch (this.data.mode) {
        case 'banner':
          this.addBanner(this.data.fromsList);
          break;
        case 'menu':
          this.addMenu(this.data.fromsList);
          break;
        case 'goods':
          this.addGoods(this.data.fromsList);
          break;
      }
    } else if (this.data.action === 'edit') {
      switch (this.data.mode) {
        case 'banner':
          this.updateBanner(this.data.fromsList);
          break;
        case 'menu':
          this.updateMenu(this.data.fromsList);
          break;
        case 'goods':
          this.updateGoods(this.data.fromsList);
          break;
      }
    }
  },
  previewImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl,
      urls: [e.currentTarget.dataset.imgurl]
    })
  },
  onLoad: function ({ mode, action, key }) {
    const _init = (_flist) => {
      if (key) this.data.fromsList[0].value = key;
      this.setData({
        mode: mode,
        action: action,
        key: key,
        fromsList: action === "edit" ? this.data.fromsList.concat(_flist) : this.data.fromsList = _flist,
        buttonName: action === "edit" ? "提交更新" : "确认新增"
      });
    }
    wx.setNavigationBarTitle({
      title: mode + '-' + (action === 'edit' ? '编辑' : '新增')
    });
    switch (mode) {
      case 'banner':
        this.initBannerView({ action, key }).then((data) => { _init(data); });
        break;
      case 'menu':
        this.initMenuView({ action, key }).then((data) => { _init(data); });
        break;
      case 'goods':
        this.initGoodsView({ action, key }).then((data) => { _init(data); });
        break;
    }

  }
});