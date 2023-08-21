import { OverviewFilterChipTypeEnum } from "../filter-chips/overview-filter-chip.model";

export interface EmployeeOverviewSearchUi {

  username: string
  firstName: string
  lastName: string
  dobFrom: string
  dobUntil: string
  hiredOnFrom: string
  hiredOnUntil: string
  terminatedOnFrom: string
  terminatedOnUntil: string
  email: string
  street: string
  city: string
  state: string[]
  zip: string
  roles: string[]
  department: string[]
  gender:string[]

}

export const STATE_CONTROL_KEY = 'state'
export const ROLES_CONTROL_KEY = 'roles'
export const DEPARTMENT_CONTROL_KEY = 'department'
export const GENDER_CONTROL_KEY = 'gender'

export const FILTER_KEY_TRANSLATION: Map<string, string> = new Map<
string,
string
>([
  ['username', 'employees.overview.filter-chip.label.username'],
  ['firstName', 'employees.overview.filter-chip.label.firstName'],
  ['lastName', 'employees.overview.filter-chip.label.lastName'],
  ['dobFrom','employees.overview.filter-chip.label.dobFrom'],
  ['dobUntil','employees.overview.filter-chip.label.dobUntil'],
  ['hiredOnFrom','employees.overview.filter-chip.label.hiredOnFrom'],
  ['hiredOnUntil','employees.overview.filter-chip.label.hiredOnUntil'],
  ['terminatedOnFrom','employees.overview.filter-chip.label.terminatedOnFrom'],
  ['terminatedOnUntil','employees.overview.filter-chip.label.terminatedOnUntil'],
  ['email','employees.overview.filter-chip.label.email'],
  ['street','employees.overview.filter-chip.label.street'],
  ['city','employees.overview.filter-chip.label.city'],
  ['state','employees.overview.filter-chip.label.city'],
  ['zip','employees.overview.filter-chip.label.zip'],
  ['roles','employees.overview.filter-chip.label.roles'],
  ['department','employees.overview.filter-chip.label.department'],
  ['gender','employees.overview.filter-chip.label.gender'],
])

export const FILTER_KEY_VALUE_TYPE: Map<string, OverviewFilterChipTypeEnum> =
  new Map<string, OverviewFilterChipTypeEnum>([
    ['username', OverviewFilterChipTypeEnum.string],
    ['firstName', OverviewFilterChipTypeEnum.string],
    ['lastName', OverviewFilterChipTypeEnum.string],
    ['email', OverviewFilterChipTypeEnum.string],
    ['street', OverviewFilterChipTypeEnum.string],
    ['city', OverviewFilterChipTypeEnum.string],
    ['state', OverviewFilterChipTypeEnum.string],
    ['zip', OverviewFilterChipTypeEnum.number],
    ['roles', OverviewFilterChipTypeEnum.string],
    ['department', OverviewFilterChipTypeEnum.string],
    ['gender', OverviewFilterChipTypeEnum.string],
    ['dobFrom', OverviewFilterChipTypeEnum.date],
    ['dobUntil', OverviewFilterChipTypeEnum.date],
    ['hiredOnFrom', OverviewFilterChipTypeEnum.date],
    ['hiredOnUntil', OverviewFilterChipTypeEnum.date],
    ['terminatedOnFrom', OverviewFilterChipTypeEnum.date],
    ['terminatedOnUntil', OverviewFilterChipTypeEnum.date]
  ])

export const FILTER_KEY_REMOVABLE: Map<string, boolean> = new Map<
string,
boolean
>([
  ['username', true],
  ['firstName', true],
  ['lastName', true],
  ['email', true],
  ['street', true],
  ['city', true],
  ['state', true],
  ['zip', true],
  ['roles', true],
  ['department', true],
  ['gender', true],
  ['dobFrom', true],
  ['dobUntil', true],
  ['hiredOnFrom', true],
  ['hiredOnUntil', true],
  ['terminatedOnFrom', true],
  ['terminatedOnUntil', true]

])

