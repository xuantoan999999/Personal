import { EqualValidator } from './validators/equalValidators.validators';
import { LoginService } from './modules/login/login.service';
import { HttpService } from './services/http.service';
import { LoginComponent } from './modules/login/login.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSnackBarModule, MdSelectModule, MdOptionModule, MdDialogModule } from '@angular/material';
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
import { DashboardService } from './modules/dashboard/dashboard.service';
import { UserService } from './modules/user/user.service';
import { UserFormComponent } from './modules/user/modal/user-form/user-form.component';

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
    UserFormComponent,
    EqualValidator
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdInputModule,
    MdSnackBarModule,
    MdSelectModule,
    MdOptionModule,
    MdDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxDatatableModule,
    RouterModule.forRoot([
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
        component: DashboardComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: 'nguoi-dung',
        component: UserComponent,
        canActivate: [AuthGuardService]
      },
    ], {
        useHash: true
      })
  ],
  providers: [
    HttpService,
    LoginService,
    AuthGuardService,
    LoginGuardService,
    AuthService,
    DashboardService,
    UserService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserFormComponent
  ]
})

export class AppModule { }
