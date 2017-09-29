import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
    showSidebar: boolean = false;

    menuSidebar = [
        // this.initMenuSidebar('', 'Item 1', 'home', [
        //     this.initMenuSidebar('', 'Sub 1'),
        //     this.initMenuSidebar('', 'Sub 2')
        // ]),
        // this.initMenuSidebar('', 'Item 2', 'home'),
        this.initMenuSidebar('dash-board', 'Dashboard', {
            icon: 'dashboard',
        }),
        this.initMenuSidebar('nguoi-dung', 'User', {
            icon: 'supervisor_account'
        }),
        this.initMenuSidebar('tai-khoan', 'Account', {
            icon: 'account_circle'
        }),
    ];
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

    initMenuSidebar(route, title, extra) {
        return { route, title, extra };
    }

}
