import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { HttpService } from './../http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService extends HttpService {

  constructor(private router: Router, http: Http) {
    super(http);
  }

  getUserLogin() {
    let token = localStorage['Personal_userInfo'];
    let data = {
      token
    }
    return this.postApi(data, 'is-login');
  }
}