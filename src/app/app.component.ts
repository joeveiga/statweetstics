import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { sampleTime } from 'rxjs/operators';

import { environment } from '../environments/environment';
import * as fromStore from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  perMinute$: Observable<number>;
  perCountry$: Observable<{ name: string; value: number }[]>;
  hashtags$: Observable<string[]>;

  constructor(private store: Store<fromStore.IState>) {
    // subscribe to average
    this.perMinute$ = this.store.pipe(
      select(fromStore.SelectAvgTPM, { interval: 60000 }), // per minute (ms)
      sampleTime(environment.ui_sampling_interval_ms)
    );

    // subscribe to top countries
    this.perCountry$ = this.store.pipe(
      select(fromStore.SelectTopCountries, { count: 5 }),
      sampleTime(environment.ui_sampling_interval_ms)
    );

    this.hashtags$ = store.pipe(select(fromStore.SelectHashtags));
  }

  hashtagAdded(hashtag: string): void {
    this.store.dispatch(fromStore.AddHashtag({ hashtag }));
  }

  hashtagRemoved(hashtag: string): void {
    this.store.dispatch(fromStore.RemoveHashtag({ hashtag }));
  }
}
