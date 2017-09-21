import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import url from './../boostrap/config';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
  urlAdmin;
  urlApi;
  csrfToken;

  constructor(private http: Http) {
    this.urlAdmin = url.getConfigs().adminUrl.url;
    this.urlApi = url.getConfigs().apiUrl.url;
    this.csrfToken = (<any>window).csrfToken;
  }

  getAdmin(method: string, id: string = null) {
    let urlString = this.convertUrlAdmin(method, id);
    return this.http.get(urlString)
      .map(response => response.json());
  }

  postAdmin(data: any, method: string, id: string = null) {
    console.log(this.urlAdmin);
    let urlString = this.convertUrlAdmin(method, id);
    data._csrf = this.csrfToken;
    return this.http.post(urlString, data)
      .map(response => response.json());
  }

  convertUrlAdmin(method: string, id: string) {
    let urlString = `${this.urlAdmin}/${method}`;
    if (id) {
      urlString += `/${id}`;
    }
    return urlString;
  }

  getApi(method: string, id: string = null) {
    let urlString = this.convertUrlApi(method, id);
    return this.http.get(urlString)
      .map(response => response.json());
  }

  postApi(data: any, method: string, id: string = null) {
    let urlString = this.convertUrlApi(method, id);
    data._csrf = this.csrfToken;
    return this.http.post(urlString, data)
      .map(response => response.json());
  }

  convertUrlApi(method: string, id: string) {
    let urlString = `${this.urlApi}/${method}`;
    if (id) {
      urlString += `/${id}`;
    }
    return urlString;
  }
}
