import { User } from './user.model'
import { Team } from './team.model'
import { Game } from './game.model'

export class Pick {
  static fromDb(data) {
    if(!data)
      return null;
    return new this(
      User.fromDb(data.user),
      Team.fromDb(data.team),
      Game.fromDb(data.game)
    );
  }

  static TableCols = [
      //{ field: 'user', header: 'User', sortable: true },
      { field: 'pick', header: 'Pick' },
      { field: 'opp',  header: 'Opponent' },
      { field: 'result', header: 'Result' }
    ]

  constructor(
    public user: User,
    public team: Team,
    public game: Game) { }

  metaData() {
    return this.user.name
  }

  tableData(field) {
    switch(field) {
      case 'week':
        return this.game.week
      case 'user':
        return this.user.name
      case 'pick':
        if(this.team.isOU()) {
          return this.team.abbr + " +" + this.game.ou
        }
        if(!this.game.fav)
          return void 0
        let spread = this.game.spread
        if(this.game.fav.id !== this.team.id)
          spread = -spread
        if(spread > 0)
          return this.team.abbr + " +" + spread.toString()
        return this.team.abbr + " " + spread.toString()
        
      case 'opp':
        if(this.team.isOU()) {
          return this.game.home.abbr + " @ " + this.game.away.abbr
        }
        if(this.team.id === this.game.home.id)
          return "vs " + this.game.away.abbr
        return "@ " + this.game.home.abbr
      case 'result':
        return this.game.resultStr(this.team)
    }
    return this[field];
  }

  sortData(field) {
    switch(field) {
      case 'pick': return this.game.gt
    }
    return this.tableData[field];
  }

  tableFieldStyle(field) {
    let classes = 'gameCell'
    switch(field) {
      case 'result':
        classes += " " + this.game.decideColorTeam(this.team)
        break
    }

    return classes;
  }

  result() {
    return this.game.result(this.team)
  }
}