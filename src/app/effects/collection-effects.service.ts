import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  AddToCollectionAction,
  AddToCollectionSuccessAction,
  ECollectionActions,
  RefreshCollectionAction,
  RefreshCollectionSuccessAction,
} from '../actions/collection.actions';
import { Collection } from '../domain/Collection';
import { Season } from '../domain/Season';
import { LocalserverService } from '../services/localserver.service';
import { TmdbService } from '../services/tmdb.service';

@Injectable()
export class CollectionEffects {
  constructor(
    private actions$: Actions,
    private tmdbService: TmdbService,
    private localserverService: LocalserverService
  ) {}

  @Effect()
  addTvShowToCollection: Observable<Action> = this.actions$.pipe(
    ofType<AddToCollectionAction>(ECollectionActions.ADD_TO_COLLECTION),
    switchMap((action: AddToCollectionAction) => {
      return this.tmdbService.getAllTvShowSeasons(action.payload).pipe(
        map((seasons: Season[]) => {
          for (let season of seasons) {
            season.tv_show_id = action.payload.id;
          }
          return seasons;
        })
      );
    }),
    switchMap((seasons: Season[]) =>
      of(new AddToCollectionSuccessAction(seasons))
    )
  );

  @Effect()
  refreshCollection: Observable<Action> = this.actions$.pipe(
    ofType<RefreshCollectionAction>(ECollectionActions.REFRESH_COLLECTION),
    switchMap(() => this.localserverService.getUserCollection()),
    switchMap((collection: Collection) =>
      of(new RefreshCollectionSuccessAction(collection))
    )
  );
}
