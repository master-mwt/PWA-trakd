import { Collection } from '../domain/Collection';
import { UserProfile } from '../domain/UserProfile';

export interface IAppState {
  collectionState: ICollectionState;
  userState: IUserState;
}

export interface IUserState {
  user: UserProfile;
}

export interface ICollectionState {
  collection: Collection;
}

export const initialUserState: IUserState = {
  user: null,
};

export const initialCollectionState: ICollectionState = {
  collection: null,
};
