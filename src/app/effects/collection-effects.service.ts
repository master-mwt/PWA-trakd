import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  AddToCollectionAction,
  AddToCollectionSuccessAction,
  ECollectionActions,
} from '../actions/collection.actions';
import { Season } from '../domain/Season';
import { TmdbService } from '../services/tmdb.service';

@Injectable()
export class CollectionEffects {
  constructor(private actions$: Actions, private tmdbService: TmdbService) {}

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
}
