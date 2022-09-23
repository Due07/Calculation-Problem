import Vue from 'vue';

export default class {
    /**
     * @param val HTMLElement | string
     * @param text string
     * @returns Function
     */
     loading = (val: HTMLElement | string = 'body', text = '') => {
        let target: HTMLElement;
        if (val instanceof HTMLElement) {
            target = val as HTMLElement;
        } else {
            target = document.querySelector(val as string) as HTMLElement;
        }
        return Vue.prototype.$loading({
            target,
            text,
        });
    };
}