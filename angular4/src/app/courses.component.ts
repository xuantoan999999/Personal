import { CoursesService } from './courses.service';
import { Component } from '@angular/core';

@Component({
    selector: 'courses',
    template: `
        <h2>{{ title }}</h2>
        <h2 [textContent]="title"></h2>

        <div class="row">
            <img src="{{ imageUrl }}" class="col-xs-6"/>
            <img [src]="imageUrl" class="col-xs-6"/>
            <div class="clearfix"></div>
        </div>
        <table>
            <tr>
                <td [attr.colspan]="colSpan"></td>
            </tr>
        </table>
        <button class="btn btn-primary" [class.active]="isActive" [class.hover]="isHover">Save</button>
        <button [style.backgroundColor]="isActive ? 'blue' : 'white'">Save</button>
        <div (click)="onDivClick()">
            <button class="btn btn-primary" (click)="onSave($event)">Save</button>
        </div>
        <input (keyup.enter)="onKeyUp($event)" />
        <br>
        <input [(ngModel)]="email" (keyup.enter)="onKeyUp2()" />
        {{email}}
        <p>{{ course.title | uppercase | lowercase}}</p>
        <p>{{ course.rating | number:'2.1-1' }}</p>
        <p>{{ course.student | number:'1.2-2' }}</p>
        <p>{{ course.price | currency:'AUD':true:'3.2-2' }}</p>
        <p>{{ course.releaseDate | date:'dd/MM/yyyy' }}</p>
    `
})

export class CoursesComponent {
    title = "List of courses.";
    courses;
    imageUrl = "http://lorempixel.com/400/200";
    colSpan = 2;
    isActive = false;
    isHover = false;
    email = "asfkasnf";
    course = {
        title: "Angular course",
        rating: 4.9745,
        student: 30123,
        price: 109.95,
        releaseDate: new Date()
    };

    constructor(service: CoursesService) {
        this.courses = service.getCourses();
    }

    onDivClick() {
        console.log("Div clicked");
    }

    onSave($event) {
        $event.stopPropagation();
        console.log("Button clicked", $event);
    }

    onKeyUp($event) {
        console.log("Enter", $event);
    }

    onKeyUp2() {
        console.log(this.email);
    }
}