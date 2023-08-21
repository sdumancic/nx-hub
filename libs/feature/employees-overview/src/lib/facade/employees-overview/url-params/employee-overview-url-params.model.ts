export interface OverviewCommonUrlQueryParams {
  // common fields
  activeTab: string
  sortColumn: string
  sortDirection: string
  currentPage: string
  pageSize: string
}
export interface EmployeeOverviewUrlQueryParams extends OverviewCommonUrlQueryParams{

  username: string
  firstName: string
  lastName: string
  ssn: string
  dobFrom: string
  dobUntil: string
  hiredOnFrom: string
  hiredOnUntil: string
  terminatedOnFrom: string
  terminatedOnUntil: string
  email: string
  street: string
  city: string
  state: string
  zip: string
  roles: string
  department: string
  gender:string

}
