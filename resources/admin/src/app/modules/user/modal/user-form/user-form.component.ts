import { PatternValidator } from './../../../../validators/pattern.validators';
import { UserService } from './../../user.service';
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  multiple = true;
  allRoles = [];
  user: object = {};
  showPassword: boolean = true;
  id: string;
  pattern = {
    email: PatternValidator.EMAIL_REGEXP
  }

  constructor(
    public dialogRef: MdDialogRef<UserFormComponent>,
    private userService: UserService,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
  ) {
    this.allRoles = this.userService.allRole();
    if (data.id) {
      this.userService.info(data.id).subscribe(data => {
        if (!data.user) {
          let snackBarRef = this.snackBar.open('Không tìm thấy user', 'Close', {
            duration: 3000
          });
          this.dialogRef.close();
        }
        else {
          this.user = data.user;
          this.id = data.user._id;
        }
      })
      this.showPassword = false;
    }
  }

  ngOnInit() {
  }
  onNoClick(): void {
    // this.dialogRef.close();
  }

  submit(form) {
    if (!form.valid) {
      return;
    }
    if (this.showPassword) {
      this.userService.add({
        data: this.user
      }).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        let snackBarRef = this.snackBar.open('Thêm user thành công', 'Close', {
          duration: 3000
        });
      })
    }
    else {
      this.userService.update({
        data: this.user
      }, this.id).subscribe(data => {
        this.dialogRef.close({
          reload: true
        });
        let snackBarRef = this.snackBar.open('Sửa user thành công', 'Close', {
          duration: 3000
        });
      })
    }
  }
}
