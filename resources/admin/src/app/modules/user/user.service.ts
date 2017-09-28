import { Http } from '@angular/http';
import { HttpService } from './../../services/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService extends HttpService {
  constructor(http: Http) {
    super(http);
  }
  index() {
    return this.getAdmin('nguoi-dung')
  }
  allRole() {
    return [
      { name: 'Admin', value: 'admin' },
      { name: 'User', value: 'user' },
      { name: 'Super Admin', value: 'supper_admin' }
    ]
  }
}
