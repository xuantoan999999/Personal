import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { HttpService } from './../services/http.service';
import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import Config from 'app/boostrap/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  config;
  constructor(
    private loginService: LoginService,
    private snackBar: MdSnackBar,
    private router:Router
  ) {
    this.config = Config.getConfigs();
  }

  submit(form) {
    if (!form.valid) {
      return;
    }
    this.loginService.login(form.value.username, form.value.password)
      .subscribe(data => {
        let token = data.token;
        localStorage.setItem(`${this.config.userJWT}_userInfo`, token);
        this.router.navigate(['/nguoi-dung'])
        // Storage.set(`${this.config.userJWT}_userInfo`, token, this.config.storageExpireTime);
      }, error => {
        let err = JSON.parse(error._body).error;
        let snackBarRef = this.snackBar.open(err.message, 'Close', {
          duration: 3000
        });
      })
  }

}
