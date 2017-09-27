import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  multiple = true;
  selectedValue: string;

  foods = [
    { value: 'steak', viewValue: 'Steak' },
    { value: 'pizza', viewValue: 'Pizza' },
    { value: 'tacos', viewValue: 'Tacos' }
  ];

  constructor(
    public dialogRef: MdDialogRef<UserFormComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
  onNoClick(): void {
    // this.dialogRef.close();
  }

  submit(form) {
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
    console.log("ns dgknsdk");
  }
}
