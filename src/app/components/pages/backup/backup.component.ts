import { Component, OnInit, OnDestroy } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {
  faFileUpload as faSFileUpload,
  faFileDownload as faSFileDownload,
  faServer as faSServer,
} from '@fortawesome/free-solid-svg-icons';
import { Collection } from 'src/app/domain/Collection';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css'],
})
export class BackupComponent implements OnInit, OnDestroy {
  log_status: string = 'waiting';
  log_message: string = 'idle';

  private langChangeSubscription: any;

  constructor(private title: Title, private translate: TranslateService) {
    this.setTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.setTitle();
      }
    );
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
  }

  backup(): void {
    let blob: Blob = new Blob([localStorage.getItem('collection')], {
      type: 'application/json',
    });
    let day = new Date().getDate().toString();
    let month = (new Date().getMonth() + 1).toString();
    let year = new Date().getFullYear().toString();
    let hour = new Date().getHours().toString();
    let minutes = new Date().getMinutes().toString();
    let seconds = new Date().getSeconds().toString();
    let date =
      day +
      '-' +
      month +
      '-' +
      year +
      '_' +
      hour +
      '-' +
      minutes +
      '-' +
      seconds;
    FileSaver.saveAs(blob, 'collection_' + date + '.json');
  }

  restore(): void {
    $('#file-upload').trigger('click');
  }

  fileChanged(e: Event): void {
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
  }

  parseCollection(collection: Collection): boolean {
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
  }

  // icons
  faSFileUpload = faSFileUpload;
  faSFileDownload = faSFileDownload;
  faSServer = faSServer;
}
