import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  contactMethods = [
    { id: 1, name: 'Email' },
    { id: 2, name: 'Phone' },
  ];
  constructor() { }

  submit(f) {
    f.value
    console.log(f);
  }

}
