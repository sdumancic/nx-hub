import { Inject, inject, Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { LocalStorageService } from "../services/local-storage/local-storage.service";
import { FOOD_API_BACKEND_URL } from "@hub/shared/util/app-config";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  localStorageService = inject(LocalStorageService)

  constructor(@Inject(FOOD_API_BACKEND_URL) private url: string) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getToken()
    const isApiUrl = req.url.startsWith(this.url)
    if (token && isApiUrl) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }



  }

}
