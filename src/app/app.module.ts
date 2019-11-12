import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NFLFeedService } from './nfl-feed.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: DashboardComponent },
    ])
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
  ],
  bootstrap: [AppComponent],
  providers: [NFLFeedService]
})
export class AppModule { }