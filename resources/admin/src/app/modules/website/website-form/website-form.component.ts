import { WebsiteService } from './../website.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-website-form',
  templateUrl: './website-form.component.html',
  styleUrls: ['./website-form.component.css']
})
export class WebsiteFormComponent implements OnInit {
  website: object = {};
  id: string;
  showAdd: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<WebsiteFormComponent>,
    private websiteService: WebsiteService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    if (data.id) {
      this.websiteService.info(data.id).subscribe(resp => {
        this.website = resp.website;
        this.showAdd = false;
        this.id = data.id;
      });
    }
  }

  ngOnInit() {
  }

  submit(form) {
    if (!form.valid) {
      return;
    }
    if (!this.id) {
      this.websiteService.add({
        data: this.website
      }).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        const snackBarRef = this.snackBar.open('Thêm link thành công', 'Close', {
          duration: 3000
        });
      });
    } else {
      this.websiteService.update({
        data: this.website
      }, this.id).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        const snackBarRef = this.snackBar.open('Sửa link thành công', 'Close', {
          duration: 3000
        });
      });
    }
  }
}
