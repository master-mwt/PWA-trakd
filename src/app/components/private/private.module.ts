import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrivateRoutingModule } from './private.routing.module';
import { ProfileComponent } from './profile/profile.component';
import { BackupComponent } from './backup/backup.component';
import { CollectionComponent } from './collection/collection.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileUpdateComponent,
    BackupComponent,
    CollectionComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    PrivateRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    TranslateModule,
    InfiniteScrollModule,
  ],
})
export class PrivateModule {
  constructor() {
    console.log('LoggedModule initiliazed');
  }
}
