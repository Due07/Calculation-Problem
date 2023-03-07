import Http from "./Http";
export default class HttpServices {
    /**
     * 如果有引入Elem的话, 每次发送请求都可以显示loading 需求决定
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

    HttpClient = new Http(/* 域名 */) as any;

    HttpClientOne = new Http(/* 域名 */) as any;

    HttpClientTwo = new Http(/* 域名 */) as any;
}