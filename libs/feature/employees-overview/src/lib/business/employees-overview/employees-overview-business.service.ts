import { Injectable } from "@angular/core";

import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  EmployeesOverviewDataAccess
} from "../../data-access/employees-overview/employees-overview-data-access.service";
import { EmployeeOverviewSearch } from "./employees-overview-search.model";
import { LovItem, SearchMeta } from "../../data-access/standard.model";
import { EmployeeResourceCollection } from "../../data-access/employees-overview/employee-overview.model";
import { OverviewQuery } from "./overview.query";


@Injectable()
export class EmployeesOverviewBusiness {
  constructor (
    private readonly daoService: EmployeesOverviewDataAccess,
    private overviewQuery: OverviewQuery
  ) {}

  searchEmployees$ (
    searchValues: Partial<EmployeeOverviewSearch>,
    searchMeta: SearchMeta
  ): Observable<EmployeeResourceCollection> {
    const queryParamsText = this.overviewQuery.build(searchValues, searchMeta)
    return this.daoService.fetchEmployees$(queryParamsText)
     .pipe(map(res => {
       return {
         data: res.data,
         metadata: {
           page: searchMeta.pagination.index,
           size: searchMeta.pagination.size,
           totalResources: res.totalCount ? Number( res.totalCount) : 0
         }
       }
     } ))
  }

  refreshMetadata$ = ()  => {
    return this.daoService.refreshMetadata$()
  }

  get rolesLov$ (): Observable<LovItem[]> {
    return this.mapStringToLov(this.daoService.roles)
  }

  get departmentsLov$ (): Observable<LovItem[]> {
    return this.mapStringToLov(this.daoService.departments)
  }

  get gendersLov$ (): Observable<LovItem[]> {
    return this.mapStringToLov(this.daoService.genders)
  }

  get statesLov$ (): Observable<LovItem[]> {
    return this.mapStringToLov(this.daoService.states)
  }

  mapStringToLov(
    values: Observable<string[]>
  ): Observable<LovItem[]> {
    return values.pipe(
      map((value: string[]) =>
        value.map(
          item => <LovItem>{ code: item, value: item }
        )
      )
    )
  }

}
