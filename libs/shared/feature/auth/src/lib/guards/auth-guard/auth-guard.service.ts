import { inject, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route, Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthService } from "../../services/auth-service/auth-service.service";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {

  localStorageService = inject(LocalStorageService);

  constructor(
    private mustBeAdmin: boolean,
    private authService: AuthService,
    private router: Router
  ) {
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let result = false;
    if (this.mustBeAdmin){
      result = this.checkUserIsAuthenticatedAndAdmin();
      }
    else {
      result = this.checkUserIsAuthenticated();
    }
    if (result){
      return true
    } else {
      const extractedUrl = this.router.getCurrentNavigation().extractedUrl.toString();

      this.router.navigate(['shell/login'],{ queryParams: { returnUrl: extractedUrl }});
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let result = false;
    if (this.mustBeAdmin){
      result = this.checkUserIsAuthenticatedAndAdmin();
    }
    else {
      result = this.checkUserIsAuthenticated();
    }
    if (result){
      return true
    } else {
      this.router.navigate(['/shell/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }

  private checkUserIsAuthenticatedAndAdmin(){
    const token = this.localStorageService.getToken()
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]))
      if (tokenDecode.isAdmin && !this.tokenExpired(tokenDecode.exp)) {
        return true
      }
    }
    return false
  }

  private checkUserIsAuthenticated(){
    const token = this.localStorageService.getToken()
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]))
      if (!this.tokenExpired(tokenDecode.exp)) {
        return true
      }
    }
    return false
  }

  private tokenExpired(expiration: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration
  }
}
