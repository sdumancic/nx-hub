import { DataSource } from "@angular/cdk/collections";
import { Observable } from "rxjs";

import { EmployeeOverviewSearchResultUi } from "./employee-overview-table/employee-overview-search-result.ui.model";
import { EmployeeOverviewFacade } from "../../../facade/employees-overview/employee-overview-facade.service";

export class EmployeeOverviewDataSource implements DataSource<EmployeeOverviewSearchResultUi> {
  loading$ = this.facade.loading$;

  constructor(private readonly facade: EmployeeOverviewFacade) {}

  connect(): Observable<EmployeeOverviewSearchResultUi[]> {
    return this.facade.searchResult$;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() {}


}
