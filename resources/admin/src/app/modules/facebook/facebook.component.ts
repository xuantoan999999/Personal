import { PopAlertComponent } from './../../components/modal/pop-alert/pop-alert.component';
import { FacebookService } from './facebook.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { FacebookFormComponent } from './facebook-form/facebook-form.component';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.css']
})
export class FacebookComponent implements OnInit {
  facebookList;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPage: number;
  sortable: boolean = false;
  rows = [];
  columns = [
    { name: 'Email' },
  ];

  showLoading: boolean = true;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private facebookService: FacebookService
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.facebookService.index(this.activeRoute.snapshot.queryParams)
      .subscribe(data => {
        this.facebookList = data.data;
        this.rows = this.facebookList.facebooks;
        this.totalItems = this.facebookList.totalItems;
        this.itemsPerPage = this.facebookList.itemsPerPage;
        this.currentPage = this.facebookList.currentPage - 1;
        this.totalPage = this.facebookList.totalPage;
        this.showLoading = false;
      });
  }

  setPage(pageInfo) {
    this.router.navigate(['facebook'], { queryParams: { page: pageInfo.offset + 1, limit: this.itemsPerPage } });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    });
  }

  popAdd() {
    const dialogRef = this.dialog.open(FacebookFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  popEdit(id) {
    const dialogRef = this.dialog.open(FacebookFormComponent, {
      width: '750px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  popDelete(id): void {
    const dialogRef = this.dialog.open(PopAlertComponent, {
      width: '400px',
      data: {
        message: 'Do you want to delete this website'
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok === true) {
        this.facebookService.remove(id).subscribe(data => {
          const snackBarRef = this.snackBar.open('Xóa thành công', 'Close', {
            duration: 3000
          });
          this.setPage({ offset: 0 });
        });
      }
    });
  }
}
