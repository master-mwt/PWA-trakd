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

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.css'],
})
export class EpisodeComponent implements OnInit, OnDestroy {
  Episode: Episode = null;
  tvShowDict: Collection = null;

  private langChangeSubscription: any;

  constructor(
    private router: Router,
    private location: Location,
    private TmdbService: TmdbService,
    private title: Title,
    private translate: TranslateService
  ) {}

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

    this.initCollection();

    this.downloadData(tv_show_id, season_number, episode_number);

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.downloadData(tv_show_id, season_number, episode_number);
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
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

  private initCollection(): void {
    let collection = localStorage.getItem('collection');
    if (collection) {
      this.tvShowDict = JSON.parse(collection);
    } else {
      this.tvShowDict = {};
    }
  }

  markAsSeen(): void {
    if (this.tvShowDict[this.Episode.tv_show_id]) {
      if (!this.tvShowDict[this.Episode.tv_show_id].episodes) {
        this.tvShowDict[this.Episode.tv_show_id].episodes = {};
      }
      if (!this.tvShowDict[this.Episode.tv_show_id].episodes[this.Episode.id]) {
        this.tvShowDict[this.Episode.tv_show_id].episodes[
          this.Episode.id
        ] = true;
        localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
      }
    }
  }

  markAsNotSeen(): void {
    if (this.tvShowDict[this.Episode.tv_show_id]) {
      if (
        !!this.tvShowDict[this.Episode.tv_show_id].episodes &&
        this.tvShowDict[this.Episode.tv_show_id].episodes[this.Episode.id]
      ) {
        this.tvShowDict[this.Episode.tv_show_id].episodes[
          this.Episode.id
        ] = false;
        localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
      }
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
