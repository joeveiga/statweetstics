import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
// Ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { PubNubAngular } from 'pubnub-angular2';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { environment } from '../environments/environment';
import * as fromStore from './store';
import { AppComponent } from './app.component';
import { HashtagFilterComponent } from './components/hashtag-filter/hashtag-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    HashtagFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    // Material
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,

    StoreModule.forRoot({
      app: fromStore.appReducer
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([fromStore.AppEffects]),

    NgxChartsModule
  ],
  providers: [
    PubNubAngular
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
