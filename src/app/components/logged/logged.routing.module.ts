import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CollectionComponent } from '../pages/collection/collection.component';
import { BackupComponent } from '../pages/backup/backup.component';

const routes: Routes = [
  { path: '', component: ProfilePageComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'backup', component: BackupComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LoggedRoutingModule {
  constructor() {
    console.log('Logged routing module initialized');
  }
}
