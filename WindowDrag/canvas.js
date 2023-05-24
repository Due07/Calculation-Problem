export default {
  methods: {
    /**
     * 更新content-box 统一高度
     *
     * tips: 需要修改 `content-box元素的style 样式`
     */
    updateContentBox () {
      this.$nextTick(() => {
        const boxArr = [...document.querySelectorAll('.window-drag .content-box')]
        let maxHeight = boxArr.reduce((pre, cur) => {
          // 统一清除style样式
          cur.removeAttribute('style')
          return pre > cur.offsetHeight ? pre : cur.offsetHeight
        }, 0)
        boxArr.forEach((item) => {
          if (item.offsetHeight < maxHeight) {
            item.style.minHeight = `${maxHeight}px`
          }
        })
      })
    },
    /**
     * 更新 canvas尺寸
     * @param {Object} refArr  refs 数据
     */
    updateCanvasSize (refArr) {
      this.$nextTick(() => {
        // canvans 需要设定宽高
        Object.keys(refArr).forEach((item) => {
          this.onVarietySize(item, refArr[item].parentElement)
        })
      })
    },

    /**
     * 根据参考物获取宽高，画布定宽高
     * @param {string} refName name名称
     * @param {HTMLElement} reference 参考物，获取宽高
     */
    onVarietySize (refName, reference) {
      if (typeof reference !== 'object') return

      const { offsetWidth, offsetHeight } = reference
      // console.log(offsetWidth, offsetHeight)

      this.$refs[refName].width = offsetWidth
      this.$refs[refName].height = offsetHeight
    },

    /**
     * 鼠标摁下
     * @param {Object} event 默认事件数据
     * @param {string} target data中的画布name
     */
    onMousedown (event, target) {
      // console.log(event)
      // 储存初始event
      this.canvasMap.set(this[target], event)
    },

    /**
     * 鼠标移动
     * @param {String} parent 元素类名
     * @param {Object} event 默认事件数据
     * @param {string} target data中的画布name
     * @param {string} allStr 全部数据名称
     * @param {string} checkStr 已选择数据的名称
     * @returns {void}
     */
    onMousemove (parent, event, target, allStr, checkStr) {
      if (!this.canvasMap.has(this[target])) return

      let canvasEvent = this.canvasMap.get(this[target])
      const size = this.handleSize(canvasEvent, event)
      this.handleCanvas(
        target,
        size
      )
      // console.log('所在canvas的尺寸', size)

      this.canvasSelectTarget(
        document.querySelector(parent),
        size,
        allStr,
        checkStr
      )
      // this.canvasMap.set(this.allCanvas, canvasEvent)
    },

    /**
     * 鼠标抬起
     * @param {Object} event 默认事件数据
     * @param {string} target data中的画布name
     */
    onMouseup (event, target) {
      this.canvasMap.delete(this[target])
      this[target].clearRect(
        0, 0, this.$refs[target].width, this.$refs[target].height
      )
    },

    /**
     * 处理canvas
     * @param {string} target data中的画布name
     * @param {Object} size {x, y, width, height}
     * @param {String} color 16进制色值
     * @returns {void}
     */
    handleCanvas (target, size, color = '#AACCEE') {
      if (!this[target] || typeof size !== 'object') {
        return false
      }

      this[target].clearRect(0, 0, this.$refs[target].width, this.$refs[target].height)
      this[target].fillStyle = color
      this[target].globalAlpha = 0.5
      this[target].fillRect(size.x, size.y, size.width, size.height)
    },

    /**
     * 处理canvas 宽高
     * @returns {Object} {x, y, width, height}
     */
    handleSize (initEvent, endEvent) {
      // 关于 layerX https://juejin.cn/post/7204635326559158330
      return {
        x: initEvent.layerX,
        y: initEvent.layerY,
        width: endEvent.layerX - initEvent.layerX,
        height: endEvent.layerY - initEvent.layerY
      }
    },

    /**
     * 获取canvas所画图包含在内的**块**
     * @param {HTMLElement} targetParent 父类元素
     * @param {canvasEvent} canvasParam  canvas元素
     * @param {String} allData 筛选出所选的数据 name
     * @param {String} selectBox 存放数组的name
     */
    canvasSelectTarget (targetParent, canvasParam, allData, selectBox) {
      const xScope = {
        init: canvasParam.x,
        end: canvasParam.x + canvasParam.width
      }
      // targetParent.scrollTop 是否有滚动高度
      const yScope = {
        init: canvasParam.y + targetParent.scrollTop,
        end: canvasParam.y + targetParent.scrollTop + canvasParam.height
      }

      /**
       *  @returns {Array} 返回包含在内的数组index
       */
      const indexArr = [...targetParent.children].reduce((pre, cur, index) => {
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = cur
        // console.log(offsetLeft, offsetTop, offsetWidth, offsetHeight)

        const childrenX = {
          init: offsetLeft,
          end: offsetLeft + offsetWidth
        }
        const childrenY = {
          init: offsetTop,
          end: offsetTop + offsetHeight
        }
        const isType = this.isExist(
          { x: xScope, y: yScope },
          { x: childrenX, y: childrenY }
        )
        // console.log(index, xBoolean, yBoolean)

        return isType ? [...pre, index] : pre
      }, [])

      const selectArr = indexArr.length
        ? this[allData].filter((item, index) => indexArr.includes(index))
        : []

      this[selectBox] = Array.from(new Set([...selectArr]))

      // console.log(indexArr)
    },

    /**
     * 是否在视图内
     * @param {HTMLElement} target canvas 的 HTMLElement
     * @param {HTMLElement} item 目标元素的 HTMLElement
     * @returns {Boolean} 是否在视图内
     */
    isExist (target, item) {
      const { x, y } = target

      const { x: itemX, y: itemY } = item
      const centerX = itemX.init + ((itemX.end - itemX.init) / 2)
      const centerY = itemY.init + ((itemY.end - itemY.init) / 2)
      // console.log(itemX, itemY, centerX, centerY, x, y)

      const xBoolean = (Math.min(x.init, x.end) <= centerX) && (centerX <= Math.max(x.init, x.end))
      const yBoolean = (Math.min(y.init, y.end) <= centerY) && (centerY <= Math.max(y.init, y.end))

      return xBoolean && yBoolean
    }
  }
}
