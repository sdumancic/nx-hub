import { SearchMeta } from "../../data-access/standard.model";
import { forwardRef, Injectable } from "@angular/core";
import { EmployeesOverviewQuery } from "./employees-overview.query";

@Injectable()
export abstract class OverviewQuery {

  abstract build (
    searchValues: any,
    searchMeta: SearchMeta
  ): string


  abstract buildFilter(searchValues: any):string

  abstract buildPagination(searchMeta: SearchMeta): string

  abstract buildSort(searchMeta: SearchMeta): string
}
