import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

@Component({
  selector: 'app-hashtag-filter',
  templateUrl: './hashtag-filter.component.html',
  styleUrls: ['./hashtag-filter.component.scss'],
})
export class HashtagFilterComponent {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  hashtags$: Observable<string[]>;

  constructor(private store: Store<fromStore.IState>) {
    this.hashtags$ = store.pipe(select(fromStore.SelectHashtags));
  }

  add(event: MatChipInputEvent): void {
    let value = event.value;

    // TODO(jose): validate hashtag
    value = value.replace('#', '');

    // Add our hashtag
    if ((value || '').trim()) {
      this.store.dispatch(fromStore.AddHashtag({ hashtag: value.trim() }));
    }

    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  remove(hashtag: string): void {
    this.store.dispatch(fromStore.RemoveHashtag({ hashtag }));
  }
}
