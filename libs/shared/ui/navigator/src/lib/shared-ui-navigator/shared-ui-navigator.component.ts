import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MenuItem, SubmenuItem } from "../model/menu-item.model";
import { NavigatorItemComponent } from "../navigator-item/navigator-item.component";

@Component({
  selector: 'hub-shared-ui-navigator',
  standalone: true,
  imports: [CommonModule, NavigatorItemComponent],
  templateUrl: './shared-ui-navigator.component.html',
  styleUrls: ['./shared-ui-navigator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SharedUiNavigatorComponent {
  private _expandedMenuItems: { [key: number]: true | undefined } = {};
  private _closed = false;

  @Input() items: MenuItem[] = []
  @Input() showProfileDetails = false
  @Input() avatarUrl = 'https://avatars.githubusercontent.com/u/6890336?v=4'
  @Input() profileName: string | undefined
  @Input() profileJob: string | undefined
  @Output() logoutEmitter = new EventEmitter<void>()

  set isClosed(value: boolean) {
    this._closed = value;
  }
  get isClosed(): boolean {
    return this._closed;
  }

  toggleMenuItemOpened(value: number) {
    if (this._expandedMenuItems[value]) {
      delete this._expandedMenuItems[value];
    } else {
      this._expandedMenuItems[value] = true;
    }
  }

  isMenuItemOpened(value: number) {
    return this._expandedMenuItems[value] !== undefined
      ? this._expandedMenuItems[value]
      : false;
  }

  onLogout() {
    this.logoutEmitter.next()
  }
}
