import { Router } from '@angular/router';
import { PopAlertComponent } from './../modal/pop-alert/pop-alert.component';
import { MdDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import Config from '../../boostrap/config';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  config;
  constructor(
    public dialog: MdDialog,
    private router: Router
  ) {
    this.config = Config.getConfigs();
  }

  ngOnInit() {
  }

  logOut() {
    let dialogRef = this.dialog.open(PopAlertComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to log out'
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok === true) {
        localStorage.removeItem(`${this.config.userJWT}_userInfo`);
        this.router.navigate(['dang-nhap'])
      }
    });
  }
}
