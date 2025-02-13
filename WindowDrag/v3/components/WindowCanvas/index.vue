<template>
  <section
    ref="contentRef"
    class="content-box relative box-border"
    :style="`height: ${contentHeight}px`"
    @mousedown.self.prevent="onMouseDown"
    @mousemove.prevent="mouseMove"
    @mouseup.prevent="onMouseUp"
    @mouseleave.prevent="onMouseUp"
    @drop.prevent="onDrop"
    @dragover.prevent
  >
    <template v-for="(item, index) in formList" :key="index">
      <div
        :class="[
          'box inline-block',
          selectKeys.includes(item.value) ? 'active' : '',
          item.class ?? '',
        ]"
        :ref="(el) => el && boxMap.set(el as HTMLElement, item)"
        :draggable="selectKeys.includes(item.value)"
        @dragstart="onDragStart($event, selectTarget)"
        @click="() => selectBox(item)"
      >
        <component v-if="item.components" :is="item.components" />
        <slot v-else>{{ item.label }}</slot>
      </div>
    </template>
    <canvas ref="canvasRef"></canvas>
  </section>
</template>

<script lang="ts" setup>
import { ClearReactive } from '@/common/base/utils';
import { CanvasIncludesBox, UpdateCanvasSize, useDrawCanvas } from './canvas';
import { CreateRandomStr } from '../random';
import type { TBox } from './config';

const UniqueID = CreateRandomStr(10, {letter: true, symbols: true});

const props = withDefaults(
  defineProps<{ formList: TBox[], selectList?: TBox[], contentHeight?: number }>(),
  {contentHeight: 600},
);
const emits = defineEmits<{
  /** value: 被选择的数据 */
  (e: 'updateList', value: TBox[]): void }
>();

const contentRef = shallowRef<HTMLElement>();
const canvasRef = shallowRef<HTMLCanvasElement>();

const {onMouseDown, onMouseMove, onMouseUp} = useDrawCanvas(canvasRef, contentRef);
const boxMap = new Map<HTMLElement, TBox>();
/** 选择的目标 */
const selectTarget = shallowReactive<TBox[]>([]);
const selectKeys = computed(() => selectTarget.map(item => item.value));
(props.selectList) && watch(
  props.selectList,
  (nVal) => {
    const filterList = nVal.filter(item => !selectKeys.value.includes(item.value));
    const resultList = [...selectTarget, ...filterList].sort((a, b) => +a.id - +b.id);
    ClearReactive(selectTarget, resultList);
  },
);

watch(props.formList, () => ClearReactive(selectTarget, []));

const mouseMove = (ev: MouseEvent) => {
  const drawSize = onMouseMove(ev);
  if (!drawSize) return;

  const list = CanvasIncludesBox(drawSize, boxMap);
  if (selectTarget.length || list.length) ClearReactive(selectTarget, list);
};

const selectBox = (target: TBox) => {
  const findIndex = selectTarget.findIndex(item => item.value === target.value);
  if (findIndex >= 0) return selectTarget.splice(findIndex, 1);

  selectTarget.push(target);
};

const onDragStart = (ev: DragEvent, selectList: TBox[]) => {
  ev.dataTransfer?.setData(
    'text/plain',
    JSON.stringify({id: UniqueID, list: selectList}),
  );
};

const onDrop = (ev: DragEvent) => {
  const str = ev.dataTransfer?.getData('text/plain');
  const dragData = JSON.parse(str ?? '{}') as {id: string, list: TBox[]};
  if (dragData.id === UniqueID) return ClearReactive(selectTarget, []);

  const resultList = dragData.list;
  emits('updateList', resultList);
};

onMounted(() => {
  const observer = new IntersectionObserver(([target]: IntersectionObserverEntry[]) => {
    if (target.intersectionRatio) {
      const {scrollHeight, offsetWidth} = contentRef.value!;
      UpdateCanvasSize(offsetWidth, scrollHeight, canvasRef.value);
    }
  });
  observer.observe(contentRef.value!);
});

defineExpose({
  resetSelect: () => ClearReactive(selectTarget, []),
  getSelectList: () => selectTarget,
});
</script>

<style lang="scss" scoped>
.content-box {
  // position: relative;
  width: inherit;
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;

  .box {
    border: 1px solid rgba($color: #565656, $alpha: .4);
    border-radius: 4px;
    user-select: none;
    padding: 4px 4px 2px;
    margin: 0 8px 10px 0;
    &.active {
      background-color: rgba(140, 204, 238, .4);
      cursor: grab;
    }
  }

  canvas {
    pointer-events: none;
    @apply absolute left-0 top-0;
  }

  &::-webkit-scrollbar {
    width: 7px; /* 垂直滚动条宽度 */
    height: 7px; /* 水平滚动条高度 */
  }
  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: rgba($color: #e7e7e7, $alpha: 1); /* 轨道颜色 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1; /* 滑块颜色 */
    border-radius: 4px;
  }
}
</style>
