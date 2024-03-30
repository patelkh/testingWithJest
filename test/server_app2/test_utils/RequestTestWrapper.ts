import {HTTP_METHODS} from '../../../src/app/server_app/model/ServerModel'
export class RequestTestWrapper {
    public body: object | undefined;
    public method: HTTP_METHODS | undefined;
    public url: string; 
    public headers: {};
    
    public on(event, cb) {
        if(event === 'data') {
            cb(JSON.stringify(this.body))
        } else {
            cb()
        }
    }

    public clearFields() {
        this.body = undefined;
        this.method = undefined;
        this.url = '';
        this.headers = {}
    }
}