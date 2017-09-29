import { Http } from '@angular/http';
import { HttpService } from './../../services/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService extends HttpService {
  method: string = 'nguoi-dung';
  constructor(http: Http) {
    super(http);
  }
  index(query) {
    return this.getAdmin(this.method, query)
  }

  add(data) {
    return this.postAdmin(data, this.method)
  }
  allRole() {
    return [
      { name: 'Admin', value: 'admin' },
      { name: 'User', value: 'user' },
      { name: 'Super Admin', value: 'supper_admin' }
    ]
  }
}
