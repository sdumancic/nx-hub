import { inject, Injectable } from "@angular/core";
import { AuthDataAccess } from "../../data-access/auth-data-access.service";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { LoginResponse } from "../../data-access/login-response.interface";
import { LocalStorageService } from "../local-storage/local-storage.service";

@Injectable()
export class AuthService {

  dataAccessService = inject(AuthDataAccess);
  localStorageService = inject(LocalStorageService);

  private loginSubject = new BehaviorSubject<LoginResponse>(undefined);

  user$: Observable<LoginResponse> = this.loginSubject.asObservable();
  isLoggedIn$: Observable<boolean> = this.user$.pipe(map(user => !!user.userId));
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.pipe(map(isLoggedIn => !isLoggedIn));
  displayUsername$: Observable<string> = this.user$.pipe(map(user => user ? user.firstName + ' ' + user.lastName : null));
  isAdmin$: Observable<boolean> = this.user$.pipe(map(user => user && user.userRoles && user.userRoles.length > 0 ? user.userRoles?.filter(r => r.roleId === 1 ).length > 0 : null));
  userAvatarUrl$: Observable<string> = this.user$.pipe(map(user =>  user && user.avatarUrl ? user.avatarUrl : null));

  constructor() {
    const token = this.localStorageService.getToken();
    if (token && this.localStorageService.isTokenValid()) {
      this.loginSubject.next(this.localStorageService.getUserDataFromToken());
    } else {
      this.loginSubject.next(undefined);
    }
  }

  login$(email: string, password: string){
    return this.dataAccessService.login$(email,password)
      .pipe(
        tap(login => this.loginSubject.next(login) )
      )
  }

  logout(){
    this.loginSubject.next(undefined)
    this.localStorageService.clearToken()
  }

}
