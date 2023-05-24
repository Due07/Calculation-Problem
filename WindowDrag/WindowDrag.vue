<template>
  <section class="window-drag">
    <el-card
      class="all"
      :body-style="{ 'padding': '0px'}"
      @dragover.native.prevent
      @drop.native.prevent="drop(
        $event, 'chosen',
        {all: 'chosenCloumn', checked: 'chosenChecked'},
        {all: 'allCloumn', checked: 'allChecked'}
      )"
    >
      <div class="card-header" slot="header">
        <h3>全部Table表头</h3>
        <p class="tips">{{ tips }}</p>

        <div class="input-range">
          <span>快捷范围选择 : </span>
          <div class="input-number">
            <el-input-number size="mini" v-model="allNumber[0]" :min="2" :max="180" label="最小值"></el-input-number>
            ~
            <el-input-number
              size="mini"
              v-model="allNumber[1]"
              :min="allNumber[0] === undefined ? 2 : allNumber[0]"
              :max="180"
              label="最小值"
            >
            </el-input-number>
            <el-button
              type="primary"
              size="mini"
              :disabled="!allNumber[0] || !allNumber[1]"
              @click="onRangeClick('allNumber', 'allChecked', 'allCloumn')"
            >确定</el-button>
          </div>
        </div>
        <el-button type="danger" size="mini" @click="allChecked = []">
          clear
        </el-button>
        <el-button :disabled="!allChecked.length" type="primary" size="mini" @click="drop(
          $event, 'chosen',
          {all: 'allCloumn', checked: 'allChecked'},
          {all: 'chosenCloumn', checked: 'chosenChecked'},
        )">移动</el-button>

        <p class="select-num">已选择数量: <span>{{ selectAllNum }}</span></p>
      </div>

      <div
        class="content-box"
        @mousedown.self.prevent="onMousedown($event, 'allCanvas')"
        @mousemove.prevent="onMousemove('.all .content-box', $event, 'allCanvas', 'allCloumn', 'allChecked')"
        @mouseup.prevent="onMouseup($event, 'allCanvas')"
        @mouseleave.self.prevent="onMouseup($event, 'allCanvas')"
        @dragover.prevent
      >
        <template v-for="(item, index) in allCloumn">
          <div
            class="box"
            :class="{'active': allChecked.includes(item)}"
            :key="index"
            :draggable="allChecked.includes(item)"
            @click.prevent="onCheck(item, 'allChecked')"
            @dragstart="dragStart"
          >
            <!-- <font-awesome-icon :icon="['fa','table']"></font-awesome-icon> -->
            {{ item }}
          </div>
        </template>
      </div>
      <canvas ref="allCanvas"></canvas>
    </el-card>

    <el-card
      class="chosen"
      :body-style="{ 'padding': '0px'}"
      @dragover.native.prevent
      @drop.native.prevent="drop(
        $event, 'all',
        {all: 'allCloumn', checked: 'allChecked'},
        {all: 'chosenCloumn', checked: 'chosenChecked'},
      )"
    >
      <div class="card-header" slot="header">
        <h3>已选择显示Table表头</h3>
        <p class="tips">{{ tips }}</p>

        <div class="input-range">
          <span>快捷范围选择 : </span>
          <div class="input-number">
            <el-input-number size="mini" v-model="chosenNumber[0]" :min="2" :max="180" label="最小值">
            </el-input-number>
            ~
            <el-input-number
              size="mini"
              v-model="chosenNumber[1]"
              :min="chosenNumber[0] === undefined ? 2 : chosenNumber[0]"
              :max="180"
              label="最小值"
            >
            </el-input-number>
            <el-button
              type="primary"
              size="mini"
              :disabled="!chosenNumber[0] || !chosenNumber[1]"
              @click="onRangeClick('chosenNumber', 'chosenChecked', 'chosenCloumn')"
            >确定</el-button>
          </div>
        </div>
        <el-button type="danger" size="mini" @click="chosenChecked = []">
          clear
        </el-button>
        <el-button :disabled="!chosenChecked.length" type="primary" size="mini" @click="drop(
          $event, 'all',
          {all: 'chosenCloumn', checked: 'chosenChecked'},
          {all: 'allCloumn', checked: 'allChecked'},
        )">移动</el-button>

        <p class="select-num">已选择数量: <span>{{ selectChosenNum }}</span></p>
      </div>

      <div
        class="content-box"
        @mousedown.self.prevent="onMousedown($event, 'chosenCanvas')"
        @mousemove.prevent="onMousemove('.chosen .content-box', $event, 'chosenCanvas', 'chosenCloumn', 'chosenChecked')"
        @mouseup.prevent="onMouseup($event, 'chosenCanvas')"
        @mouseleave.self.prevent="onMouseup($event, 'chosenCanvas')"
        @dragover.prevent
      >
        <template v-for="(item, index) in chosenCloumn">
          <div
            class="box"
            :class="{'active': chosenChecked.includes(item)}"
            :key="index"
            :draggable="chosenChecked.includes(item)"
            @click.prevent="onCheck(item, 'chosenChecked')"
            @dragstart="dragStart"
            @mousemove.prevent
          >
            <!-- <font-awesome-icon :icon="['fa','table']"></font-awesome-icon> -->
            {{ item }}
          </div>
        </template>
      </div>
      <canvas ref="chosenCanvas"></canvas>
    </el-card>
  </section>
