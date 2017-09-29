import { PopAlertComponent } from './../../components/modal/pop-alert/pop-alert.component';
import { UserChangePasswordComponent } from './modal/user-change-password/user-change-password.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserFormComponent } from './modal/user-form/user-form.component';
import { UserService } from './user.service';
import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  usersList;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPage: number;
  sortable: boolean = false;
  rows = [];
  columns = [
    { name: 'Email' },
    { name: 'Name' }
  ];
  showLoading: boolean = true;

  animal: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MdDialog
  ) {
    this.getData();
  }

  getRoleString(roles) {
    return roles
      .map(role => this.userService.searchRole(role).name)
      .join(', ');
  }

  getData() {
    this.userService.index(this.activeRoute.snapshot.queryParams)
      .subscribe(data => {
        this.usersList = data.usersList;
        this.rows = this.usersList.users;
        this.totalItems = this.usersList.totalItems;
        this.itemsPerPage = this.usersList.itemsPerPage;
        this.currentPage = this.usersList.currentPage - 1;
        this.totalPage = this.usersList.totalPage;
        this.showLoading = false;
      })
  }

  setPage(pageInfo) {
    this.router.navigate(['nguoi-dung'], { queryParams: { page: pageInfo.offset + 1, limit: this.itemsPerPage } })
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    })
  }

  popAdd(): void {
    let dialogRef = this.dialog.open(UserFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadDataFromPop(result);
    });
  }

  popEdit(id): void {
    let dialogRef = this.dialog.open(UserFormComponent, {
      width: '750px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadDataFromPop(result);
    });
  }

  popChangePassword(id): void {
    let dialogRef = this.dialog.open(UserChangePasswordComponent, {
      width: '750px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  popDeleteUser(id): void {
    let dialogRef = this.dialog.open(PopAlertComponent, {
      width: '400px',
      data: {
        message: 'Do you want to delete this user'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  reloadDataFromPop(result) {
    if (result && result.reload) {
      this.getData();
    }
  }
}
