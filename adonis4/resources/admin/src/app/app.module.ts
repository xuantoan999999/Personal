import { LoginService } from './login/login.service';
import { HttpService } from './services/http.service';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSnackBarModule } from '@angular/material';
import { UserComponent } from './user/user.component';
import { AuthGuardService } from './services/auth-guard.service';

let routes = [
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent
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
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
