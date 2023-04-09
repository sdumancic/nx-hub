import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../services/auth-service/auth-service.service";
import { take } from "rxjs";
import { materialModules } from "@hub/shared/ui/material";
import { LoginResponse } from "../../data-access/login-response.interface";
import { LocalStorageService } from "../../services/local-storage/local-storage.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'hub-login',
  standalone: true,
  imports: [CommonModule,...materialModules],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form:FormGroup;
  passwordHidden = true
  localStorageService = inject(LocalStorageService);
  authError = false
  authErrorMsg: string

  constructor(
    private fb:FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.form = this.fb.group({
      email: ['sanjin.dumancic@yahoo.com',Validators.required],
      password: ['123456',Validators.required]
    });

  }
  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login$(val.email, val.password)
        .pipe(take(1))
        .subscribe({
            next: (login: LoginResponse) => {
              this.authError = false
              if (login.token) {
                this.localStorageService.setToken(login.token)
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                this.router.navigate([returnUrl]).then()
              }
            },
            error: (error: HttpErrorResponse) => {
              this.authError = true
              if (error.status !== 400) {
                this.authErrorMsg = error.message
              }
            },
          }
        );

    }
  }

  toggleHideShowPasswordIcon() {
    this.passwordHidden = !this.passwordHidden;
  }
}
