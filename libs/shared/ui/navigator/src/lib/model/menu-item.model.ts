export interface SubmenuItem {
  name: string;
  routerLink?: string;
}

export interface MenuItem {
  name: string;
  icon: string;
  routerLink?: string;
  children?: SubmenuItem[]
}
