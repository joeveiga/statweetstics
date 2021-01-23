import { Injectable, OnDestroy } from '@angular/core';
import * as countryData from 'country-data';
import { PubNubAngular } from 'pubnub-angular2';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ITweet } from '../model';

@Injectable({
  providedIn: 'root',
})
export class TweetService implements OnDestroy {
  readonly tweets$: Subject<ITweet>;

  /**
   * Checks if the tweet contains at least one of the hashtags in
   * the provided hashtags collection
   */
  static hasHashtags(tweet: ITweet, hashtags: string[]): boolean {
    if (!hashtags.length) {
      return true; // no filter set
    }

    // convert htags to uppercase for comparison
    hashtags = hashtags.map((ht) => ht.toUpperCase());
    const msgHtags =
      tweet.entities?.hashtags?.map((ht) => ht.text.toUpperCase()) || [];

    return !!msgHtags.find((msgHt) => hashtags.find((ht) => ht === msgHt));
  }

  /**
   * Get average tweets in a time range and at a given interval
   * @param startMs Start of the range in ms
   * @param endMs End of time range in ms
   * @param tweetCount Total tweets count
   * @param timeIntervalMs Time interval in ms. E.g. 60000 to get 'tweets per minute'
   */
  static getAvgTweets(
    startMs: number,
    endMs: number,
    tweetCount: number,
    timeIntervalMs: number
  ): number {
    if (startMs > endMs) {
      throw new Error('end of time range needs to be greater than its start');
    }

    if (tweetCount < 0) {
      throw new Error('tweetCount must be a non negative value');
    }

    if (timeIntervalMs <= 0) {
      throw new Error('timeIntervalMs must be greater than zero');
    }

    const interval = (endMs - startMs) / timeIntervalMs;
    return tweetCount / interval;
  }

  /**
   * Get the top n countries with the largest amount of tweets
   * @param tpc Collection of tweets per country code
   * @param n Number of top countries to return
   */
  static getTopCountries(
    tpc: { [countryCode: string]: number },
    n: number
  ): { name: string; value: number }[] {
    if (n <= 0) {
      throw new Error('n must be greater than zero');
    }

    const tpcValues = Object.keys(tpc).map((cc) => ({ cc, value: tpc[cc] }));
    tpcValues.sort((a, b) => b.value - a.value);
    return tpcValues.slice(0, n).map((c) => ({
      name: countryData.countries[c.cc]?.name || c.cc,
      value: c.value,
    }));
  }

  constructor(private readonly pubnub: PubNubAngular) {
    this.tweets$ = new Subject();

    // init & subscribe
    this.pubnub.init({ subscribeKey: environment.pubnub_subscribe_key });
    this.pubnub.subscribe({
      channels: [environment.pubnub_twitter_channel],
      triggerEvents: ['message'],
    });

    this.pubnub.getMessage(environment.pubnub_twitter_channel, (msg) =>
      this.tweets$.next(msg.message)
    );
  }

  ngOnDestroy(): void {
    this.tweets$.complete();
    this.pubnub.unsubscribeAll();
  }
}
