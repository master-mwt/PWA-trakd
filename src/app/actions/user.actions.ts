import { Action } from '@ngrx/store';
import { UserProfile } from '../domain/UserProfile';

export enum EUserActions {
  REFRESH_USER = 'REFRESH_USER',
  REFRESH_USER_SUCCESS = 'REFRESH_USER_SUCCESS',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS',
}

export class RefreshUserAction implements Action {
  readonly type = EUserActions.REFRESH_USER;
}

export class RefreshUserSuccessAction implements Action {
  readonly type = EUserActions.REFRESH_USER_SUCCESS;
  constructor(public payload: UserProfile) {}
}

export class UpdateUserAction implements Action {
  readonly type = EUserActions.UPDATE_USER;
  constructor(public payload: UserProfile) {}
}

export class UpdateUserSuccessAction implements Action {
  readonly type = EUserActions.UPDATE_USER_SUCCESS;
  constructor(public payload: UserProfile) {}
}

export type ALL_REDUCER_ACTIONS =
  | RefreshUserAction
  | RefreshUserSuccessAction
  | UpdateUserAction
  | UpdateUserSuccessAction;
