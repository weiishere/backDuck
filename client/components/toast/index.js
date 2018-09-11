Component({
  properties: {
    text: {
    type: String, 
    value: '', 
    observer: function (newVal, oldVal) {
      this.setData({
        toastText: newVal
      })
    }
  },
  },
  data: {
    toastText: ''
  },
  methods: {
    onLoad: function () {
      this.hide()
    },
    hide(){
      const that = this;
      setTimeout(() => {
        that.setData({
          toastText: ''
        })
      }, 2000)
    }
  }
})
