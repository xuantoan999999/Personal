import { FacebookService } from './../facebook.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-facebook-form',
  templateUrl: './facebook-form.component.html',
  styleUrls: ['./facebook-form.component.css']
})
export class FacebookFormComponent implements OnInit {
  facebook: object = {};
  id: string;
  showAdd: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FacebookFormComponent>,
    private facebookService: FacebookService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
  ) {
    if (data.id) {
      this.facebookService.info(data.id).subscribe(resp => {
        this.facebook = resp.facebook;
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
      this.facebookService.add({
        data: this.facebook
      }).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        const snackBarRef = this.snackBar.open('Thêm fanpage thành công', 'Close', {
          duration: 3000
        });
      });
    } else {
      this.facebookService.update({
        data: this.facebook
      }, this.id).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        const snackBarRef = this.snackBar.open('Sửa fanpage thành công', 'Close', {
          duration: 3000
        });
      });
    }
  }
}
