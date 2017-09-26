import { AuthService } from './../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { HttpService } from './../../services/http.service';
import { Component } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import Config from '../../boostrap/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  config;
  csrfToken;
  showLogin: boolean = false;
  countClick: number = 0;

  constructor(
    private loginService: LoginService,
    private authService: AuthService,
    private snackBar: MdSnackBar,
    private router: Router
  ) {
    this.authService.getUserLogin().subscribe(data => {
      this.config = Config.getConfigs();
      if (data.user) {
        this.router.navigate(['dash-board']);
      }
      this.showLogin = true;
    })
  }

  noFunction(message) {
    if (this.countClick == 5) {
      message = 'Không có đâu. Thằng dev lười code rồi. Đừng cố nữa';
    }
    if (this.countClick == 10) {
      message = 'Đã bảo không có rồi. Đừng bấm nữa.';
    }
    if (this.countClick == 15) {
      message = 'Dai ghê ta';
    }
    if (this.countClick >= 20) {
      message = 'Lầy vãi! Acc nè, vào đi: skecgash1/skecgash';
    }
    let snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 3000
    });
    this.countClick++;
  }

  submit(form) {
    if (!form.valid) {
      return;
    }
    this.loginService.login(form.value.username, form.value.password)
      .subscribe(data => {
        let token = data.token;
        localStorage.setItem(`${this.config.userJWT}_userInfo`, token);
        this.router.navigate(['dash-board'])
      }, error => {
        let err = JSON.parse(error._body);
        let message = err.reduce((string, item) => string + item.message, '');
        let snackBarRef = this.snackBar.open(message, 'Close', {
          duration: 3000
        });
      })
  }

}
