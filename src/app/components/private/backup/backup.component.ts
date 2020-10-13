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
  imported: boolean = false;
  exported: boolean = false;

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

  ngOnInit(): void {
    this.imported = false;
    this.exported = false;
  }

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
    this.collectionSelectorSub.unsubscribe();
  }

  backup(): void {
    this.store.dispatch(new SaveCollectionAction(this.collection));
    this.imported = false;
    this.exported = true;
  }

  restore(): void {
    this.store.dispatch(new RefreshCollectionAction());
    this.imported = true;
    this.exported = false;
  }

  // icons
  faSFileUpload = faSFileUpload;
  faSFileDownload = faSFileDownload;
  faSServer = faSServer;
}
