import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppError } from "app/posts/app-error";
import { NotFoundError } from "app/posts/not-found-error";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
    constructor(private url: string, private http: Http) { }

    getAll() {
        return this.http.get(this.url).map(resp=> resp.json());
    }

    create(recourses) {
        return this.http.post(this.url, JSON.stringify(recourses)).map(resp=> resp.json());
    }

    update(recourses) {
        return this.http.put(this.url + '/' + recourses.id, JSON.stringify({ isRead: true })).map(resp=> resp.json())
    }

    delete(recourses) {
        return this.http.delete(this.url + '/' + recourses.id)
            .catch((error: Response) => {
                if (error.status === 404)
                    return Observable.throw(new NotFoundError());
                return Observable.throw(new AppError(error))
            });
    }
}
