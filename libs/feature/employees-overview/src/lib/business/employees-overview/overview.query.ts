import { SearchMeta } from "../../data-access/standard.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export abstract class OverviewQuery {
  public static AMPERSAND = '&';
  public static QUESTIONMARK = '?';
  public static EMPTY_STRING = '';
  abstract build (
    searchValues: any,
    searchMeta: SearchMeta
  ): string


  abstract buildFilter(searchValues: any):string

  abstract buildPagination(searchMeta: SearchMeta): string

  abstract buildSort(searchMeta: SearchMeta): string
}
