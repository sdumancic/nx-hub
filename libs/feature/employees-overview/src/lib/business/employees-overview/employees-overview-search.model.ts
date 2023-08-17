export interface EmployeesOverviewSearch {
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
  state: string[]
  zip: string
  roles: string[]
  department: string[]
  gender:string[]
}
