import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RefreshCollectionSuccessAction } from '../actions/collection.actions';
import { RefreshUserSuccessAction } from '../actions/user.actions';
import { AppConstants } from '../app.constants';
import { LoginData } from '../domain/LoginData';
import { LoginResult } from '../domain/LoginResult';
import { UserProfile } from '../domain/UserProfile';
import { UserSignUp } from '../domain/UserSignUp';
import { IAppState } from '../state/app.state';

const AUTH_SIGN_IN_URL = `${AppConstants.SERVER_URL}/auth/sign_in`;
const AUTH_SIGN_UP_URL = `${AppConstants.SERVER_URL}/auth/sign_up`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private jwtHelper: JwtHelperService,
    private store: Store<IAppState>
  ) {}

  public authenticate(loginData: LoginData): Observable<LoginResult> {
    return this.httpClient
      .post<LoginResult>(AUTH_SIGN_IN_URL, loginData)
      .pipe(catchError(this.handleError));
  }

  public signUp(userSignUp: UserSignUp): Observable<UserProfile> {
    return this.httpClient
      .post<UserProfile>(AUTH_SIGN_UP_URL, userSignUp)
      .pipe(catchError(this.handleError));
  }

  public logout(): void {
    localStorage.setItem(AppConstants.LOGIN_STORAGE, null);
    this.store.dispatch(new RefreshUserSuccessAction(null));
    this.store.dispatch(new RefreshCollectionSuccessAction(null));
  }

  public getToken(): string {
    const login: LoginResult = JSON.parse(
      localStorage.getItem(AppConstants.LOGIN_STORAGE)
    );
    if (!login) {
      return null;
    } else {
      return login.token;
    }
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
      this.store.dispatch(new RefreshUserSuccessAction(null));
      this.store.dispatch(new RefreshCollectionSuccessAction(null));
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
