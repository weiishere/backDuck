Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
  },
  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    showMenu: false
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    toggleMenu() {
      const { showMenu } = this.data
      this.setData({
        showMenu: !showMenu
      })
    },
    menuClickFn(e) {
      const { type } = e.currentTarget.dataset;
      // console.log(type)
      this.setData({
        showMenu: false
      }, () => {
        // wx.showLoading({
        //   title: '',
        // })
        wx.navigateTo({
          url: `/pages/${type}/index`,
        })
      })
    }
  }
})