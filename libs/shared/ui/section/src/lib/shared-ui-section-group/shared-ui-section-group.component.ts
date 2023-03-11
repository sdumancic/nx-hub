import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-ui-section-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-ui-section-group.component.html',
  styleUrls: ['./shared-ui-section-group.component.scss'],
})
export class SharedUiSectionGroupComponent {
  @Input() title: string | undefined
}
