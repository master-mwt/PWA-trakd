import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  faFileUpload as faSFileUpload,
  faFileDownload as faSFileDownload,
  faServer as faSServer,
} from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state/app.state';
import {
  RefreshCollectionAction,
  SaveCollectionAction,
} from 'src/app/actions/collection.actions';
import { Collection } from 'src/app/domain/Collection';
import { selectCollection } from 'src/app/selectors/collection.selector';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css'],
})
export class BackupComponent implements OnInit, OnDestroy {
  log_status: string = 'waiting';
  log_message: string = 'idle';

  collection: Collection;

  private langChangeSubscription: any;
  private collectionSelectorSub: any;

  constructor(
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
    this.collectionSelectorSub = this.store
      .pipe(select(selectCollection))
      .subscribe((collection) => {
        this.collection = collection;
        if (this.collection === null) {
          this.collection = {};
        }
      });
  }

  private setTitle() {
    if (this.translate.currentLang === 'it') {
      this.title.setTitle(
        'Fai il backup della tua collezione personale di serie tv'
      );
    } else {
      this.title.setTitle('Backup your personal collection of tvshows');
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSelectorSub.unsubscribe();
  }

  backup(): void {
    this.store.dispatch(new SaveCollectionAction(this.collection));
  }

  restore(): void {
    this.store.dispatch(new RefreshCollectionAction());
  }

  /*fileChanged(e: Event): void {
    if (
      (e.target as HTMLInputElement).files &&
      (e.target as HTMLInputElement).files.length
    ) {
      $('#log_container').css('background-color', '#0275d8');
      this.log_status = 'LOADING';
      this.log_message = 'importing...';
      let restoreFile = (e.target as HTMLInputElement).files[0];

      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (fileReader.result && restoreFile.type === 'application/json') {
          try {
            let restoredData: Collection = JSON.parse(
              fileReader.result.toString()
            );
            if (!this.parseCollection(restoredData)) {
              $('#log_container').css('background-color', '#d9534f');
              this.log_status = 'ERROR';
              this.log_message =
                'parse error [not a valid json collection structure]';
              return;
            }
          } catch (e) {
            $('#log_container').css('background-color', '#d9534f');
            this.log_status = 'ERROR';
            this.log_message = 'extension error [not a json file]';
            return;
          }

          localStorage.setItem('collection', fileReader.result.toString());
          $('#log_container').css('background-color', '#5cb85c');
          this.log_status = 'SUCCESS';
          this.log_message = 'collection imported';
        } else {
          $('#log_container').css('background-color', '#d9534f');
          this.log_status = 'ERROR';
          this.log_message = 'import failed';
        }
      };
      fileReader.readAsText(restoreFile);
    }
  }*/

  /*parseCollection(collection: Collection): boolean {
    for (let key of Object.keys(collection)) {
      if (!Number(key)) {
        return false;
      }
      for (let innerKey of Object.keys(collection[key])) {
        if (innerKey !== 'episodes') {
          return false;
        }
        for (let episodeId of Object.keys(collection[key].episodes)) {
          if (
            !Number(episodeId) ||
            !_.isBoolean(collection[key].episodes[episodeId])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }*/

  // icons
  faSFileUpload = faSFileUpload;
  faSFileDownload = faSFileDownload;
  faSServer = faSServer;
}
