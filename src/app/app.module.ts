import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';

import { NFLFeedService } from './nfl-feed.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    ToastModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
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