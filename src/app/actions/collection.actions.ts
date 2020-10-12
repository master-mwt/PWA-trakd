import { Action } from '@ngrx/store';
import { Collection } from '../domain/Collection';
import { Episode } from '../domain/Episode';
import { Season } from '../domain/Season';
import { TvShowDetails } from '../domain/TvShowDetails';
import { TvShowPreview } from '../domain/TvShowPreview';

export enum ECollectionActions {
  REFRESH_COLLECTION = 'REFRESH_COLLECTION',
  REFRESH_COLLECTION_SUCCESS = 'REFRESH_COLLECTION_SUCCESS',
  REFRESH_COLLECTION_ERROR = 'REFRESH_COLLECTION_ERROR',
  SAVE_COLLECTION = 'SAVE_COLLECTION',
  SAVE_COLLECTION_SUCCESS = 'SAVE_COLLECTION_SUCCESS',
  SAVE_COLLECTION_ERROR = 'SAVE_COLLECTION_ERROR',
  ADD_TO_COLLECTION = 'ADD_TO_COLLECTION',
  ADD_TO_COLLECTION_SUCCESS = 'ADD_TO_COLLECTION_SUCCESS',
  ADD_TO_COLLECTION_ERROR = 'ADD_TO_COLLECTION_ERROR',
  REMOVE_FROM_COLLECTION = 'REMOVE_FROM_COLLECTION',
  MARK_ALL_SEASON_EPISODES_AS_SEEN = 'MARK_ALL_SEASON_EPISODES_AS_SEEN',
  MARK_ALL_SEASON_EPISODES_AS_UNSEEN = 'MARK_ALL_SEASON_EPISODES_AS_UNSEEN',
  MARK_ALL_TV_SHOW_EPISODES_AS_SEEN = 'MARK_ALL_TV_SHOW_EPISODES_AS_SEEN',
  MARK_ALL_TV_SHOW_EPISODES_AS_UNSEEN = 'MARK_ALL_TV_SHOW_EPISODES_AS_UNSEEN',
  MARK_EPISODE_AS_SEEN = 'MARK_EPISODE_AS_SEEN',
  MARK_EPISODE_AS_UNSEEN = 'MARK_EPISODE_AS_UNSEEN',
}

export class RefreshCollectionAction implements Action {
  readonly type = ECollectionActions.REFRESH_COLLECTION;
}

export class RefreshCollectionSuccessAction implements Action {
  readonly type = ECollectionActions.REFRESH_COLLECTION_SUCCESS;
  constructor(public payload: Collection) {}
}

export class RefreshCollectionErrorAction implements Action {
  readonly type = ECollectionActions.REFRESH_COLLECTION_ERROR;
  constructor(public payload: any) {}
}

export class SaveCollectionAction implements Action {
  readonly type = ECollectionActions.SAVE_COLLECTION;
  constructor(public payload: Collection) {}
}

export class SaveCollectionSuccessAction implements Action {
  readonly type = ECollectionActions.SAVE_COLLECTION_SUCCESS;
  constructor(public payload: Collection) {}
}

export class SaveCollectionErrorAction implements Action {
  readonly type = ECollectionActions.SAVE_COLLECTION_ERROR;
  constructor(public payload: any) {}
}

export class AddToCollectionAction implements Action {
  readonly type = ECollectionActions.ADD_TO_COLLECTION;
  constructor(public payload: TvShowDetails) {}
}

export class RemoveFromCollectionAction implements Action {
  readonly type = ECollectionActions.REMOVE_FROM_COLLECTION;
  constructor(public payload: TvShowPreview | TvShowDetails) {}
}

export class MarkAllSeasonEpisodesAsSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_SEASON_EPISODES_AS_SEEN;
  constructor(public payload: Season) {}
}

export class MarkAllSeasonEpisodesAsNotSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_SEASON_EPISODES_AS_UNSEEN;
  constructor(public payload: Season) {}
}

export class MarkAllTvShowEpisodesAsSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_TV_SHOW_EPISODES_AS_SEEN;
  constructor(public payload: TvShowDetails) {}
}

export class MarkAllTvShowEpisodesAsNotSeenAction implements Action {
  readonly type = ECollectionActions.MARK_ALL_TV_SHOW_EPISODES_AS_UNSEEN;
  constructor(public payload: TvShowDetails) {}
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

export class AddToCollectionErrorAction implements Action {
  readonly type = ECollectionActions.ADD_TO_COLLECTION_ERROR;
  constructor(public payload: any) {}
}

export type ALL_REDUCER_ACTIONS =
  | RefreshCollectionAction
  | RefreshCollectionSuccessAction
  | RefreshCollectionErrorAction
  | SaveCollectionAction
  | SaveCollectionSuccessAction
  | SaveCollectionErrorAction
  | AddToCollectionAction
  | RemoveFromCollectionAction
  | MarkAllSeasonEpisodesAsSeenAction
  | MarkAllSeasonEpisodesAsNotSeenAction
  | MarkAllTvShowEpisodesAsSeenAction
  | MarkAllTvShowEpisodesAsNotSeenAction
  | MarkEpisodeAsSeenAction
  | MarkEpisodeAsNotSeenAction
  | AddToCollectionSuccessAction
  | AddToCollectionErrorAction;
