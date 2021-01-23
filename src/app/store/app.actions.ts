import { createAction, props } from '@ngrx/store';
import { ITweet, ITweetPlace } from '../model';

// Fetch tweets from raw feed
export const FetchTweet = createAction(
  '[App] Fetch tweet',
  props<{ message: ITweet }>()
);

// Receive a tweet (if it passes the hashtags filter)
export const ReceiveTweet = createAction(
  '[App] Receive tweet',
  props<{ message: ITweet }>()
);

export const IncrementCountryTweetCount = createAction(
  '[App] Increment country tweet count',
  props<{ country: ITweetPlace }>()
);

export const AddHashtag = createAction(
  '[App] Add hashtag',
  props<{ hashtag: string }>()
);

export const RemoveHashtag = createAction(
  '[App] Remove hashtag',
  props<{ hashtag: string }>()
);

export const Reset = createAction('[App] Reset');
