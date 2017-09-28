import { UserFormComponent } from './modal/user-form/user-form.component';
import { UserService } from './user.service';
import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  usersList;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPage: number;
  sortable: boolean = false;
  rows = [];
  columns = [
    { name: 'Email' },
    { name: 'Name' }
  ];

  animal: string;

  constructor(
    private userService: UserService,
    public dialog: MdDialog
  ) {
    this.getData();
  }

  getData() {
    this.userService.index()
      .subscribe(data => {
        this.usersList = data.usersList;
        this.rows = this.usersList.users;
      })
  }

  openDialogAdd(): void {
    let dialogRef = this.dialog.open(UserFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

  openDialogEdit(): void {
    let dialogRef = this.dialog.open(UserFormComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getData();
    });
  }

}
