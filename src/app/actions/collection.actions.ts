import { Action } from '@ngrx/store';
import { Collection } from '../domain/Collection';
import { Episode } from '../domain/Episode';
import { Season } from '../domain/Season';
import { TvShowDetails } from '../domain/TvShowDetails';
import { TvShowPreview } from '../domain/TvShowPreview';

export enum ECollectionActions {
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
  ADD_TO_COLLECTION = 'ADD_TO_COLLECTION',
  ADD_TO_COLLECTION_SUCCESS = 'ADD_TO_COLLECTION_SUCCESS',
  REMOVE_FROM_COLLECTION = 'REMOVE_FROM_COLLECTION',
  MARK_ALL_EPISODES_AS_SEEN = 'MARK_ALL_EPISODES_AS_SEEN',
  MARK_ALL_EPISODES_AS_UNSEEN = 'MARK_ALL_EPISODES_AS_UNSEEN',
  MARK_EPISODE_AS_SEEN = 'MARK_EPISODE_AS_SEEN',
  MARK_EPISODE_AS_UNSEEN = 'MARK_EPISODE_AS_UNSEEN',
}

export class UpdateCollectionAction implements Action {
  readonly type = ECollectionActions.UPDATE_COLLECTION;
  constructor(public payload: Collection) {}
}

export class AddToCollectionAction implements Action {
  readonly type = ECollectionActions.ADD_TO_COLLECTION;
  constructor(public payload: TvShowDetails) {}
}

export class RemoveFromCollectionAction implements Action {
  readonly type = ECollectionActions.REMOVE_FROM_COLLECTION;
  constructor(public payload: TvShowPreview | TvShowDetails) {}
}

export class MarkAllEpisodesAsSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_EPISODES_AS_SEEN;
  constructor(public payload: Season) {}
}

export class MarkAllEpisodesAsNotSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_EPISODES_AS_UNSEEN;
  constructor(public payload: Season) {}
}

export class MarkEpisodeAsSeenAction implements Action {
  readonly type = ECollectionActions.MARK_EPISODE_AS_SEEN;
  constructor(public payload: Episode) {}
}

export class MarkEpisodeAsNotSeenAction implements Action {
  readonly type = ECollectionActions.MARK_EPISODE_AS_UNSEEN;
  constructor(public payload: Episode) {}
}

export class AddToCollectionSuccessAction implements Action {
  readonly type = ECollectionActions.ADD_TO_COLLECTION_SUCCESS;
  constructor(public payload: Season[]) {}
}

export type ALL_REDUCER_ACTIONS =
  | UpdateCollectionAction
  | AddToCollectionAction
  | RemoveFromCollectionAction
  | MarkAllEpisodesAsSeenAction
  | MarkAllEpisodesAsNotSeenAction
  | MarkEpisodeAsSeenAction
  | MarkEpisodeAsNotSeenAction
  | AddToCollectionSuccessAction;
