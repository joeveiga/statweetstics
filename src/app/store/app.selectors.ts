import { createSelector } from '@ngrx/store';
import { IState } from './app.reducer';
import { AppService } from '../services/app.service';

export const SelectApp = (state) => state.app;

export const SelectHashtags = createSelector(
  SelectApp,
  (state: IState) => state.hashtags
);

export const SelectAvgTPM = createSelector(SelectApp, (state: IState, props) =>
  new AppService().getAvgTweets(
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
  (tpc, props) => new AppService().getTopCountries(tpc, props.count)
);
