import { LoginComponent } from "app/login/login.component";

export default class Routes {
    static getRoutes() {
        return [
            {
                path: '',
                redirectTo: 'dang-nhap',
                pathMatch: 'full'
            },
            {
                path: 'dang-nhap',
                component: LoginComponent
            }
        ];
    }
}