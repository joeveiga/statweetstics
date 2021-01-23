export interface ITweet {
  createdAt: string;
  timestampMs: number;
  entities: ITweetEntities;
  place: ITweetPlace;
}

export interface ITweetEntities {
  hashtags: ITweetHashtag[];
}

export interface ITweetHashtag {
  text: string;
}

export interface ITweetPlace {
  countryCode: string;
  country: string;
}
