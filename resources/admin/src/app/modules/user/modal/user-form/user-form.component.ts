import { PatternValidator } from './../../../../validators/pattern.validators';
import { UserService } from './../../user.service';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  multiple = true;
  submited: boolean = false;
  allRoles = [];
  user: object = {};
  pattern = {
    email: PatternValidator.EMAIL_REGEXP
  }

  constructor(
    public dialogRef: MdDialogRef<UserFormComponent>,
    private userService: UserService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    this.allRoles = this.userService.allRole();
  }

  ngOnInit() {
  }
  onNoClick(): void {
    // this.dialogRef.close();
  }

  submit(form) {
    this.submited = true;
    console.log(form, this.user);
    if (!form.valid) {
      return;
    }
    // this.loginService.login(form.value.username, form.value.password)
    //   .subscribe(data => {
    //     let token = data.token;
    //     localStorage.setItem(`${this.config.userJWT}_userInfo`, token);
    //     this.router.navigate(['dash-board'])
    //   }, error => {
    //     let err = JSON.parse(error._body);
    //     let message = err.reduce((string, item) => string + item.message, '');
    //     let snackBarRef = this.snackBar.open(message, 'Close', {
    //       duration: 3000
    //     });
    //   })
  }
}
