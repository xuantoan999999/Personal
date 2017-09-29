import { Http } from '@angular/http';
import { HttpService } from './../../services/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AccountService extends HttpService {
  method: string = 'tai-khoan';
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