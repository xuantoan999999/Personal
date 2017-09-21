import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LoginGuardService implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route, state: RouterStateSnapshot) {
    return this.authService.getUserLogin()
      .map(resp => {
        let user = resp.user;
        if (user) {
          this.router.navigate(['dash-board']);
          return false;
        }
        if (user.roles.indexOf('admin') == -1) {
          this.router.navigate(['dash-board']);
          return false;
        }
        (<any>window).user = user;
        return true;
      })
  }

}
