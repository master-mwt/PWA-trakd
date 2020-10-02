import { Collection } from '../domain/Collection';

export interface IAppState {
  collectionState: ICollectionState;
}

export interface ICollectionState {
  collection: Collection;
}

export const initialCollectionState: ICollectionState = {
  collection: null,
};
