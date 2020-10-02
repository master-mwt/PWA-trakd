import { FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faSearch as faSSearch,
  faPlusCircle as faSPlusCircle,
  faMinusCircle as faSMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TmdbService } from 'src/app/services/tmdb.service';
import { TvShowPreview } from 'src/app/domain/TvShowPreview';
import { Collection } from 'src/app/domain/Collection';
import * as fuzzysort from 'fuzzysort';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css'],
})
export class CollectionComponent implements OnInit, OnDestroy {
  tvShows: TvShowPreview[] = [];
  tvShowsAllResults: TvShowPreview[] = [];
  tvShowDict: Collection = null;

  query: FormControl = new FormControl('');

  private langChangeSubscription: any;

  constructor(
    private tmdbService: TmdbService,
    private title: Title,
    private translate: TranslateService
  ) {
    this.setTitle();
  }

  ngOnInit(): void {
    this.initCollection();
    this.refreshCollection();
    this.searchInit();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setTitle();
        this.refreshCollection();
        this.searchInit();
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  private setTitle() {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle('Naviga la tua personale collezione di serie tv');
    } else {
      this.title.setTitle('Browse your personal collection of tvshows');
    }
  }

  private initCollection(): void {
    let collection = localStorage.getItem('collection');
    if (collection) {
      this.tvShowDict = JSON.parse(collection);
    } else {
      this.tvShowDict = {};
    }
  }

  private refreshCollection(): void {
    this.tvShows = [];
    Object.keys(this.tvShowDict).forEach((tvShowKey) => {
      this.tmdbService.getTvShowDetails(+tvShowKey).subscribe((res) => {
        if (!res.name) res.name = '---';
        if (res.poster_path)
          res.poster_path =
            'https://image.tmdb.org/t/p/w500/' + res.poster_path;
        else res.poster_path = 'assets/imgs/default.png';
        this.tvShows.push({
          id: +tvShowKey,
          name: res.name,
          poster_path: res.poster_path,
        });
        this.tvShows.sort((a, b) => a.name.localeCompare(b.name));
        this.tvShowsAllResults = this.tvShows;
      });
    });
  }

  private searchInit(): void {
    this.query.valueChanges.subscribe((input) => {
      if (input !== '') {
        this.tvShows = [];
        fuzzysort
          .go(input, this.tvShowsAllResults, { keys: ['name'] })
          .forEach((tvshow) => {
            this.tvShows.push(tvshow.obj);
          });
      } else {
        this.tvShows = this.tvShowsAllResults;
      }
    });
  }

  removeFromCollection(id: number): void {
    if (!!this.tvShowDict && !!this.tvShowDict[id]) {
      delete this.tvShowDict[id];
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
    }
    this.refreshCollection();
  }

  // icons
  faSSearch = faSSearch;
  faSPlusCircle = faSPlusCircle;
  faSMinusCircle = faSMinusCircle;
}
