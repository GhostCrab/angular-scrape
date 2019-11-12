import { Component, OnInit } from '@angular/core';
import { GameScores, NFLFeedService } from '../nfl-feed.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  error: any;
  gameScores: GameScores;

  constructor(private nflFeedService: NFLFeedService) {}

  ngOnInit() {
    this.nflFeedService.getGameScores(1)
      .subscribe(
        (data: GameScores) => this.gameScores = { ...data }, // success path
        error => this.error = error // error path
      );
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}