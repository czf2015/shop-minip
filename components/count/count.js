// components/count/count.js


Component({
  /**
   * Component properties
   */
  properties: {
    number: {
      type: Number,
      value: 1,
      observer(newVal, oldVal, changedPath) {
        if (newVal) {
          
        }
      }
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    change(e) {
      const number = this.data.number + e.target.dataset.step
      if (number > 0) {
        this.setData({
          number
        })
        this.triggerEvent('numChange', number);
      }
    }
  }
})