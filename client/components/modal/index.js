Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  data: {
    title: '',
    confirmText: '',
    confirmText: '',
    modalshow: true
  },
  properties: {
    show: {
      type: Boolean,
      value: true,
      observer(newVal, oldVal) {
        console.log(`oldVal: ${oldVal}, newVal: ${newVal}`)
        this.setData({
          modalshow: newVal
        })
      }
    },
    title: {
      type: String,
      value: '',
      observer(val){
        console.log(val)
      }
    },
    show: {
      type: Boolean,
      value: true,
      observer(newVal, oldVal) {
        console.log(`oldVal: ${oldVal}, newVal: ${newVal}`)
        this.setData({
          modalshow: newVal
        })
      }
    },
    mType: {
      type: String,
      value: 'paypwd'
    }
  },
  methods: {
    confirmClickFn(){
      this.closeModalFn()
    },
    cancelClickFn() {
      this.closeModalFn()
    },
    closeModalFn() {
      this.setData({
        modalshow: true
      }, () => {
        console.log(this.data.mType)
        if (this.data.mType == 'paypwd') {
          this.triggerEvent("closeAfterFn",{})
        }
      })
    }
  }
})