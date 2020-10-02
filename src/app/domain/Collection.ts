import { TvShowCollection } from 'src/app/domain/TvShowCollection';

export interface Collection {
  [key: number]: TvShowCollection;
}
