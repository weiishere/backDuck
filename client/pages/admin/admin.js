const util = require('../../utils/util.js');
const goodsManager = require('./goods.js');
const bannerManager = require('./banner.js');
const menuManager = require('./menu.js');
Page({
  data: {
    tabList: [
      {
        name: 'Goods',
        code: 'goods',
        desc: '商品管理',
        icon: 'icon-goods',
        isActive: true
      },
      {
        name: 'Banner',
        code: 'banner',
        desc: '轮播图片信息管理',
        icon: 'icon-banner_set',

      },
      {
        name: 'Menu',
        code: 'menu',
        desc: '商品类别管理',
        icon: 'icon-menu'
      },
      {
        name: 'Config',
        code: 'config',
        desc: '基本配置',
        icon: 'icon-config'
      }
    ],
    menuList: [
      // {
      //   id: 1,
      //   menuId: 1,
      //   name: '店主推荐',
      //   icon: 'home',
      //   // iconColor:'F01B2D'
      //   isActive: true
      // }
    ],
    imgUrls: [
      // {
      //   id: 1,
      //   url: 'https://gss3.bdstatic.com/70cFsjip0QIZ8tyhnq/img/iknow/aazdpinpai.png',
      //   title: '好妈妈，从这里坐起，你需要知道的育儿知识'
      // }
    ],
    goods: {
      pager: {
        thisPage: 1,
        pageSize: 5,
        recodeCount: 133
      },
      list: [
        {
          id: '114',
          name: '4爱他美Aptamil 儿童配方奶粉4段(36-72个月适用)800g',
          category: 4,
          image: 'https://img10.360buyimg.com/n1/jfs/t5632/225/2855201961/384545/197cc50/59350734Nd49bd2f6.jpg',
          price: '￥180',
          unit: '桶',
          remark: '德国原装进口，接受整箱订购：8*175',
          desc: ''
        }
      ],
      chooseType: 0
    },
    config: {
      storeName: '秀容的精品小店',
      themeColor: '#ccf',
      welcome: '欢迎来到精品小店，本店新上***，欢迎了解并微信我哦~'
    }
  },

  //**切换tab */
  changeTab: function (event) {
    const code = event.currentTarget.dataset.code;
    const chooseTab = util.getObject(this.data.tabList, 'code', code, function (item) {
      if (item.code !== code) {
        item.isActive = false;
      } else {
        item.isActive = true;
      }
    });
    this.setData({
      tabList: this.data.tabList,
      showType: chooseTab
    })
  },
  ...menuManager,
  ...bannerManager,
  ...goodsManager,
  onLoad: function (option) {
    //console.log(this);
    //console.log(option.query)


  },
  onShow: function () {
    const self = this;
    wx.showLoading('加载中...');
    const _showType = util.getObject(self.data.tabList, 'isActive', true);
    this.getMenuList().then((data) => {
      // let _item = util.getObject(data.data, 'id', data.data[0].id);
      // let chooseIndex = data.data(_item);
      this.setData({
        menuList: data.data,
      });
      //如果有搜索的状态，优先加载搜索的数据
      const query = this.data.goodsSearchStr ? { name: this.data.goodsSearchStr } : { category: +data.data[0].id };
      Promise.all([this.getBannerList(), this.getGoodsList(query)]).then(values => {
        self.goodsPager.init({ recordCount: values[1].recordCount });
        this.setData({
          showType: _showType,
          imgUrls: values[0].data,
          goods: {
            pager: self.goodsPager,
            list: values[1].list,
            chooseType: values[1].chooseType
          }
        });
        wx.hideLoading();
      });
    })
  }
})
