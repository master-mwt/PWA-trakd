import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/domain/UserProfile';
import { LocalserverService } from 'src/app/services/localserver.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  user: UserProfile;

  constructor(private localserverService: LocalserverService) {}

  ngOnInit(): void {
    // TODO: this should be in ngrx ?
    this.localserverService.getUserProfileData().subscribe(
      (data) => {
        console.log('success');
        console.log(data);
        this.user = data;
      },
      (error) => {
        console.log('error');
        console.log(error);
      }
    );
  }
}
