import { PatternValidator } from './../../../validators/pattern.validators';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-edit-form',
  templateUrl: './account-edit-form.component.html',
  styleUrls: ['./account-edit-form.component.scss']
})
export class AccountEditFormComponent implements OnInit {
  @Input() account;
  @Input() formAccount;
  @ViewChild('formEditAccount') form;
  @Output() onChangeForm = new EventEmitter();
  @Output() onRemoveAccount = new EventEmitter();
  pattern = {
    email: PatternValidator.EMAIL_REGEXP
  }
  constructor() { }

  ngOnInit() {
    this.form.control.statusChanges
      .subscribe(values => {
        this.onChangeForm.emit(values);
      });
  }
  removeAccount(){
    this.onRemoveAccount.emit(true);
  }
}
