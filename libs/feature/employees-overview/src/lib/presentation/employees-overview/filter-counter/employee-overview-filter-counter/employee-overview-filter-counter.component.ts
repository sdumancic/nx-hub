import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { addChildren } from "@nx/angular/src/generators/library/lib/add-children";
import { materialModules } from "@hub/shared/ui/material";
import { Observable } from "rxjs";
import { EmployeeOverviewFiltersService } from "../../../../facade/employee-overview-filters.service";

@Component({
  selector: 'hub-employee-overview-filter-counter',
  standalone: true,
  imports: [CommonModule,...materialModules],
  templateUrl: './employee-overview-filter-counter.component.html',
  styleUrls: ['./employee-overview-filter-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeOverviewFilterCounterComponent implements OnInit
{

  activeFiltersCount$: Observable<number>


  constructor(private filtersService: EmployeeOverviewFiltersService) {
  }

  ngOnInit(): void {
    this.activeFiltersCount$ = this.filtersService.activeFiltersCount$;
  }




}
