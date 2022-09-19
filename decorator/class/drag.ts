/**
 *  拖拽函数
 *  ------------------
 *  ele 需加上native 获取原生事件
 *  draggable="true"
 *  @dragstart.native="onDragstart($event, tag)"
 *  @drop.native.prevent="onDrop($event, tag)"
 *  @dragover.native.prevent
 */
import { TClass } from '../types';

type TDragEvent = DragEventInit & {target: HTMLElement};

/**
 * @param target 当前类
 * @return void
 */
export const onDragstart: TClass = (target) => {
    /**
     * @param event $event
     * @param tag Object / Array / string / number / boolean 当前拖拽的数据
     */
    target.prototype.onDragstart = function <T> (
        event: TDragEvent,
        tag: T,
    ) {
        let handleTag!: string;
        switch (typeof tag) {
            case 'object':
                handleTag = JSON.stringify(tag);
                break;
            default:
                handleTag = `${tag}`;
                break;
        }
        if (event.dataTransfer) {
            event.dataTransfer.setData(
                'text/plain',
                handleTag,
            );
        }
    };
};

/**
 * @param val string 拖拽变化的数组
 * @return Function
 */
export const onDrop: (val: string) => TClass = (val) => (target) => {
    /**
     * @param event $event
     * @param tag 置换的数据 传递什么类型, 将转出什么类型
     */
    target.prototype.onDrop = function <T> (
        event: TDragEvent,
        tag: T,
    ) {
        const comboJson = [...this[val][this.i.value]];

        const originObj = event.dataTransfer?.getData('text/plain');
        const nowObj = typeof tag !== 'string' ? JSON.stringify(tag) : tag;

        const originIndex = comboJson.findIndex((item) => JSON.stringify(item) === originObj);
        const nowIndex = comboJson.findIndex((item) => JSON.stringify(item) === nowObj);

        // 传递进来的数据不是string,
        if (typeof tag !== 'string') {
            [comboJson[originIndex], comboJson[nowIndex]] = [
                JSON.parse(nowObj),
                JSON.parse(originObj as string),
            ];
        } else {
            [comboJson[originIndex], comboJson[nowIndex]] = [
                nowObj,
                originObj,
            ];
        }

        console.log(comboJson);
        this[val][this.i.value] = comboJson;
    };
};
