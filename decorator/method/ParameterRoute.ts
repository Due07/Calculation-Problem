/**
 *  参数化路由
 */
// import router from '@/router';
// 引入会引起 error: Dependency cycle via  暂用 window.vm
import { parse } from 'qs';
import { TMethodCallBack } from '../types';

const router = window.vm.$router;

// 类型转化 字符串(数字) -> 数字   字符串(boolean) -> boolean
const ConversionType = (obj: Record<string, any>) => {
    const handleObj = {...obj};
    for (const key in handleObj) {
        if (Reflect.has(handleObj, key)) {
            const value = handleObj[key];

            // 数字类型
            if (Number.isNaN(+value)) {
                return handleObj[key] = +value;
            }

            // boolean
            if (value === 'false' || value === 'true') {
                return handleObj[key] = JSON.parse(value);
            }

            // Array / Obj 不处理
        }
    }
    return handleObj;
};

/**
 *
 * @param value 需要排除value 不显示地址栏
 * @returns Function
 */
export const AddRouteAddress: TMethodCallBack = (value: string | string[]) => (target, key, descriptor) => {
    const fun = descriptor.value;

    descriptor.value = function <T> (...arg: T[]) {
        const test = /^\[object +(\S*)+\]$/;

        // 获取传参最近的obj 认为是发送参数
        const findObj = {
            ...(arg.find(<T>(item: T) => {
                const type = Reflect.toString.apply(item);
                const match = type.match(test);
                return match && match[1] === 'Object';
            })) || {},
        };

        // 过滤掉 value
        value = Array.isArray(value) ? value : [value];
        value.forEach((item) => {
            if (value && Reflect.has(findObj, item)) delete findObj[item];
        });

        const queryObj = router.resolve({query: findObj}).route.query;
        const { search } = window.location;
        const query = ConversionType(parse(search.slice(1)));

        if (JSON.stringify(queryObj) !== JSON.stringify(query)) {
            router.replace({query: findObj});
        }

        return Reflect.apply(fun, this, arg);
    };
};
/**
 * 配合上面使用
 * @param value {string} obj的name
 * @returns Function
 */
export const InitializationAddress: TMethodCallBack = (value) => (target, key, descriptor) => {
    const fun = descriptor.value;

    descriptor.value = function <T> (...arg: T[]) {
        const { search } = window.location;
        const query = ConversionType(parse(search.slice(1)));
        console.log('地址栏信息', query);

        if (value) {
            this[value] = {...this[value], ...query};
        }

        return Reflect.apply(fun, this, arg);
    };
};
