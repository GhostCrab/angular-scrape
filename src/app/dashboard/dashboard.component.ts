import { Component, OnInit } from '@angular/core';
import { GameScores, NFLFeedService } from '../nfl-feed.service';
import { TableModule } from 'primeng/table';

import { Game } from './shared/game.model'

export interface GameRow {
    week;
    time;
    homeTeam;
    homeScore;
    awayTeam;
    awayScore;
    ou;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  error: any;
  gameRows: Game[];
  gameCols: any[];

  constructor(private nflFeedService: NFLFeedService) {}

  ngOnInit() {
    this.gameRows = [];

    this.gameCols = [
      { field: 'week', header: 'Week' },
      { field: 'time', header: 'Time' },      
      { field: 'homeTeam', header: 'Home Team' },
      { field: 'homeScore', header: 'Home Score' },
      { field: 'awayTeam', header: 'Away Team' },
      { field: 'awayScore', header: 'Away Score' },
      { field: 'spread', header: 'Spread' },
      { field: 'ou', header: "Over/Under"}
    ]
    
    this.nflFeedService.getDb()
      .subscribe(
        (data) => this.processDb(data), // success path
        error => this.error = error // error path
      );
  }

  processDb(data) {
    Object.values(data.games).forEach(function(game) {
      if(game.week === 10) {
        this.gameRows.push(Game.fromDb(game));
      }
    }, this)
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}