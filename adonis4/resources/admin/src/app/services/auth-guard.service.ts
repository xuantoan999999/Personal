import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Router, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Injectable, Input } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(route, state: RouterStateSnapshot) {
    return this.authService.getUserLogin()
      .map(resp => {
        let user = resp.user;
        if (!user) {
          this.router.navigate(['dang-nhap']);
          return false;
        }
        if (user.roles.indexOf('admin') == -1) {
          this.router.navigate(['dang-nhap']);
          return false;
        }
        (<any>window).user = user;
        return true;
      })
  }
}
