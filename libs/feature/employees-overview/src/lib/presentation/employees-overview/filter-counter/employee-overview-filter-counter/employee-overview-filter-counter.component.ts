import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { materialModules } from '@hub/shared/ui/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'hub-employee-overview-filter-counter',
  standalone: true,
  imports: [CommonModule, ...materialModules],
  templateUrl: './employee-overview-filter-counter.component.html',
  styleUrls: ['./employee-overview-filter-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeOverviewFilterCounterComponent {
  @Input() activeFiltersCount$: Observable<number>;
}
