<template>
  <el-popover
    placement="right"
    width="900"
    trigger="click"
    :teleported="false"
    @after-enter="() => getVisible = true"
    @hide="() => getVisible = false"
    v-bind="$attrs"
  >
    <div class="popover-content flex justify-around">
      <el-card v-for="(target, index) in popoverList" :key="index">
        <template #header>
          <h3>{{ target.title }}</h3>
          <p class="tips">可鼠标圈住批量选择, 拖拽移动表头</p>
          <QuickSelect :list="allList" @checkSelect="(list) => ClearReactive(target.select, list)" />
          <el-button
            class="my-2"
            size="small"
            type="danger"
            @click="() => canvasRef[target.type]?.resetSelect()"
          >清空</el-button>
          <el-button class="my-2" size="small" type="primary" @click="moveClick(target)">移动</el-button>
          <div class="select-num">
            已选择数量
            <span class="font-bold">
              {{canvasRef[target.type]?.getSelectList().length ?? 0}} / {{ target.list.length }}
            </span>
          </div>
        </template>
        <WindowCanvas
          :ref="(el) => canvasRef[target.type] = (el as InstanceType<typeof WindowCanvas>)"
          v-model:form-list="target.list"
          :select-list="target.select"
          @update-list="(select) => updateList(target.list, target.target, select)"
        />
      </el-card>
    </div>
    <template #reference>
      <el-button type="primary" :icon="Setting" title="自定义显示表头留存"></el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import WindowCanvas from './DragCanvas/index.vue';
import { Setting } from '@element-plus/icons-vue';
import type { TBox } from './DragCanvas/config';
import { ClearReactive } from '@/common/base/utils';
import QuickSelect from './QuickSelect.vue';

type TPopoverContent = {
  title: string,
  type: 'all' | 'chosen',
  list: TBox[],
  select: TBox[],
  target: TBox[],
};

const props = withDefaults(
  defineProps<{visible: boolean, originList?: TBox[], selectList?: TBox[]}>(),
  { originList: () => [], selectList: () => [] },
);
const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void,
}>();

const getVisible = computed({
  get () { return props.visible; },
  set (value) { emits('update:visible', value); },
});

const allList: TBox[] = shallowReactive(props.originList);
const allSelect: TBox[] = shallowReactive([]);
const chosenList: TBox[] = shallowReactive(props.selectList);
const chosenSelect: TBox[] = shallowReactive([]);

const canvasRef = shallowReactive({} as Record<'all' | 'chosen', InstanceType<typeof WindowCanvas> | null>);
const popoverList: TPopoverContent[] = [
  { title: '全部Table表头', type: 'all', list: allList, select: allSelect, target: chosenList },
  { title: '已选择显示Table表头', type: 'chosen', list: chosenList, select: chosenSelect, target: allList },
];

const moveClick = (target: TPopoverContent) => {
  const targetCanvasRef = canvasRef[target.type];
  if (!targetCanvasRef) return;

  const select = targetCanvasRef.getSelectList();
  if (!select.length) return;
  updateList(target.target, target.list, select);
};

/**
 * @param target 目标容器
 * @param result 去除内容容器
 * @param select 内容块
 */
const updateList = (target: TBox[], result: TBox[], select: TBox[]) => {
  const keyArr = select.map(item => item.value);
  const filterResult = result.filter((item) => !keyArr.includes(item.value));
  ClearReactive(result, filterResult);

  const resultTarget = [...target, ...select].sort((a, b) => (+a.id - +b.id));
  ClearReactive(target, resultTarget);
};

defineExpose({
  getSelectList: () => chosenList,
});
</script>

<style lang="scss" scoped>
.popover-content {
  :deep(.el-card) {
    width: 47%;
    .el-card__body {
      padding: 0;
    }
    h3 {
      font-size: 18px;
      letter-spacing: 1px;
      font-weight: bold;
    }
    .tips {
      color: rgba(0, 0, 0, .6);
      font-weight: 600;
      font-size: 12px;
      margin: 6px 0;
    }
  }
}
</style>
