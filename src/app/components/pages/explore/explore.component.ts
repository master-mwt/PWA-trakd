import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
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
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css'],
})
export class ExploreComponent implements OnInit, OnDestroy {
  tvShowPreviews: TvShowPreview[] = [];
  private page: number = 1;
  private maxPage: number;

  private urlSection: string;
  private notScrolly: boolean = true;
  private notEmpty: boolean;

  tvShowDict: Collection = null;
  lastResultReached: boolean = true;

  private langChangeSubscription: any;
  private collectionSubscription: any;

  constructor(
    private router: Router,
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
      this.title.setTitle('Esplora le serie tv più popolari e le più votate');
    } else {
      this.title.setTitle('Explore popular and top rated tvshows');
    }
  }

  ngOnInit(): void {
    let parsedUrl = this.router.parseUrl(this.router.url);
    this.urlSection = parsedUrl.root.children.primary.segments.toString();

    if (this.urlSection === 'explore,popular') {
      this.getTvShowsPopular();
    } else if (this.urlSection === 'explore,top_rated') {
      this.getTvShowTopRated();
    }
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSubscription.unsubscribe();
  }

  private getTvShowsPopular(): void {
    this.tmdbService.getTvShowsPopular(this.page).subscribe((res) => {
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

  private getTvShowTopRated(): void {
    this.tmdbService.getTvShowsTopRated(this.page).subscribe((res) => {
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
      if (this.urlSection === 'explore,popular') {
        this.tmdbService.getTvShowsPopular(this.page).subscribe((res) => {
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
      } else if (this.urlSection === 'explore,top_rated') {
        this.tmdbService.getTvShowsTopRated(this.page).subscribe((res) => {
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
      }
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
      if (this.urlSection === 'explore,popular') {
        this.getTvShowsPopular();
      } else if (this.urlSection === 'explore,top_rated') {
        this.getTvShowTopRated();
      }
    } else {
      this.page--;
      this.lastResultReached = true;
    }
  }

  // icons
  faSPlusCircle = faSPlusCircle;
  faSMinusCircle = faSMinusCircle;
  faSStream = faSStream;
}
