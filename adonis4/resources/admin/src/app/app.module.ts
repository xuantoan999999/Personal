import { LoginService } from './modules/login/login.service';
import { HttpService } from './services/http.service';
import { LoginComponent } from './modules/login/login.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSnackBarModule } from '@angular/material';
import { UserComponent } from './modules/user/user.component';
import { AuthGuardService } from './services/auth-guard.service';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthService } from './services/auth/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoginGuardService } from './services/login-guard/login-guard.service';
import { IconComponent } from './components/icon/icon.component';
import { MenuComponent } from './components/menu/menu.component';
import { ListItemsComponent } from './components/sidebar/list-items/list-items.component';
import { ItemComponent } from './components/sidebar/item/item.component';

let routes = [
  {
    path: '',
    redirectTo: 'dang-nhap',
    pathMatch: 'full'
  },
  {
    path: 'dang-nhap',
    component: LoginComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'dash-board',
    canActivate: [AuthGuardService],
    component: DashboardComponent,
  },
  {
    path: 'nguoi-dung',
    component: UserComponent,
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    DashboardComponent,
    SidebarComponent,
    IconComponent,
    MenuComponent,
    ListItemsComponent,
    ItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    HttpService,
    LoginService,
    AuthGuardService,
    LoginGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
