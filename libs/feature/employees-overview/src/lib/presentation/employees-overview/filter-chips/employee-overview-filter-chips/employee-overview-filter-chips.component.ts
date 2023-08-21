import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { OverviewFilterChip } from "../overview-filter-chip.model";
import { materialModules } from "@hub/shared/ui/material";


@Component({
  selector: 'hub-employee-overview-filter-chips',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './employee-overview-filter-chips.component.html',
  styleUrls: ['./employee-overview-filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class EmployeeOverviewFilterChipsComponent {
  @Input() filterChips: OverviewFilterChip[]
  @Output() filterChipRemoved = new EventEmitter<string>()
  identifyChipById(index: number, item: OverviewFilterChip): string {
    return item.controlKey;
  }
}
