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
  constructor() { }

  ngOnInit() {
    if (this.data.child && this.data.child.length > 0) {
      this.fullHeight += this.data.child.length * 42;
    }
  }
  openSubmenu() {
    this.isOpenSubmenu = !this.isOpenSubmenu;
    this.heightItem = this.isOpenSubmenu ? this.fullHeight : this.heighItemDefault;
  }
}
