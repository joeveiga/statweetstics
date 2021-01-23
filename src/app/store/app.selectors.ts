import { createSelector } from '@ngrx/store';
import { TweetService } from '../services/tweet.service';
import { IState } from './app.reducer';

export const SelectApp = (state) => state.app;

export const SelectHashtags = createSelector(
  SelectApp,
  (state: IState) => state.hashtags
);

export const SelectAvgTPM = createSelector(SelectApp, (state: IState, props) =>
  TweetService.getAvgTweets(
    state.startRecordingMs,
    new Date().getTime(),
    state.tweetCount,
    props.interval
  )
);

export const SelectTweetsPerCountry = createSelector(
  SelectApp,
  (state: IState) => state.perCountry
);

export const SelectTopCountries = createSelector(
  SelectTweetsPerCountry,
  (tpc, props) => TweetService.getTopCountries(tpc, props.count)
);
