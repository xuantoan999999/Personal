import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  showSidebar: boolean = false;
  constructor() {
    let count = 0;
    var checkSideBar = setInterval(() => {
      if ((<any>window).user) {
        this.showSidebar = true;
        clearInterval(checkSideBar);
      }
      if (count > 10) {
        this.showSidebar = false;
        clearInterval(checkSideBar);
      }
      count++;
    }, 100);
  }
}
