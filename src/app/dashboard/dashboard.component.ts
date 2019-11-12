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
  columnDefs = [
    {field: 'time' },
    {field: 'home team' },
    {field: 'home score' },
    {field: 'away team' },
    {field: 'away score' },
  ];
  rowData = [];

  constructor(private nflFeedService: NFLFeedService) {}

  ngOnInit() {
    this.nflFeedService.getGameScores(1)
      .subscribe(
        (data: GameScores) => this.processGameScores(data), // success path
        error => this.error = error // error path
      );
  }

  processGameScores(data) {
    this.gameScores = { ...data }
    Object.values(this.gameScores.gameScores).forEach(function(game) {
      this.rowData.push({
        'time': new Date(game.gameSchedule.isoTime),
        'home team': game.gameSchedule.homeDisplayName,
        'home score': game.score.homeTeamScore.pointTotal,
        'away team': game.gameSchedule.visitorDisplayName,
        'away score': game.score.visitorTeamScore.pointTotal
      });
    }, this)
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error );
  }
}