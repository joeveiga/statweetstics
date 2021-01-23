export interface ITweet {
  created_at: string;
  timestamp_ms: number;
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
  country_code: string;
  country: string;
}
