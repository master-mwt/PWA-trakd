import { Component, OnDestroy, OnInit } from '@angular/core';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Genre } from 'src/app/domain/Genre';
import { TvShowPreview } from 'src/app/domain/TvShowPreview';
import { SortingTypes } from 'src/app/domain/SortingTypes';
import { Collection } from 'src/app/domain/Collection';
import {
  faSearch as faSSearch,
  faPlusCircle as faSPlusCircle,
  faMinusCircle as faSMinusCircle,
  faStream as faSStream,
} from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state/app.state';
import { selectCollection } from 'src/app/selectors/collection.selector';
import {
  AddToCollectionAction,
  RemoveFromCollectionAction,
} from 'src/app/actions/collection.actions';
import { UserProfile } from 'src/app/domain/UserProfile';
import { selectUser } from 'src/app/selectors/user.selector';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenresComponent implements OnInit, OnDestroy {
  genres: Genre[] = [];
  sortingTypes: { value: string; name: string }[] = [
    { value: SortingTypes.POPULARITY_DESC, name: 'Popularity desc' },
    { value: SortingTypes.POPULARITY_ASC, name: 'Popularity asc' },
    { value: SortingTypes.FIRST_AIR_DATE_DESC, name: 'First air date desc' },
    { value: SortingTypes.FIRST_AIR_DATE_ASC, name: 'First air date asc' },
    { value: SortingTypes.VOTE_AVERAGE_DESC, name: 'Vote average desc' },
    { value: SortingTypes.VOTE_AVERAGE_ASC, name: 'Vote average asc' },
  ];
  queryGenreForm = new FormGroup({
    genre: new FormControl(''),
    sortingType: new FormControl(''),
  });
  tvShows: TvShowPreview[];

  private page: number = 1;
  private genre: Genre = null;
  private sortBy: SortingTypes = null;
  private maxPage: number;
  private notScrolly: boolean = true;
  private notEmpty: boolean;
  tvShowDict: Collection = null;
  lastResultReached: boolean = true;
  navigation = null;

  private langChangeSubscription: any;
  private collectionSubscription: any;
  private userSubscription: any;

  userProfile: UserProfile;

  constructor(
    private tmdbService: TmdbService,
    private router: Router,
    private title: Title,
    private translate: TranslateService,
    private store: Store<IAppState>
  ) {
    this.navigation = this.router.getCurrentNavigation();
    this.setTitle();
    this.collectionSubscription = this.store
      .pipe(select(selectCollection))
      .subscribe((collection) => {
        this.tvShowDict = collection;
        if (this.tvShowDict === null) {
          this.tvShowDict = {};
        }
      });
    this.userSubscription = this.store
      .pipe(select(selectUser))
      .subscribe((user) => {
        this.userProfile = user;
      });
  }

  private setTitle() {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle('Cerca le tue serie tv preferite per genere');
    } else {
      this.title.setTitle('Search your favourites tvshows by genre');
    }
  }

  ngOnInit(): void {
    this.downloadData();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setTitle();
        this.downloadData();
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  private downloadData() {
    this.tmdbService.getGenres().subscribe((res) => {
      if (res.genres) {
        this.genres = res.genres;
        if (
          !!this.navigation &&
          !!this.navigation.extras &&
          !!this.navigation.extras.state &&
          !!this.navigation.extras.state.genre_id
        ) {
          this.doAutomaticSearch(this.navigation.extras.state.genre_id);
        }
      }
    });
  }

  private doAutomaticSearch(genreId: number) {
    this.queryGenreForm = new FormGroup({
      genre: new FormControl(genreId),
      sortingType: new FormControl(this.sortingTypes[0].value),
    });
    this.page = 1;
    this.genre = { id: genreId, name: '' };
    this.sortBy = SortingTypes.POPULARITY_DESC;
    this.notScrolly = true;
    this.notEmpty = false;
    this.tvShows = [];
    this.lastResultReached = true;

    this.tmdbService
      .doTvShowsSearchByGenre(
        { id: genreId, name: '' },
        this.page,
        SortingTypes.POPULARITY_DESC
      )
      .subscribe((res) => {
        this.maxPage = res.total_pages;

        if (res.results) {
          if (this.page < this.maxPage) {
            this.lastResultReached = false;
          }
          this.notEmpty = true;
          this.bindResults(res.results);
        }
      });
  }

  search() {
    if (
      this.queryGenreForm.value['genre'] === '' ||
      this.queryGenreForm.value['sortingType'] === ''
    ) {
      return;
    }
    this.page = 1;
    this.genre = { id: this.queryGenreForm.value['genre'], name: '' };
    this.sortBy = this.queryGenreForm.value['sortingType'];
    this.notScrolly = true;
    this.notEmpty = false;
    this.tvShows = [];
    this.lastResultReached = true;
    this.tmdbService
      .doTvShowsSearchByGenre(this.genre, this.page, this.sortBy)
      .subscribe((res) => {
        this.maxPage = res.total_pages;

        if (res.results) {
          if (this.page < this.maxPage) {
            this.lastResultReached = false;
          }
          this.notEmpty = true;
          this.bindResults(res.results);
        }
      });
  }

  private bindResults(tvshows: TvShowPreview[]): void {
    tvshows.forEach((tvshow) => {
      //name
      if (!tvshow.name) tvshow.name = '---';
      //poster_path
      if (tvshow.poster_path) {
        tvshow.poster_path =
          'https://image.tmdb.org/t/p/w500/' + tvshow.poster_path;
      } else {
        tvshow.poster_path = 'assets/imgs/default.png';
      }
    });
    this.tvShows = this.tvShows.concat(tvshows);
  }

  onScroll(): void {
    if (this.notScrolly && this.notEmpty) {
      this.notScrolly = false;
      this.loadMoreOnScroll();
    }
  }

  private loadMoreOnScroll(): void {
    this.page++;
    if (this.page <= this.maxPage) {
      this.tmdbService
        .doTvShowsSearchByGenre(this.genre, this.page, this.sortBy)
        .subscribe((res) => {
          if (res.results) {
            if (res.results.length === 0) {
              this.notEmpty = false;
            } else {
              this.notEmpty = true;
              this.bindResults(res.results);
            }
          }
          this.notScrolly = true;
        });
    } else {
      this.page--;
      this.lastResultReached = true;
    }
  }

  addToCollection(id: number): void {
    this.tmdbService.getTvShowDetails(id).subscribe((res) => {
      this.store.dispatch(new AddToCollectionAction(res));
    });
  }

  removeFromCollection(id: number): void {
    if (!!this.tvShowDict && !!this.tvShowDict[id]) {
      this.store.dispatch(new RemoveFromCollectionAction({ id: id, name: '' }));
    }
  }

  loadMoreOnButtonPressed(): void {
    this.page++;
    if (this.page <= this.maxPage) {
      this.tmdbService
        .doTvShowsSearchByGenre(this.genre, this.page, this.sortBy)
        .subscribe((res) => {
          this.maxPage = res.total_pages;

          if (res.results) {
            this.notEmpty = true;
            this.bindResults(res.results);
          }
        });
    } else {
      this.page--;
      this.lastResultReached = true;
    }
  }

  // icons
  faSSearch = faSSearch;
  faSPlusCircle = faSPlusCircle;
  faSMinusCircle = faSMinusCircle;
  faSStream = faSStream;
}
