import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './components/commons/navbar/navbar.component';
import { ExploreComponent } from './components/pages/explore/explore.component';
import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { SearchComponent } from './components/pages/search/search.component';
import { SeasonComponent } from './components/pages/season/season.component';
import { EpisodeComponent } from './components/pages/episode/episode.component';
import { GenresComponent } from './components/pages/genres/genres.component';
import { InfoComponent } from './components/pages/info/info.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducers } from './reducers/app.reducer';
import { CollectionEffects } from './effects/collection-effects.service';
import { SignInComponent } from './components/pages/signin/signin.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginResult } from './domain/LoginResult';
import { AppConstants } from './app.constants';
import { TokenInterceptorService } from './auth/token-interceptor.service';
import { UserEffects } from './effects/user-effects.service';
import { SignUpComponent } from './components/pages/signup/signup.component';
import { AccountComponent } from './components/pages/account/account.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function tokenGetter() {
  const loginStored: LoginResult = JSON.parse(
    localStorage.getItem(AppConstants.LOGIN_STORAGE)
  );
  if (loginStored !== undefined && loginStored !== null) {
    return loginStored.token;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ExploreComponent,
    NotfoundComponent,
    DetailsComponent,
    SearchComponent,
    SeasonComponent,
    EpisodeComponent,
    GenresComponent,
    InfoComponent,
    SignInComponent,
    SignUpComponent,
    AccountComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([CollectionEffects, UserEffects]),
    JwtModule.forRoot({
      config: {
        tokenGetter,
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
