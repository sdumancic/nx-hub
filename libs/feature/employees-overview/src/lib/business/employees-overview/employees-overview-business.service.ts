import { Injectable } from '@angular/core';

import { delay, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeOverviewSearch } from './employees-overview-search.model';
import { OverviewQuery } from './overview.query';
import {
  EmployeeResourceCollection,
  EmployeesOverviewDataAccess,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';

@Injectable()
export class EmployeesOverviewBusiness {
  constructor(
    private readonly daoService: EmployeesOverviewDataAccess,
    private overviewQuery: OverviewQuery
  ) {}

  searchEmployees$(
    searchValues: Partial<EmployeeOverviewSearch>,
    searchMeta: SearchMeta
  ): Observable<EmployeeResourceCollection> {
    const queryParamsText = this.overviewQuery.build(searchValues, searchMeta);
    return this.daoService.fetchEmployees$(queryParamsText).pipe(
      delay(2000),
      map((res) => {
        return {
          data: res.data,
          metadata: {
            page: searchMeta.pagination.index,
            size: searchMeta.pagination.size,
            totalResources: res.totalCount ? Number(res.totalCount) : 0,
          },
        };
      })
    );
  }

  fetchMetadata$() {
    return this.daoService.fetchMetadata$();
  }
}
