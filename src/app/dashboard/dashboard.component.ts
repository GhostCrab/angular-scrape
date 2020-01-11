import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GameScores, NFLFeedService } from '../nfl-feed.service';
import { Game } from './shared/game.model'

interface Week {
  id: number;
  display: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit{
  error: any = null
  gameRows: Game[] = []
  gameCols = Game.TableCols
  db: string = null

  weeks: Week[] = []
  week: Week = null

  constructor(private nflFeedService: NFLFeedService) {}

  ngOnInit() {
    this.nflFeedService.getDb()
      .subscribe(
        (data) => this.processDb(data), // success path
        error => this.error = error // error path
      )
  }

  onChange() {
    this.gameRows = []
    Object.values(this.db.games).forEach(function(game) {
      if(game.week === this.week.id) {
        this.gameRows.push(Game.fromDb(game))
      }
    }, this)
  }

  handleFirstClick(event: MouseEvent) {
    if(this.week.id === this.weeks[0].id)
      return
    this.week = this.weeks[0]
    this.onChange()
  }

  handlePrevClick(event: MouseEvent) {
    let weekIndex = this.weeks.findIndex(w => w.id === this.week.id)
    if(weekIndex <= 0)
      return
    this.week = this.weeks[weekIndex - 1]
    this.onChange()
  }

  handleNextClick(event: MouseEvent) {
    let weekIndex = this.weeks.findIndex(w => w.id === this.week.id)
    if(weekIndex === -1 || weekIndex >= this.weeks.length -1)
      return
    this.week = this.weeks[weekIndex + 1]
    this.onChange()
  }

  handleLastClick(event: MouseEvent) {
    if(this.week.id === this.weeks[this.weeks.length - 1].id)
      return
    
    this.week = this.weeks[this.weeks.length - 1]
    this.onChange()
  }

  processDb(data) {
    this.weeks = []
    this.db = data
    Object.values(data.games).forEach(function(game) {
      if(!this.weeks.some(e => e.id == game.week)) {
        this.weeks.push({id: game.week, display: game.week.toString()})
      }
    }, this)

    this.week = this.weeks[0]
    
    this.onChange()
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1.sortData(event.field);
      let value2 = data2.sortData(event.field);
      
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error )
  }
}
