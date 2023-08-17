import { ResourceCollection } from "../standard.model";

export const EMPLOYEE_USERNAME = 'username'
export const EMPLOYEE_PASSWORD = 'password'
export const EMPLOYEE_NAME_FIRST = 'name.first'
export const EMPLOYEE_NAME_LAST = 'name.last'
export const EMPLOYEE_SSN = 'ssn'
export const EMPLOYEE_DOB = 'dob'
export const EMPLOYEE_HIRED_ON = 'hiredOn'
export const EMPLOYEE_TERMINATED_ON = 'terminatedOn'
export const EMPLOYEE_EMAIL = 'email'
export const EMPLOYEE_DEPARTMENT = 'department'
export const EMPLOYEE_GENDER = 'gender'
export const EMPLOYEE_PORTRAIT = 'portrait'
export const EMPLOYEE_THUMBNAIL = 'thumbnail'
export const EMPLOYEE_ADDRESS_STREET = 'address.street'
export const EMPLOYEE_ADDRESS_CITY = 'address.city'
export const EMPLOYEE_ADDRESS_STATE = 'address.state'
export const EMPLOYEE_ADDRESS_ZIP = 'address.zip'
export const EMPLOYEE_ROLES = 'roles'

export interface EmployeeOverview {
  username: string
  password: string
  name: {
    first: string,
    last: string
  },
  ssn: string
  dob: string
  hiredOn: string
  terminatedOn: string
  email: string
  phones: Phone[]
  address: Address
  roles: string[]
  department: string
  gender: string
  portrait: string
  thumbnail: string
}

export interface Address{
  street: string
  city: string
  state: string
  zip: number
}
export interface Phone{
  type: string
  number:string
}

export interface EmployeeOverviewMetadata {
  roles: string[]
  departments: string[]
  genders: string[]
  states: string[]
}


export interface EmployeeResourceCollection extends ResourceCollection {
  data: EmployeeOverview[]
}

