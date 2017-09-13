export default class Url {
    constructor() {
        this.query = [];
        this.host = window.location.host;
        this.hostname = window.location.hostname;
        this.pathname = window.location.pathname;
        this.origin = window.location.origin;
        this.hash = window.location.hash;
        this.href = window.location.href;

        let url = window.location.hash.split('?');
        this.url_string = url[0];
        let url_query_arr = url[1] ? url[1].split('&') : [];
        this.query = url_query_arr.map((item) => {
            let tmp = item.split('=');
            return {
                key: tmp[0],
                value: tmp[1]
            }
        })
    }

    queryToString(){
        // if()
    }

    toUrlString(){
        console.log(this);
    }

    changeUrl(){

    }

}

new Url()
