import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedRoutingModule } from './logged.routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [CommonModule, LoggedRoutingModule],
})
export class LoggedModule {
  constructor() {
    console.log('LoggedModule initiliazed');
  }
}
