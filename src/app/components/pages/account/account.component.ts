import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RefreshCollectionAction } from 'src/app/actions/collection.actions';
import { RefreshUserAction } from 'src/app/actions/user.actions';
import { AuthService } from 'src/app/auth/auth.service';
import { UserProfile } from 'src/app/domain/UserProfile';
import { selectUser } from 'src/app/selectors/user.selector';
import { IAppState } from 'src/app/state/app.state';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  user: UserProfile;
  userSelectorSubscr: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<IAppState>
  ) {
    // listen user selector
    this.userSelectorSubscr = store
      .pipe(select(selectUser))
      .subscribe((userProfile) => {
        this.user = userProfile;
      });
  }

  ngOnDestroy(): void {
    this.userSelectorSubscr.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.user && this.auth.isAuthenticated()) {
      this.store.dispatch(new RefreshUserAction());
      this.store.dispatch(new RefreshCollectionAction());
    }
  }

  logout(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
      this.router.navigate(['explore/popular']);
    }
  }
}
