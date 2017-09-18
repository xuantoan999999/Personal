import { LoginComponent } from './../login/login.component';
import { UserComponent } from './../user/user.component';

let translateRoute = (route:string)=>{
    return `${route}`;
}

export default class Routes {

    static getRoutes() {
        let routesList = [
            {
                path: '',
                redirectTo: 'dang-nhap',
                pathMatch: 'full'
            },
            {
                path: 'dang-nhap',
                component: LoginComponent
            },
            {
                path: 'nguoi-dung',
                component: UserComponent
            }
        ];
        return routesList;
    }
}