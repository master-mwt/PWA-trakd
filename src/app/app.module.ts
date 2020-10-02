import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { ExploreComponent } from './components/pages/explore/explore.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { SearchComponent } from './components/pages/search/search.component';
import { SeasonComponent } from './components/pages/season/season.component';
import { CollectionComponent } from './components/pages/collection/collection.component';
import { EpisodeComponent } from './components/pages/episode/episode.component';
import { BackupComponent } from './components/pages/backup/backup.component';
import { GenresComponent } from './components/pages/genres/genres.component';
import { InfoComponent } from './components/pages/info/info.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ExploreComponent,
    NotfoundComponent,
    DetailsComponent,
    SearchComponent,
    SeasonComponent,
    CollectionComponent,
    EpisodeComponent,
    BackupComponent,
    GenresComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
