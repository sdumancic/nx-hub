export interface LoginResponse{
  "userId": number
  "firstName": string,
  "lastName": string,
  "email": string,
  "isAdmin": boolean,
  "avatarUrl": string,
  "userRoles": {
    "roleId": number,
    "roleName": string
  }[],
  "token"?: string
}
