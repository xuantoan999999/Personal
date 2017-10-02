import { PatternValidator } from './../../../validators/pattern.validators';
import { AccountService } from './../account.service';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  account = {
    list_account: []
  };
  showAdd: boolean = true;
  account_add: object = {};
  addAccount: boolean = false;
  pattern = {
    email: PatternValidator.EMAIL_REGEXP
  }

  constructor(
    // public dialogRef: MdDialogRef<AccountFormComponent>,
    private accountService: AccountService,
    // @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
  ) { }

  ngOnInit() {
  }

  toggleAddForm() {
    this.addAccount = !this.addAccount;
    this.account_add = {};
  }

  submitAddAccount(form) {
    if (!form.valid) {
      return;
    }
    this.account.list_account.push(this.account_add);
    this.toggleAddForm();
  }

  popupEditAccount(data){
    console.log(data);
  }

  deleteAccount(index){
    console.log(index);
  }

  submit(form) {
    console.log('Submit All');
  }

}
