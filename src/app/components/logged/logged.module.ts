import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedRoutingModule } from './logged.routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { ProfilePageUpdateComponent } from './profile-page-update/profile-page-update.component';
import { ReactiveFormsModule } from '@angular/forms';

// TODO: adjust declarations and imports for new pages (in old module yet)
@NgModule({
  declarations: [ProfilePageComponent, ProfilePageUpdateComponent],
  imports: [CommonModule, LoggedRoutingModule, ReactiveFormsModule],
})
export class LoggedModule {
  constructor() {
    console.log('LoggedModule initiliazed');
  }
}
