import { ICollectionState, initialCollectionState } from '../state/app.state';
import * as Actions from '../actions/collection.actions';
import { ECollectionActions } from '../actions/collection.actions';
import { Collection } from '../domain/Collection';
import { Season } from '../domain/Season';

export function collectionReducer(
  state = initialCollectionState,
  action: Actions.ALL_REDUCER_ACTIONS
): ICollectionState {
  let collection: Collection = null;
  let seasons: Season[] = null;

  // TODO: remove debug logs
  switch (action.type) {
    case ECollectionActions.ADD_TO_COLLECTION_SUCCESS:
      collection = JSON.parse(JSON.stringify(state.collection));

      if (collection === null) {
        collection = {};
      }

      seasons = action.payload;
      collection[seasons[0].tv_show_id] = { episodes: {} };
      for (let season of seasons) {
        for (let episode of season.episodes) {
          collection[season.tv_show_id].episodes[episode.id] = false;
        }
      }

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.REMOVE_FROM_COLLECTION:
      collection = JSON.parse(JSON.stringify(state.collection));
      delete collection[action.payload.id];

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_ALL_SEASON_EPISODES_AS_SEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      for (let episode of action.payload.episodes) {
        collection[action.payload.tv_show_id].episodes[episode.id] = true;
      }

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_ALL_SEASON_EPISODES_AS_UNSEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      for (let episode of action.payload.episodes) {
        collection[action.payload.tv_show_id].episodes[episode.id] = false;
      }

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_ALL_TV_SHOW_EPISODES_AS_SEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      for (let episodeKey of Object.keys(
        collection[action.payload.id].episodes
      )) {
        collection[action.payload.id].episodes[episodeKey] = true;
      }

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_ALL_TV_SHOW_EPISODES_AS_UNSEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      for (let episodeKey of Object.keys(
        collection[action.payload.id].episodes
      )) {
        collection[action.payload.id].episodes[episodeKey] = false;
      }

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_EPISODE_AS_SEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      collection[action.payload.tv_show_id].episodes[action.payload.id] = true;

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    case ECollectionActions.MARK_EPISODE_AS_UNSEEN:
      collection = JSON.parse(JSON.stringify(state.collection));
      collection[action.payload.tv_show_id].episodes[action.payload.id] = false;

      console.log(collection);

      return {
        ...state,
        collection: collection,
      };

    default:
      return state;
  }
}
