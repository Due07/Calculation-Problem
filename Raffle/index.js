/**
 *  基础方法
 */
/**
 * 判断类型
 * @param data 数据
 * @param type 判断类型
 * @returns { Boolean }
 */
export const judgmentType = (data, type) => {
    const test = /^\[object +(\S*)+\]$/;
    const typeStr = Reflect.toString.call(data);
    const replaceStr = typeStr.replace(test, '$1');

    return type ? replaceStr === type : replaceStr;
}

/**
 * 抽奖盒子滚动
 * @param {Array<HTMLElement>} eventArr 抽奖盒子
 * @param {Array<Number>} sequence 滚动盒子顺序
 * @param {String | Record<'event' | 'name', any>} switchType 被选中的类名
 * @param {Record<'runds' | 'sTime' | 'hitNum', Number>} opt 存放初始圈数, 初始时间, 命中目标的index数字
 * ```
 *  #switchType 传递 String 类型则用操作dom类名形式，传递Object-> {event: '当前this', name: '名称'}则用变量形式
 *  switchType === Object     eventArr 可传递空
 * ```
 * ```javascript
 * 方式一(vue 中for渲染的盒子), 方式二(原生操作dom 类样式)
 * 方式一: startScrolling(
                [],
                [1, 2, 3, 5, 8, 7, 6, 4],
                {event: this, name: 'selectType'},
                {runds: 4, sTime: 300, hitNum: findIndex, diffNum: 20},
            )
  方式二: startScrolling(
                [dom, dom, dom .....], dom伪数组
                [1, 2, 3, 5, 8, 7, 6, 4],
                'active',
                {runds: 4, sTime: 300, hitNum: findIndex, diffNum: 20},
            )
 * ```
 */
export const startScrolling = (
    eventArr, sequence, switchType,
    opt = {runds: 5, sTime: 400, diffNum: 30},
) => {
    if (!sequence.length || !Reflect.has(opt, 'hitNum')) return console.warn(sequence, opt);

    let scrollNum = 0; // 跑动次数
    const sRunds = opt.runds; // 滚动圈数
    let startTime = opt.sTime; // 初始时间
    //  一共滚动次数
    const runScrollNum = (sequence.length * sRunds) + (
        opt.hitNum ?? Math.ceil((Math.random() * sequence.length))
    )
    //  峰值  目标: 速度由初始到块，峰值后 快到慢
    const summit = runScrollNum *.4;

    const run = (fun, delayTime) => {
        const time = delayTime ? delayTime : 0;
        setTimeout(() => {
            // 大于峰值 时间变长， 小于 时间短
            startTime = startTime + ((scrollNum > summit) ? (opt.diffNum) : ~opt.diffNum + 1);
            // console.log(startTime);
            // console.log(startTime, scrollNum);
            if (judgmentType(switchType, "Object")) {
                const {event, name} = switchType;
                event[name] = sequence[scrollNum % sequence.length];
            }
            if (judgmentType(switchType, "String")) {
                domActive(eventArr, switchType);
            }
            ++ scrollNum;
            if (scrollNum < runScrollNum) return run(fun, startTime);

            return fun();
        }, time);
    }

    return new Promise((reslove) => {
        run(reslove);
    })
}

/**
 * 清除上一个盒子选中，下一个盒子选中
 * @param {Array<HTMLElement>} itemArr dom元素数组
 * @param {String} value 添加类名名称
 */
const domActive = (itemArr, value) => {
    const arr = [...itemArr];
    arr.find((item, index) => {
        const { classList } = item;

        if (classList.includes(value)) {
            item.className = classList.filter(val => val !== value);

            const lastItem = index + 1 > arr.length ? 0 : index + 1;
            const { classList: lastClassList } = arr[lastItem];
            arr[lastItem] = [...lastClassList, value];

            return true;
        }
        return false;
    })
}
