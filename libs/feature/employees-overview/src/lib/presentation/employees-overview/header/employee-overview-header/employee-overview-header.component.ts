import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { materialModules } from "@hub/shared/ui/material";

@Component({
  selector: 'hub-employee-overview-header',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './employee-overview-header.component.html',
  styleUrls: ['./employee-overview-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeOverviewHeaderComponent {
  @Output() actionsClick = new EventEmitter<void>()
  @Output() createNewEmployeeClick = new EventEmitter<void>()

  createNewEmployee (): void {
    this.createNewEmployeeClick.next()
  }
}
