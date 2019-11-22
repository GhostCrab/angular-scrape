import { Component, OnInit } from '@angular/core';
import { GameScores, NFLFeedService } from '../nfl-feed.service';
import { TableModule } from 'primeng/table';

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
  gameRows: GameRow[];
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
      { field: 'ou', header: "Over/Under"}
    ]
    // this.nflFeedService.getGameScores(1)
    //   .subscribe(
    //     (data: GameScores) => this.processGameScores(data), // success path
    //     error => this.error = error // error path
    //   );
    
    this.nflFeedService.getDb()
      .subscribe(
        (data) => this.processDb(data), // success path
        error => this.error = error // error path
      );
  }

  processGameScores(data) {
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

  processGame(game) {
    let date = new Date(game.gt);
    return {
      'week': game.week,
      'time': date.toLocaleString(),
      'homeTeam': game.home.abbr,
      'homeScore': game.home_score,
      'awayTeam': game.away.abbr,
      'awayScore': game.away_score,
      'ou': game.ou
    };
  }

  processDb(data) {
    Object.values(data.games).forEach(function(game) {
      if(game.week === 12) {
        this.gameRows.push(this.processGame(game));
        console.log(game)
      }
    }, this)
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}