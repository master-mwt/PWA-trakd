import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  faArrowCircleLeft as faSArrowCircleLeft,
  faCheckCircle as faSCheckCircle,
  faTv as faSTv,
  faListUl as faSListUl,
  faCrown as faSCrown,
  faTrophy as faSTrophy,
  faHistory as faSHistory,
  faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Collection } from 'src/app/domain/Collection';
import { Episode } from 'src/app/domain/Episode';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state/app.state';
import { selectCollection } from 'src/app/selectors/collection.selector';
import {
  MarkEpisodeAsNotSeenAction,
  MarkEpisodeAsSeenAction,
} from 'src/app/actions/collection.actions';

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css'],
})
export class EpisodeComponent implements OnInit, OnDestroy {
  Episode: Episode = null;
  tvShowDict: Collection = null;

  private langChangeSubscription: any;
  private collectionSubscription: any;

  constructor(
    private router: Router,
    private location: Location,
    private TmdbService: TmdbService,
    private title: Title,
    private translate: TranslateService,
    private store: Store<IAppState>
  ) {
    this.collectionSubscription = this.store
      .pipe(select(selectCollection))
      .subscribe((collection) => {
        this.tvShowDict = collection;
        if (this.tvShowDict === null) {
          this.tvShowDict = {};
        }
      });
  }

  private setTitle(res) {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle(
        "Guarda informazioni e voti per l'episodio " + res.name
      );
    } else {
      this.title.setTitle('See info and rating for episode ' + res.name);
    }
  }

  ngOnInit(): void {
    let parsedUrl = this.router.parseUrl(this.router.url);

    let tv_show_id = +parsedUrl.root.children.primary.segments[1].path;
    let season_number = +parsedUrl.root.children.primary.segments[4].path;
    let episode_number = +parsedUrl.root.children.primary.segments[6].path;

    this.downloadData(tv_show_id, season_number, episode_number);

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.downloadData(tv_show_id, season_number, episode_number);
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSubscription.unsubscribe();
  }

  private downloadData(tv_show_id, season_number, episode_number) {
    this.TmdbService.getTvShowEpisode(
      tv_show_id,
      season_number,
      episode_number
    ).subscribe((res) => {
      //id [custom property]
      res.tv_show_id = tv_show_id;
      //name
      if (!res.name) res.name = '---';

      this.setTitle(res);

      //still_path
      if (res.still_path) {
        res.still_path =
          'https://image.tmdb.org/t/p/original/' + res.still_path;
      } else {
        res.still_path = 'assets/imgs/default.png';
      }
      //overview
      if (!res.overview) res.overview = 'no description';
      //air_date
      if (!res.air_date) res.air_date = '---';
      //season_number
      if (!res.season_number) res.season_number = season_number;
      //episode_number
      if (!res.episode_number) res.episode_number = episode_number;
      //vote_count
      if (!res.vote_count) res.vote_count = +'---';
      //vote_average
      if (!res.vote_average) res.vote_average = +'---';

      this.Episode = res;
    });
  }

  markAsSeen(): void {
    if (this.tvShowDict[this.Episode.tv_show_id]) {
      this.store.dispatch(new MarkEpisodeAsSeenAction(this.Episode));
    }
  }

  markAsNotSeen(): void {
    if (this.tvShowDict[this.Episode.tv_show_id]) {
      this.store.dispatch(new MarkEpisodeAsNotSeenAction(this.Episode));
    }
  }

  goBack(): void {
    this.location.back();
  }

  // icons
  faSArrowCircleLeft = faSArrowCircleLeft;
  faSCheckCircle = faSCheckCircle;
  faSTv = faSTv;
  faSListUl = faSListUl;
  faSCrown = faSCrown;
  faSTrophy = faSTrophy;
  faSHistory = faSHistory;
  faMinusCircle = faMinusCircle;
}
