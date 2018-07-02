const util = require('../../utils/util.js');
const Pager = require('../../utils/pager.js');
const config = require('../../config');
const searchManager = require('../search/search.js');
const { getMenuList } = require('../admin/menu.js');
const messagerManager = require('../messager/messager.js');
const likeManager = require('../like/like.js');
const goodsManager = require('../admin/goods.js');
const aboutManager = require('../about/about.js');
const { getBannerList } = require('../admin/setDatabanner');
const defaultPgeSize = 10;

Page({
  data: {
    menuList: [],
    goodsList: [],
    imgUrls: [],
    logged: false,
    userInfo: {},
    sliderSet: {
      autoplay: true,
      circular: true
    },
    activeTab: 'home',
    ...searchManager.data,
    ...messagerManager.data,
    ...likeManager.data,
    ...aboutManager.data
  },
  ...searchManager.handler,
  ...messagerManager.handler,
  ...likeManager.handler,
  ...aboutManager.handler,
  ...goodsManager,

  chooseMenu: function (event) {
    let chooseMenuId, chooseMenu;
    let isLoadMore = event.currentTarget.dataset.id ? false : true;
    if (!isLoadMore) {
      chooseMenuId = event.currentTarget.dataset.id;
      chooseMenu = util.getObject(this.data.menuList, 'id', chooseMenuId, (item, i) => {
        item['isActive'] = (item.id === chooseMenuId);
      });
    } else {
      chooseMenuId = util.getObject(this.data.menuList, 'isActive', true).id;
      chooseMenu = util.getObject(this.data.menuList, 'id', chooseMenuId);
    }
    let _goodsList = util.getObject(this.data.goodsList, 'category', chooseMenuId);
    if (_goodsList && !isLoadMore) {
      //有event说明是重新选择了菜单
      this.setData({
        showGoodList: _goodsList.goods,
        showMenu: chooseMenu,
        menuList: this.data.menuList,
        isMore: _goodsList.isMore
      });
    } else {
      //第一次加载数据或者更多
      const _goodsBundle = util.getObject(this.data.goodsList, 'category', chooseMenuId);
      if (_goodsBundle && !_goodsBundle.isMore) {
        return;
      }
      //this.getGoodsList({
      this.getGoodsListWithLike({
        category: chooseMenuId,
        thisPage: !isLoadMore ? 1 : ++_goodsList.pager.thisPage,
        pageSize: defaultPgeSize,
        open_id: this.data.userInfo.openId
      }).then(data => {
        let result = this.joinGoodsList(chooseMenuId, data.list, data.recordCount);
        this.setData({
          showGoodList: result.goods,
          showMenu: chooseMenu,
          menuList: this.data.menuList,
          isMore: result.isMore
        });
      });
    }
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../details/details'
    })
  },
  footerChange: function (event) {
    this.setData({
      activeTab: event.currentTarget.dataset.key,
      searchisIn: false
    });
    this[event.currentTarget.dataset.key + 'Show']();
    setTimeout(() => {
      this.setData({
        searchVislble: false,
        tagList: []
      });
    }, 400);
  },
  likeHandler: function (event) {
    const self = this;
    if (this["isDoing"]) {
      return;
    }
    this["isDoing"] = true;
    const goodsId = event.currentTarget.dataset.id;
    const isLike = event.currentTarget.dataset.isLike;
    let goodsItem = util.getObject(this.data.showGoodList, 'id', goodsId);
    this[isLike ? "removeLike" : "addLike"]({
      goodsId: goodsId,
      open_id: this.data.userInfo.openId,
      success: function (data) {
        self.isDoing = false;
        if (isLike) {
          goodsItem.likeId = null;
        } else {
          goodsItem.likeId = data.data[0];
        }
        self.setData({
          showGoodList: self.data.showGoodList
        });
      }
    });
  },
  homeShow: function () { },
  userLogin: function (callback) {
    if (this.data.logged) return
    util.showBusy('正在登录')
    let that = this
    const qcloud = require('../../vendor/wafer2-client-sdk/index');
    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          });
          console.log(result);
          callback && callback();
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              console.log(result.data.data);
              callback && callback();
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },
      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  joinGoodsList: function (category, goodsList, recordCount) {
    let goodsBundle = util.getObject(this.data.goodsList, 'category', category);
    if (!goodsBundle) {
      let _obj = {
        category: category,
        goods: goodsList,
        pager: new Pager({ pageSize: defaultPgeSize }),
        isMore: goodsList.length === recordCount ? false : true
      }
      this.data.goodsList.push(_obj);
      return _obj;
    } else {
      let newArray = goodsBundle.goods.concat(...goodsList);
      goodsBundle.goods = newArray;
      goodsBundle.isMore = newArray.length === recordCount ? false : true;
      return goodsBundle;
    }
  },
  onLoad: function () {
    const localTest = config.localTest;
    if (localTest) {
      this.setData({
        userInfo: config.testUserInfo,
        logged: true
      });
      getMenuList().then(menuData => {
        let menuList = menuData.data;
        menuList[0]['isActive'] = true;
        this.setData({
          menuList: menuList
        });
        Promise.all([getBannerList(), this.getGoodsListWithLike({
          category: menuList[0].id,
          thisPage: 1,
          pageSize: defaultPgeSize,
          open_id: this.data.userInfo.openId
        })]).then(values => {
          let result = this.joinGoodsList(menuList[0].id, values[1].list, values[1].recordCount);
          result.pager.init({ recordCount: values[1].recordCount });
          this.setData({
            showGoodList: values[1].list,
            showMenu: menuList[0],
            imgUrls: values[0].data,
            isMore: result.isMore
          });
        });
      });
    } else {
      this.userLogin(() => {
        getMenuList().then(menuData => {
          let menuList = menuData.data;
          menuList[0]['isActive'] = true;
          this.setData({
            menuList: menuList
          });
          Promise.all([getBannerList(), this.getGoodsListWithLike({
            category: menuList[0].id,
            thisPage: 1,
            pageSize: defaultPgeSize,
            open_id: this.data.userInfo.openId
          })]).then(values => {
            let result = this.joinGoodsList(menuList[0].id, values[1].list, values[1].recordCount);
            result.pager.init({ recordCount: values[1].recordCount });
            this.setData({
              showGoodList: values[1].list,
              showMenu: menuList[0],
              imgUrls: values[0].data,
              isMore: result.isMore
            });
          });
        });
      });
    }

  }
});