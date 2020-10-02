import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  faArrowCircleLeft as faSArrowCircleLeft,
  faCheckCircle as faSCheckCircle,
  faHistory as faSHistory,
  faTv as faSTv,
  faListUl as faSListUl,
  faEye as faSEye,
  faEyeSlash as faSEyeSlash,
  faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Collection } from 'src/app/domain/Collection';
import { Season } from 'src/app/domain/Season';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.css'],
})
export class SeasonComponent implements OnInit, OnDestroy {
  Season: Season = null;
  tvShowDict: Collection = null;
  allEpisodesMarked: boolean = false;
  episodeCounter: number = 0;

  totalEpisodes: number = null;
  propEpisodeCounter: number = null;

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
        'Guarda informazioni ed episodi della stagione ' + res.name
      );
    } else {
      this.title.setTitle('See info and episodes for season ' + res.name);
    }
  }

  ngOnInit(): void {
    let parsedUrl = this.router.parseUrl(this.router.url);

    let tv_show_id = +parsedUrl.root.children.primary.segments[1].path;
    let season_number = +parsedUrl.root.children.primary.segments[4].path;

    this.initCollection();

    this.downloadData(tv_show_id, season_number);

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.downloadData(tv_show_id, season_number);
      }
    );
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  private downloadData(tv_show_id, season_number) {
    this.TmdbService.getTvShowSeason(tv_show_id, season_number).subscribe(
      (res) => {
        //id
        res.tv_show_id = tv_show_id;
        //name
        if (!res.name) res.name = '---';

        this.setTitle(res);

        //poster_path
        if (res.poster_path) {
          res.poster_path =
            'https://image.tmdb.org/t/p/original/' + res.poster_path;
        } else {
          res.poster_path = 'assets/imgs/default.png';
        }
        //oveview
        if (!res.overview) res.overview = 'no description';
        //season_number
        if (!res.season_number) res.season_number = season_number;
        //episode_number
        if (!res.episode_count) res.episode_count = res.episodes.length;
        this.totalEpisodes = res.episode_count;
        //air_date
        if (!res.air_date) res.air_date = '---';
        //episodes[]
        if (res.episodes) {
          res.episodes.forEach((episode) => {
            //still_path
            if (episode.still_path) {
              episode.still_path =
                'https://image.tmdb.org/t/p/w500/' + episode.still_path;
            } else {
              episode.still_path = 'assets/imgs/default.png';
            }
            //episode_number
            if (!episode.episode_number) episode.episode_number = +'---';
            //name
            if (!episode.name) episode.name = '---';
            //air_date
            if (!episode.air_date) episode.air_date = '---';
          });
        }

        this.Season = res;

        this.checkAllMarked();
      }
    );
  }

  private initCollection(): void {
    let collection = localStorage.getItem('collection');
    if (collection) {
      this.tvShowDict = JSON.parse(collection);
    } else {
      this.tvShowDict = {};
    }
  }

  private checkAllMarked(): void {
    let guard = true;
    if (this.tvShowDict[this.Season.tv_show_id]) {
      for (let episode of this.Season.episodes) {
        if (!this.tvShowDict[this.Season.tv_show_id].episodes[episode.id]) {
          guard = false;
          break;
        }
      }
    }
    this.allEpisodesMarked = guard;
    this.episodeCounterInit();
  }

  private episodeCounterInit(): void {
    this.episodeCounter = 0;
    if (
      !!this.tvShowDict &&
      !!this.tvShowDict[this.Season.tv_show_id] &&
      !!this.tvShowDict[this.Season.tv_show_id].episodes
    ) {
      for (let episode of this.Season.episodes) {
        if (this.tvShowDict[this.Season.tv_show_id].episodes[episode.id]) {
          this.episodeCounter++;
        }
      }
    }
    this.totalEpisodes !== 0
      ? (this.propEpisodeCounter =
          (this.episodeCounter * 100) / this.totalEpisodes)
      : (this.propEpisodeCounter = 0);
    this.progressBarUpdate(this.propEpisodeCounter);
  }

  progressBarUpdate(propEpisodeCounter: number): void {
    $(document).ready(function () {
      $('#progress_bar').css('width', propEpisodeCounter + '%');
    });
  }

  markEpisode(id: number): void {
    if (
      !!this.tvShowDict[this.Season.tv_show_id] &&
      !this.tvShowDict[this.Season.tv_show_id].episodes &&
      !!this.Season.episodes
    ) {
      this.tvShowDict[this.Season.tv_show_id].episodes = {};
    }
    if (
      !!this.tvShowDict[this.Season.tv_show_id] &&
      !!this.tvShowDict[this.Season.tv_show_id].episodes &&
      !!this.Season.episodes
    ) {
      this.tvShowDict[this.Season.tv_show_id].episodes[id] = !this.tvShowDict[
        this.Season.tv_show_id
      ].episodes[id];
      this.checkAllMarked();
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
    }
  }

  markAllEpisodes(value: boolean): void {
    if (
      !!this.tvShowDict[this.Season.tv_show_id] &&
      !this.tvShowDict[this.Season.tv_show_id].episodes &&
      !!this.Season.episodes
    ) {
      this.tvShowDict[this.Season.tv_show_id].episodes = {};
    }
    if (
      !!this.tvShowDict[this.Season.tv_show_id] &&
      !!this.tvShowDict[this.Season.tv_show_id].episodes &&
      !!this.Season.episodes
    ) {
      for (let episode of this.Season.episodes) {
        this.tvShowDict[this.Season.tv_show_id].episodes[episode.id] = value;
      }
      this.checkAllMarked();
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
    }
  }

  goBack(): void {
    this.location.back();
  }

  // icons
  faSArrowCircleLeft = faSArrowCircleLeft;
  faSCheckCircle = faSCheckCircle;
  faSHistory = faSHistory;
  faSTv = faSTv;
  faSListUl = faSListUl;
  faSEye = faSEye;
  faSEyeSlash = faSEyeSlash;
  faMinusCircle = faMinusCircle;
}
