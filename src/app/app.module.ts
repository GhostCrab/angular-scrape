import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { NFLFeedService } from './nfl-feed.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastModule,
    ButtonModule,
    TableModule,
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