import * as moment from 'moment';
import {
  EMPLOYEE_ADDRESS_CITY,
  EMPLOYEE_ADDRESS_STATE,
  EMPLOYEE_ADDRESS_STREET,
  EMPLOYEE_ADDRESS_ZIP,
  EMPLOYEE_DEPARTMENT,
  EMPLOYEE_DOB,
  EMPLOYEE_EMAIL,
  EMPLOYEE_GENDER,
  EMPLOYEE_HIRED_ON,
  EMPLOYEE_NAME_FIRST,
  EMPLOYEE_NAME_LAST,
  EMPLOYEE_SSN,
  EMPLOYEE_TERMINATED_ON,
  EMPLOYEE_USERNAME,
  EmployeeResourceCollection,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';
import { EmployeeOverviewSearchResultUi } from '../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import {
  EmployeeOverviewSearchUi,
  FILTER_KEY_REMOVABLE,
  FILTER_KEY_TRANSLATION,
  FILTER_KEY_VALUE_TYPE,
} from '../../presentation/employees-overview/form/employee-overview-search.ui.model';
import { EmployeeOverviewSearch } from '../../business/employees-overview/employees-overview-search.model';
import { EmployeeOverviewUrlQueryParams } from './url-params/employee-overview-url-params.model';
import { OverviewFilterChipTypeEnum } from '../../presentation/employees-overview/filter-chips/overview-filter-chip.model';
import { Params } from '@angular/router';
import { ZERO_PAGE_INDEX } from './state/employee-overview-state.model';
import { EmployeeOverviewQuickFilter } from '../../presentation/employees-overview/quick-filter/employee-overview-quick-filter/employee-overview-quick-filter-form.service';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class EmployeeOverviewMapper {
  /**
   * Method is called after successful fetch of data, after data is fetched data is
   * stored into state under searchResults attribute. This method transforms resource
   * collection received from API to search result ui
   * @param resource
   *
   */
  static fromResourceCollectionToSearchResultUi(
    resource: EmployeeResourceCollection
  ): EmployeeOverviewSearchResultUi[] {
    return resource.data?.map(
      (element) =>
        ({
          username: element.username,
          firstName: element.name.first,
          lastName: element.name.last,
          ssn: element.ssn,
          dob: element.dob,
          hiredOn: element.hiredOn,
          terminatedOn: element.terminatedOn,
          email: element.email,
          street: element.address ? element.address.street : null,
          city: element.address ? element.address.city : null,
          state: element.address ? element.address.state : null,
          zip: element.address ? element.address.zip : null,
          department: element.department,
          gender: element.gender,
        } as EmployeeOverviewSearchResultUi)
    );
  }

  static getSortingAttributeKey(key: string): string {
    const sortingAttributesMap: Map<string, string> = new Map([
      ['username', EMPLOYEE_USERNAME],
      ['firstName', EMPLOYEE_NAME_FIRST],
      ['lastName', EMPLOYEE_NAME_LAST],
      ['ssn', EMPLOYEE_SSN],
      ['dob', EMPLOYEE_DOB],
      ['hiredOn', EMPLOYEE_HIRED_ON],
      ['terminatedOn', EMPLOYEE_TERMINATED_ON],
      ['email', EMPLOYEE_EMAIL],
      ['street', EMPLOYEE_ADDRESS_STREET],
      ['city', EMPLOYEE_ADDRESS_CITY],
      ['state', EMPLOYEE_ADDRESS_STATE],
      ['zip', EMPLOYEE_ADDRESS_ZIP],
      ['department', EMPLOYEE_DEPARTMENT],
      ['gender', EMPLOYEE_GENDER],
    ]);
    return sortingAttributesMap.get(key);
  }

  static getFilterTranslation(filterKey: string): string {
    return FILTER_KEY_TRANSLATION.get(filterKey);
  }

  static getFilterType(filterKey: string): OverviewFilterChipTypeEnum {
    return FILTER_KEY_VALUE_TYPE.get(filterKey);
  }

  static getFilterRemovable(filterKey: string): boolean {
    return FILTER_KEY_REMOVABLE.get(filterKey);
  }

  static fromEmployeeOverviewSearchUi(
    searchValues: EmployeeOverviewSearchUi
  ): EmployeeOverviewSearch {
    return {
      username: searchValues.username,
      firstName: searchValues.firstName,
      lastName: searchValues.lastName,
      ssn: null,
      dobFrom: moment(searchValues.dobFrom)
        .utc(true)
        .startOf('day')
        .toISOString(),
      dobUntil: moment(searchValues.dobUntil)
        .utc(true)
        .startOf('day')
        .toISOString(),
      hiredOnFrom: moment(searchValues.hiredOnFrom)
        .utc(true)
        .startOf('day')
        .toISOString(),
      hiredOnUntil: moment(searchValues.hiredOnUntil)
        .utc(true)
        .endOf('day')
        .toISOString(),
      terminatedOnFrom: moment(searchValues.terminatedOnFrom)
        .utc(true)
        .startOf('day')
        .toISOString(),
      terminatedOnUntil: moment(searchValues.terminatedOnUntil)
        .utc(true)
        .endOf('day')
        .toISOString(),
      email: searchValues.email,
      street: searchValues.street,
      city: searchValues.city,
      state: searchValues.state,
      zip: searchValues.zip,
      roles: searchValues.roles,
      department: searchValues.department,
      gender: searchValues.gender,
    } as EmployeeOverviewSearch;
  }

  static searchUiToQueryParams(
    searchValues: EmployeeOverviewSearchUi,
    searchMeta: SearchMeta
  ): Partial<EmployeeOverviewUrlQueryParams> {
    return {
      username: searchValues.username,
      firstName: searchValues.firstName,
      lastName: searchValues.lastName,
      dobFrom: moment(searchValues.dobFrom).isValid()
        ? moment(searchValues.dobFrom).format('DD-MM-YYYY')
        : null,
      dobUntil: moment(searchValues.dobUntil).isValid()
        ? moment(searchValues.dobUntil).format('DD-MM-YYYY')
        : null,
      hiredOnFrom: moment(searchValues.hiredOnFrom).isValid()
        ? moment(searchValues.hiredOnFrom).format('DD-MM-YYYY')
        : null,
      hiredOnUntil: moment(searchValues.hiredOnUntil).isValid()
        ? moment(searchValues.hiredOnUntil).format('DD-MM-YYYY')
        : null,
      terminatedOnFrom: moment(searchValues.terminatedOnFrom).isValid()
        ? moment(searchValues.terminatedOnFrom).format('DD-MM-YYYY')
        : null,
      terminatedOnUntil: moment(searchValues.terminatedOnUntil).isValid()
        ? moment(searchValues.terminatedOnUntil).format('DD-MM-YYYY')
        : null,
      email: searchValues.email,
      street: searchValues.street,
      city: searchValues.city,
      state: searchValues.state?.length ? searchValues.state.join(',') : null,
      zip: searchValues.zip,
      roles: searchValues.roles?.length ? searchValues.roles.join(',') : null,
      department: searchValues.department?.length
        ? searchValues.department.join(',')
        : null,
      gender: searchValues.gender?.length
        ? searchValues.gender.join(',')
        : null,
      currentPage: searchMeta.pagination.index.toString(10),
      pageSize: searchMeta.pagination.size.toString(10),
      sortColumn: searchMeta.sorting.attribute || null,
      sortDirection: searchMeta.sorting.attribute
        ? searchMeta.sorting.order || null
        : null,
    };
  }

  static queryParamsToSearchUi(
    queryParams: Partial<EmployeeOverviewUrlQueryParams>
  ): EmployeeOverviewSearchUi {
    return {
      username: queryParams.username ?? null,
      firstName: queryParams.firstName ?? null,
      lastName: queryParams.lastName ?? null,
      dobFrom:
        queryParams.dobFrom != null
          ? moment(queryParams.dobFrom, 'DD-MM-YYYY').utc(true).toISOString()
          : null,
      dobUntil:
        queryParams.dobUntil != null
          ? moment(queryParams.dobUntil, 'DD-MM-YYYY').utc(true).toISOString()
          : null,
      hiredOnFrom:
        queryParams.hiredOnFrom != null
          ? moment(queryParams.hiredOnFrom, 'DD-MM-YYYY')
              .utc(true)
              .toISOString()
          : null,
      hiredOnUntil:
        queryParams.hiredOnUntil != null
          ? moment(queryParams.hiredOnUntil, 'DD-MM-YYYY')
              .utc(true)
              .toISOString()
          : null,
      terminatedOnFrom:
        queryParams.terminatedOnFrom != null
          ? moment(queryParams.terminatedOnFrom, 'DD-MM-YYYY')
              .utc(true)
              .toISOString()
          : null,
      terminatedOnUntil:
        queryParams.terminatedOnUntil != null
          ? moment(queryParams.terminatedOnUntil, 'DD-MM-YYYY')
              .utc(true)
              .toISOString()
          : null,
      email: queryParams.email ?? null,
      street: queryParams.street ?? null,
      city: queryParams.city ?? null,
      state: queryParams.state != null ? queryParams.state.split(',') : null,
      zip: queryParams.zip ?? null,
      roles: queryParams.roles != null ? queryParams.roles.split(',') : null,
      department:
        queryParams.department != null
          ? queryParams.department.split(',')
          : null,
      gender: queryParams.gender != null ? queryParams.gender.split(',') : null,
    };
  }

  static queryParamsToSearchMeta(
    queryParams: Partial<EmployeeOverviewUrlQueryParams>
  ): SearchMeta {
    return {
      sorting: {
        order: queryParams.sortDirection ?? 'initial',
        attribute: queryParams.sortColumn ?? '',
      },
      pagination: {
        size: queryParams.pageSize ? parseInt(queryParams.pageSize, 10) : 10,
        index: queryParams.currentPage
          ? parseInt(queryParams.currentPage, 10)
          : ZERO_PAGE_INDEX,
      },
    };
  }

  static fromQueryParamsToOverviewUrlQueryParams(
    queryParams: Params
  ): Partial<EmployeeOverviewUrlQueryParams> {
    const response: Partial<EmployeeOverviewUrlQueryParams> = {};
    for (const [key, value] of Object.entries(queryParams)) {
      response[key] = value;
    }

    return response;
  }

  static fromSearchUiToQuickFilterUi(
    params: EmployeeOverviewSearchUi
  ): EmployeeOverviewQuickFilter {
    return {
      username: params.username ?? null,
      firstName: params.firstName ?? null,
      lastName: params.lastName ?? null,
    } as EmployeeOverviewQuickFilter;
  }
}
