import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppConstants } from '../app.constants';
import { Collection } from '../domain/Collection';
import { UserProfile } from '../domain/UserProfile';

const COLLECTION_URL = `${AppConstants.SERVER_URL}/collection`;
const PROFILE_URL = `${AppConstants.SERVER_URL}/profile`;

@Injectable({
  providedIn: 'root',
})
export class LocalserverService {
  constructor(private httpClient: HttpClient) {}

  getUserCollection(): Observable<Collection> {
    return this.httpClient
      .get<Collection>(COLLECTION_URL)
      .pipe(catchError(this.handleError));
  }

  saveCollection(collection: Collection): Observable<Collection> {
    return this.httpClient
      .post<Collection>(COLLECTION_URL, collection)
      .pipe(catchError(this.handleError));
  }

  getUserProfileData(): Observable<UserProfile> {
    return this.httpClient
      .get<UserProfile>(PROFILE_URL)
      .pipe(catchError(this.handleError));
  }

  setUserProfileData(userProfile: UserProfile): Observable<UserProfile> {
    return this.httpClient
      .post<UserProfile>(PROFILE_URL, userProfile)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
