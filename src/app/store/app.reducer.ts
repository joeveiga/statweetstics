import { createReducer, on } from '@ngrx/store';
import * as fromActions from './app.actions';

export interface IState {
  hashtags: string[];
  startRecordingMs: number;
  // NOTE(jose): the total tweets count could be extracted from
  // the per_country collection as well
  tweetCount: number;
  perCountry: object;
}

export const initialState: IState = {
  hashtags: [],
  startRecordingMs: new Date().getTime(),
  tweetCount: 0,
  perCountry: {},
};

const reducer = createReducer(
  initialState,

  on(fromActions.Reset, (state) => ({
    ...initialState,
    startRecordingMs: new Date().getTime(),
    hashtags: state.hashtags,
  })),

  on(fromActions.IncrementCountryTweetCount, (state, props) => ({
    ...state,
    tweetCount: state.tweetCount + 1,
    perCountry: {
      ...state.perCountry,
      [props.country.countryCode]:
        (state.perCountry[props.country.countryCode] || 0) + 1,
    },
  })),

  on(fromActions.AddHashtag, (state, props) => ({
    ...state,
    hashtags: [...state.hashtags, props.hashtag],
  })),

  on(fromActions.RemoveHashtag, (state, props) => ({
    ...state,
    hashtags: state.hashtags.filter((ht) => ht !== props.hashtag),
  }))
);

export function appReducer(state, action): IState {
  return reducer(state, action);
}
