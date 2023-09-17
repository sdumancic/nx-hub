import {
  EmployeeOverviewMetadata,
  SearchMeta,
} from '@hub/shared/workplace-reservation-data-access';
import { EmployeeOverviewSearchResultUi } from '../presentation/employees-overview/table/employee-overview-table/employee-overview-search-result.ui.model';
import { EmployeeOverviewSearchUi } from '../presentation/employees-overview/form/employee-overview-search.ui.model';

export const enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export interface ErrorState {
  errorMsg: string;
}

export type CallState = LoadingState | ErrorState;

export function getError(callState: CallState): LoadingState | string | null {
  if ((callState as ErrorState).errorMsg !== undefined) {
    return (callState as ErrorState).errorMsg;
  }

  return null;
}

export interface EmployeeOverviewStatePart {
  searchResult: EmployeeOverviewSearchResultUi[];
  searchValues: EmployeeOverviewSearchUi;
  searchMeta: SearchMeta;
  searchCount: number;
  callState: CallState;
}

export interface CheckinsOverviewStatePart {
  //TODO: Switch to checkin search results
  searchResult: EmployeeOverviewSearchResultUi[];
  searchValues: EmployeeOverviewSearchUi;
  searchMeta: SearchMeta;
  searchCount: number;
  callState: CallState;
}

export interface EmployeeOverviewNgRxState {
  employeesOverview: EmployeeOverviewStatePart;
  checkinsOverview: CheckinsOverviewStatePart;
  metadata: EmployeeOverviewMetadata;
  metadataCallState: CallState;
}

export const SEARCH_META_DEFAULT: SearchMeta = {
  pagination: { index: 1, size: 10 },
  sorting: { attribute: 'orderNumber', order: 'asc' },
};

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
  gender: null,
};

export const EMPTY_EMPLOYEES_OVERVIEW_STORE: EmployeeOverviewNgRxState = {
  employeesOverview: {
    searchResult: [],
    searchValues: SEARCH_VALUES_DEFAULT,
    searchMeta: SEARCH_META_DEFAULT,
    searchCount: 0,
    callState: LoadingState.INIT,
  },
  checkinsOverview: {
    searchResult: [],
    searchValues: SEARCH_VALUES_DEFAULT,
    searchMeta: SEARCH_META_DEFAULT,
    searchCount: 0,
    callState: LoadingState.INIT,
  },
  metadata: {
    roles: [],
    departments: [],
    genders: [],
    states: [],
  },
  metadataCallState: LoadingState.INIT,
};

export interface EmployeeOverviewState {
  searchResult: EmployeeOverviewSearchResultUi[];
  searchValues: EmployeeOverviewSearchUi;
  searchMeta: SearchMeta;
  searchCount: number;
  metadata: EmployeeOverviewMetadata;
}

export const ZERO_PAGE_INDEX = 1;

export const EMPTY_RESPONSE = {
  data: [],
  metadata: {
    page: 0,
    size: 10,
    totalResources: 0,
  },
};
