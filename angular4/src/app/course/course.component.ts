import { CoursesService } from './../courses.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  inputs: ['isSelected'],
})
export class CourseComponent {
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
  text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore`;
  @Input() isFavorite: boolean;
  isSelected: boolean;
  @Input('is-checked') isChecked: boolean;
  @Output('change') click = new EventEmitter();

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

  onClick() {
    this.isSelected = !this.isSelected;
    this.click.emit(this.isSelected);
  }

}
