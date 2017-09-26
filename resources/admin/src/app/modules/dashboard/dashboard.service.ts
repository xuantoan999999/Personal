import { Injectable } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Http } from '@angular/http';

@Injectable()
export class DashboardService extends HttpService {

  constructor(http: Http) {
    super(http);
  }

  getDashboard() {
    return this.getAdmin('dash-board');
  }

}
