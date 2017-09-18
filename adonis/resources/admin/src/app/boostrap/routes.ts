import { UserComponent } from './../user/user.component';
import { LoginComponent } from "app/login/login.component";

let translateRoute = (route:string)=>{
    return `admin/${route}`;
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
                path: translateRoute('nguoi-dung'),
                component: UserComponent
            }
        ]
        return routesList;
    }
}