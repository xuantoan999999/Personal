import { AccountFormComponent } from './account-form/account-form.component';
import { MdDialog, MdSnackBar } from '@angular/material';
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
  showLoading: boolean = true;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MdDialog,
    private snackBar: MdSnackBar,
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
      })
  }

  setPage(pageInfo) {
    this.router.navigate(['tai-khoan'], { queryParams: { page: pageInfo.offset + 1, limit: this.itemsPerPage } })
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    })
  }

  popAdd(): void {
    let dialogRef = this.dialog.open(AccountFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadDataFromPop(result);
    });
  }

  reloadDataFromPop(result) {
    if (result && result.reload) {
      this.getData();
    }
  }
}
