import { BackupComponent } from './components/pages/backup/backup.component';
import { EpisodeComponent } from './components/pages/episode/episode.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from './components/pages/notfound/notfound.component';
import { ExploreComponent } from './components/pages/explore/explore.component';
import { SearchComponent } from './components/pages/search/search.component';
import { DetailsComponent } from './components/pages/details/details.component';
import { SeasonComponent } from './components/pages/season/season.component';
import { CollectionComponent } from './components/pages/collection/collection.component';
import { GenresComponent } from './components/pages/genres/genres.component';
import { InfoComponent } from './components/pages/info/info.component';

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
  { path: 'collection', component: CollectionComponent },
  { path: 'backup', component: BackupComponent },
  { path: 'info', component: InfoComponent },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
