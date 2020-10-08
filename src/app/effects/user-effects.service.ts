import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  EUserActions,
  RefreshUserAction,
  RefreshUserSuccessAction,
  UpdateUserAction,
  UpdateUserSuccessAction,
} from '../actions/user.actions';
import { UserProfile } from '../domain/UserProfile';
import { LocalserverService } from '../services/localserver.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private localserverService: LocalserverService
  ) {}

  @Effect()
  refreshUserProfile: Observable<Action> = this.actions$.pipe(
    ofType<RefreshUserAction>(EUserActions.REFRESH_USER),
    switchMap(() => this.localserverService.getUserProfileData()),
    switchMap((userProfile: UserProfile) =>
      of(new RefreshUserSuccessAction(userProfile))
    )
  );

  @Effect()
  updateUserProfile: Observable<Action> = this.actions$.pipe(
    ofType<UpdateUserAction>(EUserActions.UPDATE_USER),
    switchMap((action: UpdateUserAction) =>
      this.localserverService.setUserProfileData(action.payload)
    ),
    switchMap((userProfile: UserProfile) =>
      of(new UpdateUserSuccessAction(userProfile))
    )
  );
}
