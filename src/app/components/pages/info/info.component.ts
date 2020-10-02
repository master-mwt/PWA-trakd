import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit, OnDestroy {
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
        'Trakd: applicazione gratis che ti permette di seguire le tue serie tv preferite'
      );
    } else {
      this.title.setTitle(
        'Trakd: free application that allows you to track your favourites tvshows'
      );
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }
}
