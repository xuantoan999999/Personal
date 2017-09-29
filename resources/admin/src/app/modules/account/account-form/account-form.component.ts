import { AccountService } from './../account.service';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  account: object = {};
  showAdd: boolean = true;

  constructor(
    public dialogRef: MdDialogRef<AccountFormComponent>,
    private accountService: AccountService,
    @Inject(MD_DIALOG_DATA) public data: any,
    private snackBar: MdSnackBar,
  ) { }

  ngOnInit() {
  }
}
