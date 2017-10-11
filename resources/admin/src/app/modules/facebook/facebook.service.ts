import { HttpService } from './../../services/http.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FacebookService extends HttpService {
  method: string = 'facebook';
  constructor(http: Http) {
    super(http);
  }

  index(query) {
    return this.getAdmin(this.method, query);
  }

  add(data) {
    return this.postAdmin(data, this.method);
  }

  info(id) {
    return this.getAdmin(this.method, { id });
  }
  update(data, id) {
    return this.postAdmin(data, this.method, id);
  }

  remove(id) {
    return this.deleteAdmin(`${this.method}`, { id })
  }
}
