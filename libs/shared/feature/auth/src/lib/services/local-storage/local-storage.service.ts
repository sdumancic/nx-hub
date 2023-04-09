import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";
import { LoginResponse } from "../../data-access/login-response.interface";

export interface LoginTokenContent extends LoginResponse{
  "iat": number
  "exp": number
}
@Injectable()
export class LocalStorageService {
  static TOKEN = 'jwtToken'
  setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  setToken(value: string) {
    this.setItem(LocalStorageService.TOKEN, value)
  }

  getItem(key: string): string | null {
    const val = localStorage.getItem(key)
    if (val) return val
    else return null
  }

  getToken() {
    return this.getItem(LocalStorageService.TOKEN)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  isTokenValid() {
    const token = this.getToken()
    if (token) {
      const tokenDecode: LoginTokenContent = jwt_decode(token);
      return !this.tokenExpired(tokenDecode.exp)
    }
    return false
  }

  private tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration
  }

  clearToken() {
    this.removeItem(LocalStorageService.TOKEN)
  }

  getUserDataFromToken() {
    const token = this.getToken()
    if (token) {
      const tokenDecode: LoginTokenContent = jwt_decode(token);
      if (tokenDecode) {
        return tokenDecode
      }
      return null
    }
    return null
  }


}
