import HttpServices from './HttpServices';
export default class ContentServices extends HttpServices {

    getList(data: any): Promise<any> {
        return this.HttpClient.get('-----', {params: data});
    }

    putList(data: any): Promise<void> {
        return this.HttpClient.put('-----', data);
    }
}