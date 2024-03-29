import { EmployeeOverviewSearch } from './employees-overview-search.model';
import { OverviewQuery } from './../../business/employees-overview/overview.query';
import { Injectable } from '@angular/core';
import { EmployeeOverviewMapper } from '../../facade/employees-overview/employee-overview.mapper';
import {
  isNotBlank,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';
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
  EMPLOYEE_ROLES,
  EMPLOYEE_SSN,
  EMPLOYEE_TERMINATED_ON,
  EMPLOYEE_USERNAME,
} from '../../../../../../shared/workplace-reservation-data-access/src/lib/employees-overview/employee-overview.model';

@Injectable()
export class EmployeesOverviewQuery extends OverviewQuery {
  public static AMPERSAND = '&';
  public static QUESTIONMARK = '?';
  public static EMPTY_STRING = '';

  build(
    searchValues: Partial<EmployeeOverviewSearch>,
    searchMeta: SearchMeta
  ): string {
    const filter = this.buildFilter(searchValues);
    const pagination = this.buildPagination(searchMeta);
    const sort = this.buildSort(searchMeta);
    const elements: string[] = [];
    if (isNotBlank(filter)) {
      elements.push(filter);
    }
    if (isNotBlank(pagination)) {
      elements.push(pagination);
    }
    if (isNotBlank(sort)) {
      elements.push(sort);
    }
    if (elements.length > 0) {
      return EmployeesOverviewQuery.QUESTIONMARK.concat(
        elements.join(EmployeesOverviewQuery.AMPERSAND)
      );
    } else {
      return EmployeesOverviewQuery.EMPTY_STRING;
    }
  }

  buildFilter(searchValues: Partial<EmployeeOverviewSearch>): string {
    let filterString = EmployeesOverviewQuery.EMPTY_STRING;
    if (searchValues.username) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_USERNAME)
        .concat('=')
        .concat(searchValues.username);
    }
    if (searchValues.firstName) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_NAME_FIRST)
        .concat('=')
        .concat(searchValues.firstName);
    }
    if (searchValues.lastName) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_NAME_LAST)
        .concat('=')
        .concat(searchValues.lastName);
    }
    if (searchValues.ssn) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_SSN)
        .concat('=')
        .concat(searchValues.ssn);
    }
    if (searchValues.dobFrom) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_DOB)
        .concat('_gte=')
        .concat(searchValues.dobFrom);
    }
    if (searchValues.dobUntil) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_DOB)
        .concat('_lte=')
        .concat(searchValues.dobUntil);
    }
    if (searchValues.hiredOnFrom) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_HIRED_ON)
        .concat('_gte=')
        .concat(searchValues.hiredOnFrom);
    }
    if (searchValues.hiredOnUntil) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_HIRED_ON)
        .concat('_lte=')
        .concat(searchValues.hiredOnUntil);
    }
    if (searchValues.terminatedOnFrom) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_TERMINATED_ON)
        .concat('_gte=')
        .concat(searchValues.terminatedOnFrom);
    }
    if (searchValues.terminatedOnUntil) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_TERMINATED_ON)
        .concat('_lte=')
        .concat(searchValues.terminatedOnUntil);
    }
    if (searchValues.email) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_EMAIL)
        .concat('_like=')
        .concat(searchValues.email);
    }
    if (searchValues.street) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_ADDRESS_STREET)
        .concat('_like=')
        .concat(searchValues.street);
    }
    if (searchValues.city) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_ADDRESS_CITY)
        .concat('_like=')
        .concat(searchValues.city);
    }
    if (searchValues.zip) {
      filterString = filterString
        .concat(EmployeesOverviewQuery.AMPERSAND)
        .concat(EMPLOYEE_ADDRESS_ZIP)
        .concat('=')
        .concat(searchValues.zip);
    }
    if (searchValues.state && searchValues.state.length > 0) {
      searchValues.state.forEach(
        (el) =>
          (filterString = filterString
            .concat(EmployeesOverviewQuery.AMPERSAND)
            .concat(EMPLOYEE_ADDRESS_STATE)
            .concat('=')
            .concat(el))
      );
    }
    if (searchValues.roles && searchValues.roles.length > 0) {
      searchValues.roles.forEach(
        (el) =>
          (filterString = filterString
            .concat(EmployeesOverviewQuery.AMPERSAND)
            .concat(EMPLOYEE_ROLES)
            .concat('=')
            .concat(el))
      );
    }
    if (searchValues.department && searchValues.department.length > 0) {
      searchValues.department.forEach(
        (el) =>
          (filterString = filterString
            .concat(EmployeesOverviewQuery.AMPERSAND)
            .concat(EMPLOYEE_DEPARTMENT)
            .concat('=')
            .concat(el))
      );
    }
    if (searchValues.gender && searchValues.gender.length > 0) {
      searchValues.gender.forEach(
        (el) =>
          (filterString = filterString
            .concat(EmployeesOverviewQuery.AMPERSAND)
            .concat(EMPLOYEE_GENDER)
            .concat('=')
            .concat(el))
      );
    }
    return filterString.substring(1);
  }

  buildPagination(searchMeta: SearchMeta) {
    let pagination = EmployeesOverviewQuery.EMPTY_STRING;
    if (searchMeta == null || searchMeta.pagination == null) {
      return pagination;
    }
    if (
      searchMeta.pagination.index == null ||
      searchMeta.pagination.size == null
    ) {
      return pagination;
    }
    const start = searchMeta.pagination.index * searchMeta.pagination.size;
    const end = start + searchMeta.pagination.size - 1;
    pagination = pagination
      .concat('_limit=')
      .concat(searchMeta.pagination.size.toString())
      .concat('&_page=')
      .concat(searchMeta.pagination.index.toString());
    return pagination;
  }

  buildSort(searchMeta: SearchMeta) {
    let sorting = EmployeesOverviewQuery.EMPTY_STRING;
    if (searchMeta == null || searchMeta.sorting == null) {
      return sorting;
    }
    if (searchMeta.sorting.attribute == null) {
      return sorting;
    }
    const apiColumn = EmployeeOverviewMapper.getSortingAttributeKey(
      searchMeta.sorting.attribute
    );
    sorting = sorting
      .concat('_sort=')
      .concat(apiColumn)
      .concat(EmployeesOverviewQuery.AMPERSAND)
      .concat('_order=')
      .concat(searchMeta.sorting.order);
    return sorting;
  }
}
