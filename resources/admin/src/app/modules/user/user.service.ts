import { Http } from '@angular/http';
import { HttpService } from './../../services/http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService extends HttpService {
  method: string = 'nguoi-dung';
  private allRoles = [
    { name: 'Admin', value: 'admin' },
    { name: 'User', value: 'user' },
    { name: 'Super Admin', value: 'supper_admin' }
  ];
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
  changePassword(data, id) {
    return this.postAdmin(data, `${this.method}-doi-mat-khau`, id);
  }
  allRole() {
    return this.allRoles;
  }

  searchRole(value) {
    return this.allRoles.find(role => value == role.value);
  }
}