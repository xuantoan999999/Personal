import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Component } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  data;
  countUser: number = 0;
  countWebsite: number = 0;
  countAccount: number = 0;
  allAccount: number = 0;

  constructor(
    private dashboardService: DashboardService,

    private snackBar: MdSnackBar,
    private router: Router
  ) {
    this.dashboardService.getDashboard()
      .subscribe(data => {
        this.countUser = data.countUser;
        this.countWebsite = data.countWebsite;
        this.countAccount = data.countAccount;
        this.allAccount = data.allAccount;
      })
  }
}