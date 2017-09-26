import { Router, NavigationEnd } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showNavigator: boolean = false;
  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let url = event.url;
        this.showNavigator = url.search('dang-nhap') == -1;
      }
    });

  }
}
