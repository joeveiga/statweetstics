import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-hashtag-filter',
  templateUrl: './hashtag-filter.component.html',
  styleUrls: ['./hashtag-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashtagFilterComponent {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input()
  hashtags: string[];

  @Output()
  hashtagAdded: EventEmitter<string> = new EventEmitter();

  @Output()
  hashtagRemoved: EventEmitter<string> = new EventEmitter();

  add(event: MatChipInputEvent): void {
    let value = event.value;

    // TODO(jose): validate hashtag
    value = value.replace('#', '');

    // Add our hashtag
    if ((value || '').trim()) {
      this.hashtagAdded.emit(value.trim());
    }

    // Reset the input value
    if (event.input) {
      event.input.value = '';
    }
  }

  remove(hashtag: string): void {
    this.hashtagRemoved.emit(hashtag);
  }
}
