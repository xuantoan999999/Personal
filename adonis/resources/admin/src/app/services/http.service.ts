import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import url from './../boostrap/config';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
  url;

  constructor(private http: Http) {
    this.url = url.getConfigs().url;
  }

  get(method: string, id: string = null) {
    let urlString = this.convertUrl(method, id);
    return this.http.get(urlString)
      .map(response => response.json());
  }

  post(data: any, method: string, id: string = null) {
    let urlString = this.convertUrl(method, id);
    return this.http.post(urlString, data)
      .map(response => response.json());
  }

  convertUrl(method: string, id: string) {
    let urlString = `${this.url}/${method}`;
    if (id) {
      urlString += `/${id}`;
    }
    return urlString;
  }
}
