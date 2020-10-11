import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UpdateUserAction } from 'src/app/actions/user.actions';
import { UserProfile } from 'src/app/domain/UserProfile';
import { selectUser } from 'src/app/selectors/user.selector';
import { IAppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
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

  ngOnInit(): void {}

  wantUpdate(): void {
    this.wantUpdateProfile = !this.wantUpdateProfile;
  }

  handleUpdateComplete(event: UserProfile): void {
    console.log('update event');
    console.log(event);
    this.store.dispatch(new UpdateUserAction(event));
    this.wantUpdateProfile = false;
  }
}
