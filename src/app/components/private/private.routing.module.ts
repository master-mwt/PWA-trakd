import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CollectionComponent } from '../private/collection/collection.component';
import { BackupComponent } from '../private/backup/backup.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'backup', component: BackupComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PrivateRoutingModule {
  constructor() {}
}