</template>

<script>
/**
 * 拖拽api
 * https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_Drag_and_Drop_API
 */
import CanvasFun from './canvas'
import { allColumn } from './column'
export default {
  name: 'WindowDrag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    propChosenCloumn: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 初始全部
      allCloumn: allColumn(),
      allChecked: [],
      // 已选择
      chosenCloumn: [],
      chosenChecked: [],
      allCanvas: undefined,
      chosenCanvas: undefined,
      canvasMap: new WeakMap(),
      tips: '可鼠标圈住批量选择, 拖拽移动表头',
      allNumber: [],
      chosenNumber: []
    }
  },

  computed: {
    selectAllNum () {
      return `${this.allChecked.length} / ${this.allCloumn.length}`
    },
    selectChosenNum () {
      return `${this.chosenChecked.length} / ${this.chosenCloumn.length}`
    }
  },

  watch: {
    visible (nVal) {
      if (nVal) {
        this.updateContentBox()
        this.updateCanvasSize(this.$refs)
      } else {
        this.allChecked = []
        this.chosenChecked = []
      }
    },
    // 初始化传递已选择表头
    propChosenCloumn: {
      handler (nVal) {
        if (!this.chosenCloumn.length && JSON.stringify(this.chosenCloumn) !== JSON.stringify(nVal)) {
          const chosenCloumn = []
          this.allCloumn = nVal.reduce((pre, cur) => {
            const preArr = pre.length ? pre : this.allCloumn
            const filterArr = preArr.filter((item) => {
              if (item === cur) chosenCloumn.push(cur)
              return item !== cur
            })

            return filterArr
          }, '')
          this.chosenCloumn = chosenCloumn
        }
      },
      immediate: true
    },
    chosenCloumn (nVal) {
      this.$emit('update:propChosenCloumn', nVal)
    }
  },

  mounted () {
    const { allCanvas, chosenCanvas } = this.$refs

    //  更新canvas尺寸
    this.updateContentBox()
    this.updateCanvasSize(this.$refs)

    this.allCanvas = allCanvas.getContext('2d')
    this.chosenCanvas = chosenCanvas.getContext('2d')
  },

  methods: Object.assign(
    {
      // 开始拖拽时触发
      dragStart (event) {
        // console.log(event, '开始拖拽')
        // event.dataTransfer.setDragImage(event.target.children[0], 10, 10)
      },

      /**
       * 在可视区释放时触发
       * @param {HTMLElement} event HTMLElement
       * @param {String} target 类名
       * @param {Object} originObj 原数据 {all, check}
       * @param {Object} handleObj 处理数据 {all, check}
       */
      drop (event, target, originObj, handleObj) {
        // console.log(target)
        // 如果不是拖回本位置的话
        if (!this.searchParent(event.target, target)) {
          const { all: originAll, checked: originCheck } = originObj
          const originCheckJson = JSON.parse(JSON.stringify(this[originCheck]))
          // 至少需要保留一个表头
          if (originAll === 'chosenCloumn' && this[originAll].length === this[originCheck].length) {
            return this.$message.error('至少需要保留一个表头!')
          }
          const { all, checked } = handleObj

          this[all] = Array.from(new Set([...this[all], ...this[originCheck]].sort((a, b) => a - b)))
          // 清除被圈住数据
          this[originAll] = this[originAll].filter((item) => {
            return !originCheckJson.includes(item)
          })

          // 已圈住 表头 清空
          this[originCheck] = this[checked] = []

          // 更新 canvas 视图尺寸
          this.updateContentBox()
          this.updateCanvasSize(this.$refs)
        }
        // console.log(this.searchParent(event.target, target))
      },

      /**
       * @param {*} item 当前item
       * @param {string} target 筛选数据的name
       */
      onCheck (item, target) {
        const locationIndex = this[target].indexOf(item)
        this[target].includes(item)

        if (locationIndex === -1) {
          this[target].push(item)
        } else {
          this[target].splice(locationIndex, 1)
        }
      },

      onRangeClick (arr, checkName, allArrName) {
        const range = this[arr]
        const allArr = this[allArrName]
        const numArr = (Array((range[1] + 1) - range[0]).fill(range[0])).reduce((pre, cur) => {
          return pre.length ? [...pre, [...pre].pop() + 1] : [+cur]
        }, [])
          .reduce((pre, cur) => {
            const newNum = +cur
            return allArr.includes(newNum) ? [...pre, newNum] : [...pre]
          }, [])
        const checkedArr = this[checkName]
        this[checkName] = Array.from(new Set([...checkedArr, ...numArr]))
        this[arr] = []
        console.log(this[checkName])
      },

      /**
       * 向上查找父级类元素
       * @param {HTMLElement} event HTMLElement 数据
       * @param {String} className 类名
       * @returns {Boolean}
       */
      searchParent (event, className) {
        const target = event

        if (target.localName === 'body') return false
        if ([...target.classList].includes(className)) {
          return true
        }

        return this.searchParent(target.parentElement, className)
      }
    },
    CanvasFun.methods
  )
}
</script>

