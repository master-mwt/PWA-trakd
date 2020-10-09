import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RefreshUserAction } from 'src/app/actions/user.actions';
import { UserProfile } from 'src/app/domain/UserProfile';
import { selectUser } from 'src/app/selectors/user.selector';
import { IAppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user: UserProfile;
  userSelectorSub: any;
  wantUpdateProfile: boolean = false;

  constructor(private store: Store<IAppState>) {
    this.userSelectorSub = this.store
      .pipe(select(selectUser))
      .subscribe((UserProfile) => {
        this.user = UserProfile;
      });
  }

  ngOnDestroy(): void {
    this.userSelectorSub.unsubscribe();
  }

  ngOnInit(): void {
    this.store.dispatch(new RefreshUserAction());
  }

  wantUpdate(): void {
    this.wantUpdateProfile = !this.wantUpdateProfile;
  }

  handleUpdateComplete(event: string): void {
    if (event === 'success') {
      this.wantUpdateProfile = false;
    }
  }
}
