import { inject, Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";
import { LoginResponse } from "./login-response.interface";
import { Observable, take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthDataAccess {

  http = inject(HttpClient);

  constructor(
    @Inject(FOOD_API_BACKEND_URL) private url: string,
  ) { }

  login$(email: string, password: string): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.url}/login`,{email, password});
  }

}
