import { PopAlertComponent } from './../../components/modal/pop-alert/pop-alert.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  accountList;
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
  filter = {
    search: ''
  };
  showLoading: boolean = true;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.accountService.index(this.activeRoute.snapshot.queryParams)
      .subscribe(data => {
        this.accountList = data.accountList;
        this.rows = this.accountList.accounts;
        this.totalItems = this.accountList.totalItems;
        this.itemsPerPage = this.accountList.itemsPerPage;
        this.currentPage = this.accountList.currentPage - 1;
        this.totalPage = this.accountList.totalPage;
        this.showLoading = false;
        this.filter.search = this.activeRoute.snapshot.queryParams.search;
      });
  }

  setPage(pageInfo) {
    this.router.navigate(['tai-khoan'], { queryParams: { page: pageInfo.offset + 1, limit: this.itemsPerPage } });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    });
  }

  popAdd(): void {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadDataFromPop(result);
    });
  }

  popDeleteUser(id): void {
    const dialogRef = this.dialog.open(PopAlertComponent, {
      width: '400px',
      data: {
        message: 'Do you want to delete this user'
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok === true) {
        this.accountService.remove(id).subscribe(data => {
          const snackBarRef = this.snackBar.open('Xóa user thành công', 'Close', {
            duration: 3000
          });
          this.setPage({ offset: 0 });
        });
      }
    });
  }

  filterForm(form) {
    if (!form.valid) {
      return;
    }
    const queryParams = { page: 1, limit: this.itemsPerPage, search: null };

    if (this.filter.search) {
      queryParams.search = this.filter.search;
    }
    this.router.navigate(['tai-khoan'], { queryParams });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    });
  }

  resetForm() {
    const queryParams = { page: 1, limit: this.itemsPerPage };

    this.router.navigate(['tai-khoan'], { queryParams });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    });
  }

  reloadDataFromPop(result) {
    if (result && result.reload) {
      this.getData();
    }
  }
}
