import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {

  }
  canActivate(route, state: RouterStateSnapshot) {
    return false;
  }
}
