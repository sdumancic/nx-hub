import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'hub-feature-address-overview',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './feature-address-overview.component.html',
  styleUrls: ['./feature-address-overview.component.scss'],
})
export class FeatureAddressOverviewComponent {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  onAdd() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  onDelete() {

  }
}
