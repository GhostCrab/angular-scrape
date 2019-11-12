import { Component, OnInit } from '@angular/core';
import { GameScores, NFLFeedService } from '../nfl-feed.service';
import { TableModule } from 'primeng/table';

export interface GameRow {
    time;
    homeTeam;
    homeScore;
    awayTeam;
    awayScore;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  error: any;
  gameRows: GameRow[];
  gameCols: any[];
  selectedGame: GameRow;

  constructor(private nflFeedService: NFLFeedService) {}

  ngOnInit() {
    this.nflFeedService.getGameScores(1)
      .subscribe(
        (data: GameScores) => this.processGameScores(data), // success path
        error => this.error = error // error path
      );

    this.gameCols = [
      { field: 'time', header: 'Time' },
      { field: 'homeTeam', header: 'Home Team' },
      { field: 'homeScore', header: 'Home Score' },
      { field: 'awayTeam', header: 'Away Team' },
      { field: 'awayScore', header: 'Away Score' },
    ]
  }

  processGameScores(data) {
    this.gameRows = [];
    Object.values(data.gameScores).forEach(function(game) {
      let date = new Date(game.gameSchedule.isoTime);
      this.gameRows.push({
        'time': date.toLocaleString(),
        'homeTeam': game.gameSchedule.homeDisplayName,
        'homeScore': (game.score !== null)?game.score.homeTeamScore.pointTotal:null,
        'awayTeam': game.gameSchedule.visitorDisplayName,
        'awayScore': (game.score !== null)?game.score.visitorTeamScore.pointTotal:null
      });
    }, this)
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}