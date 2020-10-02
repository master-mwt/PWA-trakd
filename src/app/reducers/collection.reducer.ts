import { ICollectionState, initialCollectionState } from '../state/app.state';
import * as Actions from '../actions/collection.actions';
import { ECollectionActions } from '../actions/collection.actions';

export function collectionReducer(
  state = initialCollectionState,
  // TODO: action type
  action: Actions.ALL_REDUCER_ACTIONS
): ICollectionState {
  switch (action.type) {
    //TODO: action cases
    case ECollectionActions.UPDATE_COLLECTION:
      return {
        ...state,
        collection: action.payload,
      };
    default:
      return state;
  }
}
