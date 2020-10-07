import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { combineLatest, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { PageResult } from '../domain/PageResult';
import { TvShowDetails } from '../domain/TvShowDetails';
import { Season } from '../domain/Season';
import { Episode } from '../domain/Episode';
import { TvShowCredits } from '../domain/TvShowCredits';
import { SortingTypes } from '../domain/SortingTypes';
import { Genre } from '../domain/Genre';
import { GenreResult } from '../domain/GenreResult';
import { TranslateService } from '@ngx-translate/core';
import { AppConstants } from '../app.constants';

const API_URL = AppConstants.TMDB_SERVICE_API_URL;
const API_KEY = AppConstants.TMDB_SERVICE_API_KEY;

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  constructor(private http: HttpClient, private translate: TranslateService) {}

  private getLang() {
    if (this.translate.currentLang === 'it') {
      return 'it-IT';
    } else {
      return 'en-US';
    }
  }

  /**
   * Get the detail of a TvShow
   *
   * @param tvShowID TvShow ID
   */
  getTvShowDetails(tvShowID: number): Observable<TvShowDetails> {
    let link: string =
      API_URL +
      'tv/' +
      tvShowID +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}`;
    return this.http
      .get<TvShowDetails>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get populars TvShows
   *
   * @param page The requested page
   */
  getTvShowsPopular(page: number = 1): Observable<PageResult> {
    let link: string =
      API_URL +
      'tv/popular' +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}` +
      '&page=' +
      page;
    return this.http
      .get<PageResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get top rated TvShows
   *
   * @param page The requested page
   */
  getTvShowsTopRated(page: number = 1): Observable<PageResult> {
    let link: string =
      API_URL +
      'tv/top_rated' +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}` +
      '&page=' +
      page;
    return this.http
      .get<PageResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get similar TvShows
   *
   * @param tvShowID TvShow ID
   * @param page The requested page
   */
  getTvShowSimilars(
    tvShowID: number,
    page: number = 1
  ): Observable<PageResult> {
    let link: string =
      API_URL +
      'tv/' +
      tvShowID +
      '/similar' +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}` +
      '&page=' +
      page;
    return this.http
      .get<PageResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get a TvShow Season
   *
   * @param tvShowID TvShow ID
   * @param seasonNumber The requested season number
   */
  getTvShowSeason(tvShowID: number, seasonNumber: number): Observable<Season> {
    let link: string =
      API_URL +
      'tv/' +
      tvShowID +
      '/season/' +
      seasonNumber +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}`;
    return this.http
      .get<Season>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get a TvShow Episode
   *
   * @param tvShowID TvShow ID
   * @param seasonNumber The requested season number
   * @param episodeNumber The requested episode number
   */
  getTvShowEpisode(
    tvShowID: number,
    seasonNumber: number,
    episodeNumber: number
  ): Observable<Episode> {
    let link: string =
      API_URL +
      'tv/' +
      tvShowID +
      '/season/' +
      seasonNumber +
      '/episode/' +
      episodeNumber +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}`;
    return this.http
      .get<Episode>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get the credits of a TvShow (cast and crew)
   *
   * @param tvShowID TvShow ID
   */
  getTvShowCredits(tvShowID: number): Observable<TvShowCredits> {
    let link: string =
      API_URL +
      'tv/' +
      tvShowID +
      '/credits' +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}`;
    return this.http
      .get<TvShowCredits>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Search a TvShow given a query string
   *
   * @param query The query string
   * @param page The requested page
   */
  doTvShowsSearch(query: string, page: number = 1): Observable<PageResult> {
    let link: string =
      API_URL +
      'search/tv' +
      '?api_key=' +
      API_KEY +
      '&query=' +
      query +
      '&page=' +
      page +
      `&language=${this.getLang()}`;
    return this.http
      .get<PageResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Search TvShows given a genre and optional parameters sortBy and page
   *
   * @param genre The genre given as query
   * @param page The requested page
   * @param sortBy The desidered sort strategy
   */
  doTvShowsSearchByGenre(
    genre: Genre,
    page: number = 1,
    sortBy: SortingTypes = SortingTypes.POPULARITY_DESC
  ): Observable<PageResult> {
    let link: string =
      API_URL +
      'discover/tv' +
      '?api_key=' +
      API_KEY +
      '&with_genres=' +
      genre.id +
      '&sort_by=' +
      sortBy +
      '&page=' +
      page +
      `&language=${this.getLang()}`;
    return this.http
      .get<PageResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get all possibile tv genres
   */
  getGenres(): Observable<GenreResult> {
    let link: string =
      API_URL +
      'genre/tv/list' +
      '?api_key=' +
      API_KEY +
      `&language=${this.getLang()}`;
    return this.http
      .get<GenreResult>(link)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Get all seasons for a TvShow
   *
   * @param tvShowDetails The TvShow object
   */
  getAllTvShowSeasons(tvShowDetails: TvShowDetails): Observable<Season[]> {
    let seasonObservables: Observable<Season>[] = [];
    for (let season of tvShowDetails.seasons) {
      seasonObservables.push(
        this.getTvShowSeason(tvShowDetails.id, season.season_number)
      );
    }
    return combineLatest([...seasonObservables]);
  }

  /**
   * Error handling for HttpClient
   *
   * @param error HttpErrorResponse error response
   */
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
