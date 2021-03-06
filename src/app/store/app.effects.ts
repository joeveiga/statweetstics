import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, withLatestFrom, map, filter } from 'rxjs/operators';

import { TweetService } from '../services/tweet.service';

import * as fromActions from './app.actions';
import * as fromSelectors from './app.selectors';
import { IState } from './app.reducer';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private store: Store<IState>,
    private appService: TweetService
  ) {}

  fetchTweets$ = createEffect(() =>
    this.appService.tweets$.pipe(
      map((message) => fromActions.FetchTweet({ message }))
    )
  );

  filterTweets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.FetchTweet),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromSelectors.SelectHashtags)))
        )
      ),
      filter(([action, hashtags]) =>
        TweetService.hasHashtags(action.message, hashtags)
      ),
      map(([action, _]) =>
        fromActions.ReceiveTweet({ message: action.message })
      )
    )
  );

  perCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.ReceiveTweet),
      filter((action) => !!action.message.place?.country_code), // filter out tweets with undefined country
      map((action) =>
        fromActions.IncrementCountryTweetCount({
          country: action.message.place,
        })
      )
    )
  );

  reset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.AddHashtag, fromActions.RemoveHashtag),
      map(() => fromActions.Reset())
    )
  );
}
