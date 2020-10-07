import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConstants } from '../app.constants';
import { LoginData } from '../domain/LoginData';
import { LoginResult } from '../domain/LoginResult';

const AUTH_URL = `${AppConstants.SERVER_URL}/auth/sign_in`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService
  ) {}

  public authenticate(loginData: LoginData): Observable<LoginResult> {
    return this.httpClient
      .post<LoginResult>(AUTH_URL, loginData)
      .pipe(catchError(this.handleError));
  }

  public logout(): void {
    localStorage.setItem(AppConstants.LOGIN_STORAGE, null);
  }

  public isAuthenticated(): boolean {
    const login: LoginResult = JSON.parse(
      localStorage.getItem(AppConstants.LOGIN_STORAGE)
    );
    if (!login) {
      return false;
    }

    const token = login.token;

    if (this.jwtHelper.isTokenExpired(token)) {
      localStorage.setItem(AppConstants.LOGIN_STORAGE, null);
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned error: ${JSON.stringify(error)}`);
      /* console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${ JSON.stringify(error.error) }`); */
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }
}
