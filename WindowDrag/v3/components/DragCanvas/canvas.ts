import type { TBox } from './config';

/** 更新canvas尺寸 */
export const UpdateCanvasSize = (width: number, height: number, canvas?: HTMLCanvasElement) => {
  if (!canvas) return;
  canvas.height = height;
  canvas.width = width;
};

export type TDrawSize = { x: number, y: number, w: number, h: number }

export type TDrawCanvasFn = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  drawSize: TDrawSize,
  color?: string,
) => TDrawSize;

type TDrawEvent = { ev: MouseEvent | Event, scrollDiff: number }

/** 处理两个event 转出x, y, width, height */
export const TransformSize = (start: TDrawEvent, end: TDrawEvent): TDrawSize => {
  // 关于 layerX https://juejin.cn/post/7204635326559158330
  const {ev: startEv, scrollDiff: startDiff} = start;
  const {ev: endEv, scrollDiff: endDiff} = end;

  const [startX, startY] = [startEv.layerX, startEv.layerY + startDiff];
  const [endX, endY] = [endEv.layerX, endEv.layerY + endDiff];

  return { x: startX, y: startY, w: endX - startX, h: endY - startY };
};

/** canvas 画块 */
export const DrawCanvas: TDrawCanvasFn = (canvas, ctx, drawSize, color = '#AACCEE') => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.5;

  const {x, y, w, h} = drawSize;
  ctx.fillRect(x, y, w, h);
  return drawSize;
};
/**
 * 构建canvas钩子
 * @param canvasRef canvas 实例
 * @param contentRef canvas 父级的实例
 * @returns
 */
export const useDrawCanvas = (
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  contentRef: Ref<HTMLElement | undefined>,
) => {
  const canvasMap = new WeakMap();
  const isDraw = shallowRef(false);
  let canvas = canvasRef.value;
  let canvasCtx: CanvasRenderingContext2D | null;

  watch(
    canvasRef,
    (nVal) => { if (nVal) canvas = nVal; },
    { immediate: true },
  );

  const createCanvasCtx = () => { if (canvas) canvasCtx = canvas.getContext('2d'); };

  /** 鼠标摁下 */
  const onMouseDown = (ev: MouseEvent) => {
    if (!canvas) return;
    const scrollTop = contentRef.value ? contentRef.value.scrollTop : 0;
    const scrollDiff = contentRef.value ? scrollTop : 0;

    // const resultEv = Object.assign(ev, {layerY: ev.layerY + scrollDiff});
    canvasMap.set(canvas, {ev, scrollDiff});
    isDraw.value = true;
  };

  /** 鼠标移动 */
  const onMouseMove = (ev: MouseEvent | Event) => {
    if (!canvas || !canvasMap.has(canvas)) return;

    if (!canvasCtx) return;
    const scrollTop = contentRef.value ? contentRef.value.scrollTop : 0;
    const scrollDiff = contentRef.value ? scrollTop : 0;

    const drawSize: TDrawSize = TransformSize(canvasMap.get(canvas), {ev, scrollDiff});
    return DrawCanvas(canvas, canvasCtx, drawSize);
  };

  /** 鼠标抬起 */
  const onMouseUp = () => {
    if (!canvas) return;
    canvasMap.delete(canvas);
    isDraw.value = false;
    canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  onMounted(() => {
    nextTick(() => createCanvasCtx());
  });

  return {
    isDraw,
    onMouseDown,
    onMouseMove,
    createCanvasCtx,
    onMouseUp,
  };
};

type TElementSize = Record<'x' | 'y', {init: number, end: number}>;
const isExist = (target: TElementSize, item: TElementSize) => {
  const { x, y } = target;

  const { x: itemX, y: itemY } = item;
  const centerX = itemX.init + ((itemX.end - itemX.init) / 2);
  const centerY = itemY.init + ((itemY.end - itemY.init) / 2);

  const xBoolean = (Math.min(x.init, x.end) <= centerX) && (centerX <= Math.max(x.init, x.end));
  const yBoolean = (Math.min(y.init, y.end) <= centerY) && (centerY <= Math.max(y.init, y.end));

  return xBoolean && yBoolean;
};

/** 绘画块包含的box */
export const CanvasIncludesBox = (
  {x, y, w, h}: TDrawSize,
  boxMap: Map<HTMLElement, TBox>,
) => {
  const xScope = { init: x, end: x + w };
  const yScope = { init: y, end: y + h };

  return [...boxMap.entries()].reduce<TBox[]>((pre, [el, value]) => {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = el;

    const cX = { init: offsetLeft, end: offsetLeft + offsetWidth };
    const cY = { init: offsetTop, end: offsetTop + offsetHeight };

    const type = isExist({ x: xScope, y: yScope }, { x: cX, y: cY });

    return type ? [...pre, value] : [...pre];
  }, []);
};
