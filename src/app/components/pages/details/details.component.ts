import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import {
  faArrowCircleLeft as faSArrowCircleLeft,
  faPlusCircle,
  faMinusCircle,
  faCrown as faSCrown,
  faStream as faSStream,
  faTrophy as faSTrophy,
  faFlagUsa as faSFlagUsa,
  faCheckCircle as faSCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TmdbService } from 'src/app/services/tmdb.service';
import { Character } from 'src/app/domain/Character';
import { Collection } from 'src/app/domain/Collection';
import { TvShowPreview } from 'src/app/domain/TvShowPreview';
import { TvShowDetails } from 'src/app/domain/TvShowDetails';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { event } from 'jquery';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  TvShowDetails: TvShowDetails = null;
  Cast: Character[] = [];
  tvShowPreviews: TvShowPreview[] = [];
  tvShowDict: Collection = null;
  allEpisodesMarked: boolean = false;

  private langChangeSubscription: any;

  constructor(
    private router: Router,
    private location: Location,
    private TmdbService: TmdbService,
    private activeRoute: ActivatedRoute,
    private title: Title,
    private translate: TranslateService
  ) {}

  private setTitle(res) {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle(
        'Guarda informazioni, voti, cast, stagioni ed episodi per ' + res.name
      );
    } else {
      this.title.setTitle(
        'See info, rating, cast, seasons and episodes for ' + res.name
      );
    }
  }

  ngOnInit(): void {
    let parsedUrl = this.router.parseUrl(this.router.url);
    let tv_show_id = +parsedUrl.root.children.primary.segments[1].path;

    this.activeRoute.params.subscribe((routeParams) => {
      if (+routeParams['tv_show_id'] !== tv_show_id) {
        this.router
          .navigate(['/discover/' + routeParams['tv_show_id'] + '/details'])
          .then(() => {
            window.location.reload();
            window.scroll(0, 0);
          });
      }
    });

    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.downloadData(tv_show_id);
      }
    );

    this.downloadData(tv_show_id);
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  private downloadData(tv_show_id) {
    this.TmdbService.getTvShowDetails(tv_show_id).subscribe((res) => {
      //name
      if (!res.name) res.name = '---';

      this.setTitle(res);

      //backdrop_path
      if (res.backdrop_path) {
        res.backdrop_path =
          'https://image.tmdb.org/t/p/original/' + res.backdrop_path;
      } else {
        res.backdrop_path = 'assets/imgs/default.png';
      }
      //overview
      if (!res.overview) res.overview = '---';
      //status
      if (!res.status) res.status = '---';
      //type
      if (!res.type) res.type = '---';
      //number_of_season
      if (!res.number_of_seasons) res.number_of_seasons = +'---';
      //episode_number
      if (!res.original_language) res.number_of_episodes = +'---';
      //genres [already protected]
      //vote_average
      if (!res.vote_average) res.vote_average = 0;
      //popularity
      if (!res.popularity) res.popularity = 0;
      //vote_count
      if (!res.vote_count) res.vote_count = 0;
      //original_language
      if (!res.original_language) res.original_language = '---';
      //poster_path [not used]
      if (res.poster_path) {
        res.poster_path = 'https://image.tmdb.org/t/p/w500/' + res.poster_path;
      } else {
        res.poster_path = 'assets/imgs/default.png';
      }
      //popularity round
      if (res.popularity)
        res.popularity = parseFloat(res.popularity.toFixed(1));
      //seasons[]
      res.seasons.forEach((season) => {
        //name
        if (!season.name) season.name = '---';
        //poster_path
        if (season.poster_path) {
          //name
          season.poster_path =
            'https://image.tmdb.org/t/p/w500/' + season.poster_path;
        } else {
          season.poster_path = 'assets/imgs/default.png';
        }
      });

      this.TvShowDetails = res;

      this.initCollection();
    });
    //cast[]
    this.TmdbService.getTvShowCredits(tv_show_id).subscribe((res) => {
      if (res.cast) {
        res.cast.forEach((actor) => {
          //name
          if (!actor.name) actor.name = '---';
          //character
          if (!actor.character) actor.character = '---';
          //profile_path
          if (actor.profile_path) {
            actor.profile_path =
              'https://image.tmdb.org/t/p/w500/' + actor.profile_path;
          } else {
            actor.profile_path = 'assets/imgs/default.png';
          }
        });

        this.Cast = res.cast;
      }
    });
    //similar[]
    this.TmdbService.getTvShowSimilars(tv_show_id).subscribe((res) => {
      if (res.results) {
        res.results.forEach((tv_show) => {
          //name
          if (!tv_show.name) tv_show.name = '---';
          //poster_path
          if (tv_show.poster_path) {
            tv_show.poster_path =
              'https://image.tmdb.org/t/p/w500/' + tv_show.poster_path;
          } else {
            tv_show.poster_path = 'assets/imgs/default.png';
          }
        });

        this.tvShowPreviews = res.results;
      }
    });
  }

  private initCollection(): void {
    let collection = localStorage.getItem('collection');
    if (collection) {
      this.tvShowDict = JSON.parse(collection);
    } else {
      this.tvShowDict = {};
    }
    this.checkAllMarked();
  }

  private checkAllMarked(): void {
    let guard = false;
    if (
      this.tvShowDict[this.TvShowDetails.id] &&
      !!this.tvShowDict[this.TvShowDetails.id].episodes
    ) {
      for (let episodeKey of Object.keys(
        this.tvShowDict[this.TvShowDetails.id].episodes
      )) {
        guard = true;
        if (!this.tvShowDict[this.TvShowDetails.id].episodes[episodeKey]) {
          guard = false;
          break;
        }
      }
      this.allEpisodesMarked = guard;
      this.episodeCountersInit();
    }
  }

  private episodeCountersInit(): void {
    if (
      !!this.tvShowDict &&
      !!this.tvShowDict[this.TvShowDetails.id]!! &&
      !!this.tvShowDict[this.TvShowDetails.id].episodes &&
      !!this.TvShowDetails
    ) {
      for (let season of this.TvShowDetails.seasons) {
        season.marked_episodes = 0;
        this.TmdbService.getTvShowSeason(
          this.TvShowDetails.id,
          season.season_number
        ).subscribe((res) => {
          if (res.episodes) {
            for (let episode of res.episodes) {
              if (this.tvShowDict[this.TvShowDetails.id].episodes[episode.id]) {
                season.marked_episodes++;
              }
            }
            let propEpisodeCounter = 0;
            season.episode_count !== 0
              ? (propEpisodeCounter =
                  (season.marked_episodes * 100) / season.episode_count)
              : (propEpisodeCounter = 0);
            this.progressBarUpdate(propEpisodeCounter, season.season_number);
          }
        });
      }
    }
  }

  progressBarUpdate(propEpisodeCounter: number, season_number: number): void {
    $(document).ready(function () {
      $('#progress_bar_' + season_number).css(
        'width',
        propEpisodeCounter + '%'
      );
    });
  }

  addToCollection(): void {
    if (this.tvShowDict) {
      this.tvShowDict[this.TvShowDetails.id] = {
        episodes: {},
      };
      for (let season of this.TvShowDetails.seasons) {
        this.TmdbService.getTvShowSeason(
          this.TvShowDetails.id,
          season.season_number
        ).subscribe((res) => {
          for (let episode of res.episodes) {
            this.tvShowDict[this.TvShowDetails.id].episodes[episode.id] = false;
          }
          localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
        });
      }
      this.checkAllMarked();
    }
  }

  removeFromCollection(): void {
    if (!!this.tvShowDict && this.tvShowDict[this.TvShowDetails.id]) {
      delete this.tvShowDict[this.TvShowDetails.id];
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
    }
  }

  markAllEpisodes(value: boolean): void {
    if (
      !!this.tvShowDict &&
      this.tvShowDict[this.TvShowDetails.id] &&
      !!this.tvShowDict[this.TvShowDetails.id].episodes
    ) {
      for (let episodeKey of Object.keys(
        this.tvShowDict[this.TvShowDetails.id].episodes
      )) {
        this.tvShowDict[this.TvShowDetails.id].episodes[episodeKey] = value;
      }
      localStorage.setItem('collection', JSON.stringify(this.tvShowDict));
      this.checkAllMarked();
    }
  }

  goBack(): void {
    this.location.back();
  }

  searchByGenre(genreId: number): void {
    const navigationExtras: NavigationExtras = {
      state: {
        genre_id: genreId,
      },
    };
    this.router.navigate(['genres'], navigationExtras);
  }

  // icons
  faSArrowCircleLeft = faSArrowCircleLeft;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  faSCrown = faSCrown;
  faSStream = faSStream;
  faSTrophy = faSTrophy;
  faSFlagUsa = faSFlagUsa;
  faSCheckCircle = faSCheckCircle;
}
