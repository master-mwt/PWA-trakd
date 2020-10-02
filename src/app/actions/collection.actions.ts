import { Action } from '@ngrx/store';
import { Collection } from '../domain/Collection';

export enum ECollectionActions {
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
}

export class UpdateCollectionAction implements Action {
  readonly type = ECollectionActions.UPDATE_COLLECTION;
  constructor(public payload: Collection) {}
}

export type ALL_REDUCER_ACTIONS = UpdateCollectionAction;
