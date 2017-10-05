import { PopAlertComponent } from './../../components/modal/pop-alert/pop-alert.component';
import { WebsiteFormComponent } from './website-form/website-form.component';
import { MdDialog, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { WebsiteService } from './website.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit {
  websiteList;
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
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MdDialog,
    private snackBar: MdSnackBar,
    private websiteService: WebsiteService
  ) {
    this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.websiteService.index(this.activeRoute.snapshot.queryParams)
      .subscribe(data => {
        this.websiteList = data.data;
        this.rows = this.websiteList.websites;
        this.totalItems = this.websiteList.totalItems;
        this.itemsPerPage = this.websiteList.itemsPerPage;
        this.currentPage = this.websiteList.currentPage - 1;
        this.totalPage = this.websiteList.totalPage;
        this.showLoading = false;
        this.filter.search = this.activeRoute.snapshot.queryParams.search;
      })
  }

  setPage(pageInfo) {
    this.router.navigate(['website'], { queryParams: { page: pageInfo.offset + 1, limit: this.itemsPerPage } })
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    })
  }

  popAdd() {
    let dialogRef = this.dialog.open(WebsiteFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }
  popEdit(id) {
    let dialogRef = this.dialog.open(WebsiteFormComponent, {
      width: '750px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  popDelete(id): void {
    let dialogRef = this.dialog.open(PopAlertComponent, {
      width: '400px',
      data: {
        message: 'Do you want to delete this website'
      }
    });

    dialogRef.afterClosed().subscribe(ok => {
      if (ok === true) {
        this.websiteService.remove(id).subscribe(data => {
          let snackBarRef = this.snackBar.open('Xóa thành công', 'Close', {
            duration: 3000
          });
          this.setPage({ offset: 0 });
        })
      }
    });
  }

  filterForm(form) {
    if (!form.valid) {
      return;
    }
    let queryParams = { page: 1, limit: this.itemsPerPage };

    if (this.filter.search) (<any>queryParams).search = this.filter.search;
    this.router.navigate(['website'], { queryParams });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    })
  }

  resetForm() {
    let queryParams = { page: 1, limit: this.itemsPerPage };

    this.router.navigate(['website'], { queryParams });
    this.activeRoute.queryParams.subscribe(data => {
      this.getData();
    })
  }
}
