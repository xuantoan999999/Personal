import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Angular app';
  char = {
    info: {
      name: 'Tims'
    }
  };
  post = {
    title: "Title",
    isFavorite: false,
    isSelected: true,
    isChecked: true
  }
  courses = [1, 2];
  viewMode = 'map';
  couresess;
  onFavoriteChanged(eventArgs: boolean) {
    console.log("Favorite change", eventArgs);
  }

  onAdd() {
    this.couresess.push({ id: 6, name: 'course6' })
  }
  onRemove(course) {
    let index = this.courses.indexOf(course);
    this.couresess.splice(index, 1);
  }
  onChange(course) {
    course.name = 'Update';
  }

  loadCourses() {
    this.couresess = [
      { id: 1, name: 'course1' },
      { id: 2, name: 'course2' },
      { id: 3, name: 'course3' },
      { id: 4, name: 'course4' },
      { id: 5, name: 'course5' },
    ];
  }

  trackCourse(index, course) {
    return course ? course.id : undefined;
  }
}
