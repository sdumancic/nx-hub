import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hub-overview-filter-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-filter-counter.component.html',
  styleUrls: ['./overview-filter-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewFilterCounterComponent {
  @Input() activeFiltersCount: number
}
