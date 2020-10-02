import { createSelector } from '@ngrx/store';
import { IAppState, ICollectionState } from '../state/app.state';

const selectCollectionFunction = (state: IAppState) => {
  return state.collectionState;
};

export const selectCollection = createSelector(
  selectCollectionFunction,
  (state: ICollectionState) => {
    return state.collection;
  }
);
