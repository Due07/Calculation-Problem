import stringify from 'qs/lib/stringify';
import axios, {
    AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler,
} from 'axios';

export default class {
    http: AxiosInstance;

    // showError: boolean | undefined = true;
    #cancelMap: Map<string, Canceler> = new Map();

    // 是否使用节流
    throttleMap: Map<string, boolean> = new Map();

    // 挂载在vm上的i18n
    private locale(val = window.vm.$i18n.locale) {
        // console.log('language', val);
        const locale = val;
        return `${locale}-${locale === 'zh' ? 'CN' : locale.toLocaleUpperCase()}`;
    }

    constructor(prefix = '', public showError = true) {
        this.http = axios.create({
            baseURL: prefix,
            withCredentials: true,
            paramsSerializer(params) {
                return stringify(params, { arrayFormat: 'repeat' });
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        this.http.interceptors.request.use((config: AxiosRequestConfig) => {
            // 接口节流
            if (this.throttleMap.get(`${config.method}:${config.url}`)) {
                this.removeCancel(config);
                this.appendCancel(config);
            }

            const language = config.headers['accept-language'];
            config.headers['accept-language'] = `${
                this.locale(language)
            },zh;q=0.9,en;q=0.8`;

            return config;
        });

        this.http.interceptors.response.use(
            (response: AxiosResponse) => {
                // 拦截未响应的重复请求
                // this.removeCancel(response.config);
                const key = `${response.config.method}:${response.config.url}`;
                if (this.#cancelMap.has(key)) {
                    this.#cancelMap.delete(key);
                    this.throttleMap.delete(key);
                }

                if (response.data.status === 'error') {
                    if (!this.showError) return Promise.reject(response.data);
                    return this.httpErrorHandle(response.data);
                }

                return response.data.data;
            },
            (error: AxiosError) => {
                if (axios.isCancel(error)) {
                    console.error('拦截重复请求', error);
                    return Promise.reject(error);
                }
                if (!this.showError) return Promise.reject(error);

                return this.httpErrorHandle(error);
            },
        );

        const methods = ['get', 'delete', 'post', 'put', 'all', 'spread'];
        methods.map((i: string) => {
            this[i] = this.http[i] ? this.http[i] : axios[i];
            return i;
        });

        // this.showError = true;
    }

    private httpErrorHandle(error: AxiosError) {
        switch (Number(error.code)) {
            case 401:
                this.#cancelMap.clear();
                this.throttleMap.clear();
                window.vm.$router.push({name: 'Login'});
                break;
            default:
                if (error.message) {
                    window.vm.$message.error(error.message);
                }
                break;
        }
        return Promise.reject(error);
    }

    private appendCancel = (config: AxiosRequestConfig): void => {
        const key = `${config.method}:${config.url}`;
        if (!this.#cancelMap.has(key)) {
            // config.cancelToken ||= new axios.CancelToken((cancel) => {
            //     this.cancelMap.set(key, cancel);
            // });
            config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
                this.#cancelMap.set(key, cancel);
            });
        }
    }

    private removeCancel = (config: AxiosRequestConfig): void => {
        const key = `${config.method}:${config.url}`;

        if (this.#cancelMap.has(key)) {
            const cancel = this.#cancelMap.get(key)
                || ((url: string) => console.error('not Function', url));
            cancel(config.url ?? '');
            this.#cancelMap.delete(key);
        }
    }
}