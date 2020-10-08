import { createSelector } from '@ngrx/store';
import { IAppState, IUserState } from '../state/app.state';

const selectUserFunction = (state: IAppState) => {
  return state.userState;
};

export const selectUser = createSelector(
  selectUserFunction,
  (state: IUserState) => {
    return state.user;
  }
);
