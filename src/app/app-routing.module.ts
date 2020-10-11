import { EpisodeComponent } from './components/pages/episode/episode.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { ExploreComponent } from './components/pages/explore/explore.component';
import { SearchComponent } from './components/pages/search/search.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { SeasonComponent } from './components/pages/season/season.component';
import { GenresComponent } from './components/pages/genres/genres.component';
import { InfoComponent } from './components/pages/info/info.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { SignInComponent } from './components/pages/signin/signin.component';
import { SignUpComponent } from './components/pages/signup/signup.component';
import { AccountComponent } from './components/pages/account/account.component';

const routes: Routes = [
  { path: '', redirectTo: 'explore/popular', pathMatch: 'full' },
  { path: 'explore/popular', component: ExploreComponent },
  { path: 'explore/top_rated', component: ExploreComponent },
  { path: 'discover/:tv_show_id/details', component: DetailsComponent },
  {
    path: 'discover/:tv_show_id/details/season/:season_number',
    component: SeasonComponent,
  },
  {
    path:
      'discover/:tv_show_id/details/season/:season_number/episode/:episode_number',
    component: EpisodeComponent,
  },
  { path: 'search', component: SearchComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'info', component: InfoComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'account', component: AccountComponent },
  // protected routes
  {
    path: 'private',
    loadChildren: () =>
      import('./components/private/private.module').then(
        (mod) => mod.PrivateModule
      ),
    canActivate: [AuthGuardService],
  },
  // invalid routes
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {
    console.log('AppRoutingModule initiliazed');
  }
}
