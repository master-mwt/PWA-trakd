import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  faSearch as faSSearch,
  faPlusCircle as faSPlusCircle,
  faMinusCircle as faSMinusCircle,
  faStream as faSStream,
} from '@fortawesome/free-solid-svg-icons';
import { TmdbService } from 'src/app/services/tmdb.service';
import { TvShowPreview } from 'src/app/domain/TvShowPreview';
import { Collection } from 'src/app/domain/Collection';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state/app.state';
import { selectCollection } from 'src/app/selectors/collection.selector';
import {
  AddToCollectionAction,
  RemoveFromCollectionAction,
} from 'src/app/actions/collection.actions';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, OnDestroy {
  tvShowPreviews: TvShowPreview[] = [];

  queryForm = new FormGroup({
    query: new FormControl(''),
  });

  private page: number = 1;
  private maxPage: number;
  private notScrolly: boolean = true;
  private notEmpty: boolean;

  tvShowDict: Collection = null;

  lastResultReached: boolean = true;

  private langChangeSubscription: any;
  private collectionSubscription: any;

  constructor(
    private tmdbService: TmdbService,
    private title: Title,
    private translate: TranslateService,
    private store: Store<IAppState>
  ) {
    this.setTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setTitle();
      }
    );
    this.collectionSubscription = this.store
      .pipe(select(selectCollection))
      .subscribe((collection) => {
        this.tvShowDict = collection;
        if (this.tvShowDict === null) {
          this.tvShowDict = {};
        }
      });
  }

  private setTitle() {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle('Cerca le tue serie tv preferite');
    } else {
      this.title.setTitle('Search your favourites tvshows');
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSubscription.unsubscribe();
  }

  search(): void {
    this.page = 1;
    this.notScrolly = true;
    this.notEmpty = false;
    this.tvShowPreviews = [];
    this.lastResultReached = true;
    if (this.queryForm.value['query'] === '') {
      return;
    }
    this.tmdbService
      .doTvShowsSearch(this.queryForm.value['query'], this.page)
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
        .doTvShowsSearch(this.queryForm.value['query'], this.page)
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
    this.tvShowPreviews = this.tvShowPreviews.concat(tvshows);
  }

  addToCollection(id: number): void {
    /*if (this.tvShowDict) {
      this.tvShowDict[id] = {
        episodes: {},
      };
      this.tmdbService.getTvShowDetails(id).subscribe((res) => {
        for (let season of res.seasons) {
          this.tmdbService
            .getTvShowSeason(id, season.season_number)
            .subscribe((res) => {
              for (let episode of res.episodes) {
                this.tvShowDict[id].episodes[episode.id] = false;
              }
              localStorage.setItem(
                'collection',
                JSON.stringify(this.tvShowDict)
              );
            });
        }
      });
    }*/
    this.tmdbService.getTvShowDetails(id).subscribe((res) => {
      this.store.dispatch(new AddToCollectionAction(res));
    });
  }

  removeFromCollection(id: number): void {
    if (!!this.tvShowDict && !!this.tvShowDict[id]) {
      /*delete this.tvShowDict[id];
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));*/
      this.store.dispatch(new RemoveFromCollectionAction({ id: id, name: '' }));
    }
  }

  loadMoreOnButtonPressed(): void {
    this.page++;
    if (this.page <= this.maxPage) {
      this.tmdbService
        .doTvShowsSearch(this.queryForm.value['query'], this.page)
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
