<template>
  <div class="quick-select">
    <div class="title">快捷范围选择 :</div>
    <div class="content flex items-center">
      <el-input-number size="small" controls-position="right" v-model="quickList[0]" :min="min" :max="max"/>
      <span class="interval mx-2">~</span>
      <el-input-number size="small" controls-position="right" v-model="quickList[1]" :min="quickList[0]" :max="max"/>
      <el-button
        class="ml-4"
        size="small"
        type="primary"
        :disabled="!quickList.every((item) => !!item)"
        @click="onCheck"
      >确定</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 快捷选择组件

import { ClearReactive } from '@/common/base/utils';
import type { TBox } from './WindowCanvas/config';

const props = defineProps<{
  list: TBox[];
}>();
const emits = defineEmits<{
  (e: 'checkSelect', value: TBox[]): void,
}>();

const quickList = shallowReactive([]);
const min = 2;
const max = 180;

const reset = () => ClearReactive(quickList, []);

const onCheck = () => {
  const [start, end] = quickList;
  const list = props.list.filter(item => start <= +item.value && +item.value <= end);
  emits('checkSelect', list);
  reset();
};

</script>

<style lang="scss" scoped>
.quick-select {
  .content {
    :deep(.el-input-number--small) {
      width: 100px;
      .el-input__wrapper {
        padding-right: 20px;
        padding-left: 4px;
      }
    }
  }
}
</style>
