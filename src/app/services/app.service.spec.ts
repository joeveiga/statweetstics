import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import { ITweet, ITweetPlace } from '../model';

describe('AppService', () => {
  let sut: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sut = TestBed.inject(AppService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  describe('has_hashtags', () => {
    let tweetBuilder: TweetBuilder;

    beforeEach(() => {
      tweetBuilder = new TweetBuilder();
    });

    it('true if the tweet contains at least one of the htags', () => {
      // arrange
      const tweet = tweetBuilder.withHashtags('CoViD19', 'theRona').build();
      const htags = ['coronavirus', 'CoViD19'];

      // act / assert
      expect(sut.hasHashtags(tweet, htags)).toBeTrue();
    });

    it('false if the tweet does not contain any of the htags', () => {
      // arrange
      const tweet = tweetBuilder.withHashtags('CoViD19', 'theRona').build();
      const htags = ['coronavirus', 'Pandemic'];

      // act / assert
      expect(sut.hasHashtags(tweet, htags)).toBeFalse();
    });

    it('always true if htags filter is empty', () => {
      // arrange
      const tweet = tweetBuilder.withHashtags('CoViD19', 'theRona').build();
      const htags = [];

      // act / assert
      expect(sut.hasHashtags(tweet, htags)).toBeTrue();
    });

    it('performs a case insensitive comparison', () => {
      // arrange
      const tweet = tweetBuilder.withHashtags('CoViD19').build();
      const htags = ['covid19'];

      // act / assert
      expect(sut.hasHashtags(tweet, htags)).toBeTrue();
    });
  });

  describe('get_avg_tweets', () => {
    it('fails if invalid time range', () => {
      // act / assert
      expect(() => sut.getAvgTweets(2, 1, 0, 1)).toThrow();
    });

    it('fails if invalid c_tweets', () => {
      // act / assert
      expect(() => sut.getAvgTweets(1, 2, -1, 1)).toThrow();
    });

    it('fails if invalid time_interval_ms', () => {
      // act / assert
      expect(() => sut.getAvgTweets(1, 2, 1, 0)).toThrow();
    });

    [
      {
        testId: 1,
        expected: 5,
        startMs: 0,
        endMs: 60000,
        tweetCount: 5,
        timeIntervalMs: 60000,
      },
      {
        testId: 2,
        expected: 10,
        startMs: 0,
        endMs: 30000,
        tweetCount: 5,
        timeIntervalMs: 60000,
      },
      {
        testId: 3,
        expected: 5,
        startMs: 0,
        endMs: 120000,
        tweetCount: 10,
        timeIntervalMs: 60000,
      },
    ].forEach(
      ({ testId, expected, startMs, endMs, tweetCount, timeIntervalMs }) => {
        it(`returns correct avg for test case: ${testId}`, () => {
          // act / assert
          expect(
            sut.getAvgTweets(startMs, endMs, tweetCount, timeIntervalMs)
          ).toBe(expected);
        });
      }
    );
  });

  describe('get_top_countries', () => {
    it('fails if invalid n', () => {
      // act / assert
      expect(() => sut.getTopCountries({}, -1)).toThrow();
    });

    it('returns all countries if count less than n', () => {
      // arrange
      const tpc = { US: 1, JP: 2 };
      const n = 5;

      // act
      const result = sut.getTopCountries(tpc, n);

      // assert
      expect(result.length).toBe(2);
    });

    it('returns only n countries', () => {
      // arrange
      const tpc = { US: 1, JP: 2, CU: 0 };
      const n = 2;

      // act
      const result = sut.getTopCountries(tpc, n);

      // assert
      expect(result.length).toBe(2);
    });

    it('sorts countries in dec order of tweets', () => {
      // arrange
      const tpc = { US: 1, JP: 2 };
      const n = 2;

      // act
      const result = sut.getTopCountries(tpc, n);

      // assert
      expect(result[0].value).toBe(2);
      expect(result[1].value).toBe(1);
    });

    it('transforms country names correctly', () => {
      // arrange
      const tpc = { US: 1, JP: 2 };
      const n = 2;

      // act
      const result = sut.getTopCountries(tpc, n);

      // assert
      expect(result).toContain({ name: 'Japan', value: 2 });
      expect(result).toContain({ name: 'United States', value: 1 });
    });
  });
});

class TweetBuilder {
  private htags: string[] = [];
  private createdAt: string;
  private timestamp: number;
  private place: ITweetPlace;

  withCreatedAt(createdAt: string): TweetBuilder {
    this.createdAt = createdAt;
    return this;
  }

  withTimestamp(timestamp: number): TweetBuilder {
    this.timestamp = timestamp;
    return this;
  }

  withPlace(place: ITweetPlace): TweetBuilder {
    this.place = place;
    return this;
  }

  withHashtags(...htags: string[]): TweetBuilder {
    this.htags = [...this.htags, ...htags];
    return this;
  }

  build(): ITweet {
    return {
      createdAt: this.createdAt,
      timestampMs: this.timestamp,
      place: this.place,
      entities: {
        hashtags: this.htags.map((htag) => ({ text: htag })),
      },
    };
  }
}
