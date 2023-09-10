import { Injectable } from '@angular/core';
import { SearchMeta } from '@hub/shared/workplace-reservation-data-access';

@Injectable()
export abstract class OverviewQuery {
  abstract build(searchValues: any, searchMeta: SearchMeta): string;

  abstract buildFilter(searchValues: any): string;

  abstract buildPagination(searchMeta: SearchMeta): string;

  abstract buildSort(searchMeta: SearchMeta): string;
}
