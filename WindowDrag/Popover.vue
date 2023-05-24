<template>
  <el-popover
    placement="right" width="900" trigger="click"
    @after-enter="popoverVisible = true"
    @hide="popoverVisible = false"
  >
    <WindowDrag :visible.sync="popoverVisible" :propChosenCloumn.sync="popoverChosenColumn"/>

    <el-tooltip slot="reference" class="item" effect="dark" content="自定义显示表头留存" placement="top">
      <el-button type="primary" size="mini" icon="el-icon-s-tools"/>
    </el-tooltip>
  </el-popover>
</template>
<script>
import WindowDrag from './WindowDrag.vue'
export default {
  components: {
    WindowDrag
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    chosenColumn: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      popoverVisible: false,
      popoverChosenColumn: []
    }
  },
  watch: {
    visible: {
      handler (nVal) {
        if (nVal !== this.popoverVisible) this.popoverVisible = nVal
      },
      immediate: true
    },
    popoverVisible (nVal) {
      if (nVal !== this.visible) {
        if (JSON.stringify(this.popoverChosenColumn) !== JSON.stringify(this.chosenColumn)) {
          this.$emit('update:chosenColumn', this.popoverChosenColumn)
        }
        this.$emit('update:visible', nVal)
      }
    },
    chosenColumn: {
      handler (nVal) {
        if (JSON.stringify(nVal) !== JSON.stringify(this.popoverChosenColumn)) {
          this.popoverChosenColumn = nVal
        }
      },
      immediate: true
    }
    // popoverChosenColumn (nVal) {
    //   if (JSON.stringify(nVal) !== JSON.stringify(this.chosenColumn)) {
    //     this.$emit('update:chosenColumn', nVal)
    //   }
    // }
  }
}
</script>
<style scoped>

</style>
