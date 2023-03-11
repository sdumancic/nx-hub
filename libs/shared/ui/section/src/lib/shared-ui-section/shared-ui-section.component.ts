import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';
import { materialModules } from "@hub/shared/ui/material";

@Component({
  selector: 'shared-ui-section',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './shared-ui-section.component.html',
  styleUrls: ['./shared-ui-section.component.scss'],
})
export class SharedUiSectionComponent {
  @Input() icon: string | undefined
  constructor() { }
}
