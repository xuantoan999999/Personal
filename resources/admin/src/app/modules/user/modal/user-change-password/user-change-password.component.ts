import { UserService } from './../../user.service';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { PatternValidator } from './../../../../validators/pattern.validators';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-user-change-password',
  templateUrl: './user-change-password.component.html',
  styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {
  pattern = {
    email: PatternValidator.EMAIL_REGEXP
  }
  id: string;
  user: object = {};

  constructor(
    public dialogRef: MdDialogRef<UserChangePasswordComponent>,
    private userService: UserService,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
  ) { }

  ngOnInit() {
  }

  submit(form) {
    if (!form.valid) {
      return;
    }
    this.userService.changePassword({ data: this.user }, this.data.id).subscribe(data => {
      this.dialogRef.close({
        reload: true
      });
      let snackBarRef = this.snackBar.open('Đổi password thành công', 'Close', {
        duration: 3000
      });
    })
  }
}
