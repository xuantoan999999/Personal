import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
    <h1>dng ksdng</h1>
    <div *ngIf="myArr; then tmpl1 else tmpl2"></div>

    <ng-template #tmpl1>True</ng-template>
    <ng-template #tmpl2>False</ng-template>
  `,
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    // myArr = ['him', 'hers', 'yours'];
    myArr = true;
}
