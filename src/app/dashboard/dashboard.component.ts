import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { GameScores, NFLFeedService } from '../nfl-feed.service';
import { Game } from './shared/game.model'
import { Pick } from './shared/pick.model'

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
  pickRows: Pick[] = []
  pickCols = Pick.TableCols
  pickGroupMetadata: any;
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

    Object.values(this.db.picks).forEach(function(pick) {
      if(pick.game.week === this.week.id) {
        this.pickRows.push(Pick.fromDb(pick))
      }
    }, this)
    this.pickRows.forEach(function (value) {
      console.log(value.metaData())
    })
    this.updatePickGroupMetaData()
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

  updatePickGroupMetaData() {
    this.pickGroupMetadata = {};
    if (this.pickRows) {
      let previousRowData = null;
      this.pickRows.forEach(function(rowData, idx) {
        let user = rowData.metaData();
        if (previousRowData === null) {
          this.pickGroupMetadata[user] = {index: 0, size: 1, win: 0, loss: 0, total: 0, style: void 0};
        }
        else {
          if (user === previousRowData.metaData())
            this.pickGroupMetadata[user].size++;
          else
            this.pickGroupMetadata[user] = {index: idx, size: 1, win: 0, loss: 0, total: 0, style: void 0};
        }
        if (rowData.game.complete) {
          this.pickGroupMetadata[user].total++
          if (rowData.result() === true) {
            this.pickGroupMetadata[user].win++
          } else if (rowData.result() === false) {
            this.pickGroupMetadata[user].loss++
          }
        }
        previousRowData = rowData
      }, this)

      this.pickGroupMetadata.forEach(function(pickGroup) {
        if (pickGroup.size === pickGroup.total) {
          if (pickGroup.loss === 0)
            pickGroup.style = 'highlightgreen'
          else
            pickGroup.style = 'highlightred'
        }
      })
    }
  }

  makeError() {
    this.nflFeedService.makeIntentionalError().subscribe(null, error => this.error = error )
  }
}
