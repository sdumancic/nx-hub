import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { IOverviewFilterChip } from "../overview-filter-chip.model";
import { materialModules } from "@hub/shared/ui/material";
import { CartItem } from "@hub/shared/model/food-models";


@Component({
  selector: 'hub-overview-filter-chip',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './overview-filter-chip.component.html',
  styleUrls: ['./overview-filter-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class OverviewFilterChipComponent {
  @Input() filterChips: IOverviewFilterChip[]
  @Output() filterChipRemoved = new EventEmitter<string>()

  identifyChipById(index: number, item: IOverviewFilterChip): string {
    return item.controlKey;
  }
}
