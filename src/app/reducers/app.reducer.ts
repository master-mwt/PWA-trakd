import { ActionReducerMap } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { collectionReducer } from './collection.reducer';
import { userReducer } from './user.reducer';

export const appReducers: ActionReducerMap<IAppState, any> = {
  collectionState: collectionReducer,
  userState: userReducer,
};
