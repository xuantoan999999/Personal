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
  }

  ngOnInit() {
  }
  onNoClick(): void {
    // this.dialogRef.close();
  }

  submit(form) {
    console.log(form, this.user);
    if (!form.valid) {
      return;
    }
    this.userService.add({
      data: this.user
    }).subscribe(data => {
      this.dialogRef.close();
      let snackBarRef = this.snackBar.open('Thêm user thành công', 'Close', {
        duration: 3000
      });
    })
  }
}
