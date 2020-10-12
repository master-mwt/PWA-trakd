import { initialUserState, IUserState } from '../state/app.state';
import * as Actions from '../actions/user.actions';
import { EUserActions } from '../actions/user.actions';

export function userReducer(
  state = initialUserState,
  action: Actions.ALL_REDUCER_ACTIONS
): IUserState {
  switch (action.type) {
    case EUserActions.REFRESH_USER_SUCCESS:
      console.log(action.payload);

      return {
        ...state,
        user: action.payload,
      };

    case EUserActions.REFRESH_USER_ERROR:
      console.log('error action');
      console.log(action.payload);
    
      return state;

    case EUserActions.UPDATE_USER_SUCCESS:
      console.log(action.payload);

      return {
        ...state,
        user: action.payload,
      };

    case EUserActions.UPDATE_USER_ERROR:
      console.log('error action');
      console.log(action.payload);
    
      return state;

    default:
      return state;
  }
}
