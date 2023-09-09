import {
  EmployeeOverviewSearchResultUi
} from "../../../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model";
import {
  EmployeeOverviewSearchUi
} from "../../../presentation/employees-overview/form/employee-overview-search.ui.model";
import { SearchMeta } from "../../../data-access/standard.model";
import { EmployeeOverviewMetadata } from "../../../data-access/employees-overview/employee-overview.model";

export interface EmployeeOverviewState {
  searchResult: EmployeeOverviewSearchResultUi[]
  searchValues: EmployeeOverviewSearchUi
  searchMeta: SearchMeta
  searchCount: number
  metadata: EmployeeOverviewMetadata
}

export const SEARCH_VALUES_DEFAULT: EmployeeOverviewSearchUi = {
  username: null,
  firstName: null,
  lastName: null,
  dobFrom: null,
  dobUntil: null,
  hiredOnFrom: null,
  hiredOnUntil: null,
  terminatedOnFrom: null,
  terminatedOnUntil: null,
  email: null,
  street: null,
  city: null,
  state: null,
  zip: null,
  roles: null,
  department: null,
  gender:null,
}

export const ZERO_PAGE_INDEX = 1;
export const SEARCH_META_DEFAULT: SearchMeta = {
  pagination: { index: 1, size: 10 },
  sorting: { attribute: 'orderNumber', order: 'asc' }
}
export const METADATA_DEFAULT: EmployeeOverviewMetadata = {
  roles: [],
  departments: [],
  genders: [],
  states: []
}

export const EMPLOYEE_OVERVIEW_INITIAL_STATE: EmployeeOverviewState = {
  searchResult: [],
  searchValues: SEARCH_VALUES_DEFAULT,
  searchMeta: SEARCH_META_DEFAULT,
  searchCount: 0,
  metadata: {
    roles: [],
    departments: [],
    genders: [],
    states: []
  }

}

export const EMPTY_RESPONSE = {
  data: [],
  metadata: {
    page: 0,
    size: 10,
    totalResources: 0
  }
}
