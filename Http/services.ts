import HttpServices from './HttpServices';
export default class ContentServices extends HttpServices {

    getList(data: any): Promise<any> {
        // 节流
        this.HttpClient.throttleMap.set('get:-----', true);

        return this.HttpClient.get('-----', {params: data});
    }

    putList(data: any): Promise<void> {
        return this.HttpClient.put('-----', data);
    }
}