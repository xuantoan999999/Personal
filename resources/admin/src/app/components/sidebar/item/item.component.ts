import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() data;
  heighItemDefault = 42;
  fullHeight: number = this.heighItemDefault;
  heightItem: number = this.fullHeight;
  isOpenSubmenu: boolean = false;
  page: number;
  limit: number;
  constructor() { }

  ngOnInit() {
    if (this.data.extra.child && this.data.extra.child.length > 0) {
      this.fullHeight += this.data.extra.child.length * 42;
    }
    this.page = this.data.extra.page || 1;
    this.limit = this.data.extra.limit || 10;
  }
  openSubmenu() {
    this.isOpenSubmenu = !this.isOpenSubmenu;
    this.heightItem = this.isOpenSubmenu ? this.fullHeight : this.heighItemDefault;
  }
}
