import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MenuItem } from "../model/menu-item.model";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'hub-navigator-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigator-item.component.html',
  styleUrls: ['./navigator-item.component.scss'],
})
export class NavigatorItemComponent {

  @Input() isMenuItemOpened: boolean = false;
  @Input() item: MenuItem| undefined;


}