<style scoped>
.window-drag {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  padding: 0 0 20px;
  /* justify-content: space-evenly; */
  justify-content: space-around;
}
.window-drag /deep/.el-card__body {
  box-sizing: border-box;
  position: relative;
}

.window-drag /deep/.el-card__header {
  padding-bottom: 8px;
}
.window-drag /deep/.el-card__header .card-header h3 {
  margin: 0 0 6px;
  font-weight: bold;
}

.all, .chosen {
  width: 47%;
  max-width: 500px;
  overflow-y: auto;
}
.card-header .input-range {
  margin-bottom: 6px;
  font-size: 14px;
}
.card-header .input-range .input-number /deep/.el-button {
  margin-left: 16px;
}
.card-header .input-range /deep/.el-input-number {
  width: 96px;
}
.card-header .select-num {
  margin: 10px 0 0;
  display: flex;
  align-items: center;
}

.card-header .tips {
  color: rgba(0, 0, 0, .6);
  font-weight: 600;
  font-size: 12px;
  margin: 0 0 6px;
}

.card-header .select-num span {
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.content-box {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}
.content-box .box {
  width: auto;
  display: inline-block;
  cursor: pointer;
  margin: 10px 5px 0 0;
}
.content-box .box.active {
  background-color: rgba(140, 204, 238, .4);
}
</style>
