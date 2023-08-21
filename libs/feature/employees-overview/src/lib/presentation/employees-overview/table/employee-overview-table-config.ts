export interface DataColumnConfig {
  displayed: boolean
  name: string
  width: number,
}

export enum DatatableSortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
  INITIAL = 'initial'
}

export interface DatatableSortEvent {
  column: string
  direction: DatatableSortDirection
}

export const EMPLOYEE_OVERVIEW_DISPLAYED_COLUMNS: DataColumnConfig[] = [
  {
    displayed: true,
    name: 'username',
    width: 50,
  },
  {
    displayed: true,
    name: 'firstName',
    width: 100,
  },
  {
    displayed: true,
    name: 'lastName',
    width: 100,
  },
  {
    displayed: true,
    name: 'gender',
    width: 50,
  },
  {
    displayed: true,
    name: 'ssn',
    width: 100,
  },
  {
    displayed: true,
    name: 'department',
    width: 100,
  },
  {
    displayed: true,
    name: 'dob',
    width: 50,
  },
  {
    displayed: true,
    name: 'hiredOn',
    width: 50,
  },
  {
    displayed: true,
    name: 'terminatedOn',
    width: 50,
  },
  {
    displayed: false,
    name: 'email',
    width: 100,
  },
  {
    displayed: true,
    name: 'street',
    width: 100,
  },
  {
    displayed: true,
    name: 'city',
    width: 50,
  },
  {
    displayed: true,
    name: 'state',
    width: 50,
  },
  {
    displayed: true,
    name: 'zip',
    width: 50,
  },
  {
    displayed: true,
    name: 'actions',
    width: 50,
  }
]
