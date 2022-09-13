## Ts 公用方法装饰器

```typescript
import Vue from 'vue';
import stringify from 'qs/lib/stringify';

type TMethod = <T>(...args: any[T]) => (
    target: Vue,
    key: string,
    descriptor: PropertyDescriptor,
) => void;

/**
 * 防抖
 * @param delay Number
 * @returns Function
 */

export const Debounce: TMethod = (delay = 500) => {
    let timer!: number;
    return (target, key, descriptor) => {
        const fun = descriptor.value;
        if (timer) clearTimeout(timer);

        descriptor.value = function (...args: any[]) {
            timer = setTimeout(() => {
                // fun.call(this, ...args);
                Reflect.apply(fun, this, args);
            }, delay);
        };
    };
};

/**
 * 节流
 * @param delay
 * @return Function
 */
export const Throttle: TMethod = (delay = 1200) => {
    let timer: number | undefined;
    return (target, key, descriptor) => {
        const fun = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const newTime = +new Date();
            if (!timer) {
                timer = newTime;
                Reflect.apply(fun, this, args);
            }

            if (newTime - timer > delay) {
                timer = undefined;
            }
        };
    };
};

/**
 * 导出函数 -----> 打开execl/pdf....
 * @param route (string)路径
 * @return Function
 */
export const ExportFun: TMethod = (route: string) => (target, key) => {
    target[key] = <T>(form: T) => {
        const origin = window.location.origin + process.env.VUE_APP_API_PREFIX;
        const path = stringify(form);
        window.location.href = `${origin}${route}?${path}`;
    };
};

```
