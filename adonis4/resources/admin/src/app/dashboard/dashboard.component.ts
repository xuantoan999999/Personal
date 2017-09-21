import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(
    private loginService: LoginService,
    private snackBar: MdSnackBar,
    private router: Router
  ) {
  }
}