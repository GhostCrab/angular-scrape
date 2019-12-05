import { Team } from './team.model'

export class Game {
  static fromDb(data) {
    if(!data)
      return null;
    return new this(
      data.id,
      Team.fromDb(data.home),
      Team.fromDb(data.away),
      new Date(data.gt),
      data.week,
      data.season,
      Team.fromDb(data.fav),
      data.spread,
      data.ou,
      data.complete,
      data.home_score,
      data.away_score,
      data.home_pr,
      data.away_pr
    )
  }

  static TableCols = [
      { field: 'week', header: 'Week', sortable: false },
      { field: 'time', header: 'Time', sortable: true },      
      { field: 'homeTeam', header: 'Home Team', sortable: true },
      { field: 'homeScore', header: 'Home Score', sortable: true },
      { field: 'awayTeam', header: 'Away Team', sortable: true },
      { field: 'awayScore', header: 'Away Score', sortable: true },
      { field: 'spread', header: 'Spread', sortable: true },
      { field: 'ou', header: "Over/Under", sortable: true}
    ]

  static customSort(data1, data2, field) {
    let value1 = data1.tableData(field);
    let value2 = data1.tableData(field);
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
  }

  constructor(
    public id: string,
    public home: Team,
    public away: Team,
    public gt: Date,
    public week: number,
    public season: number,
    public fav: Team,
    public spread: number,
    public ou: number,
    public complete: boolean,
    public homeScore: number,
    public awayScore: number,
    public homePR: string,
    public awayPR: string) { }

  tableData(field) {
    switch(field) {
      case 'time': return this.gt.toLocaleString()
      case 'homeTeam': return this.home.abbr
      case 'awayTeam': return this.away.abbr
      case 'spread':
        if(!this.fav)
          return null
        if(this.spread == 0)
          return "PICK"
        return this.fav.abbr + " " + this.spread.toString()
      case 'ou':
        if(!this.ou)
          return null
        let oustr = "+" + this.ou
        if(this.complete)
          oustr += " (" + (this.homeScore + this.awayScore) + ")"
        return oustr
    }
    return this[field];
  }

  sortData(field) {
    switch(field) {
      case 'time': return this.gt
      case 'homeTeam': return this.home.abbr
      case 'awayTeam': return this.away.abbr
    }
    return this[field];
  }

  tableFieldStyle(field) {
    let classes = 'gameCell'
    switch(field) {
      case 'homeTeam':
      case 'homeScore':
        classes += " " + this.decideColorTeam(this.home, this.homeScore, this.away, this.awayScore)
        break
      
      case 'awayTeam':
      case 'awayScore':
        classes += " " + this.decideColorTeam(this.away, this.awayScore, this.home, this.homeScore)
        break

      // case 'ou':
      //   return this.decideColorOU()
    }

    return classes;
  }

  decideColorTeam(me, myScore, other, otherScore) {
    if(!this.complete)
      return void 0

    let spreadVal = this.spread
    if(me.id !== this.fav.id)
      spreadVal = Math.abs(spreadVal)

    if(myScore + spreadVal > otherScore)
      return 'highlightgreen'
    else if(myScore + spreadVal < otherScore)
      return 'highlightred'

    return void 0
  }

  decideColorOU() {
    if(!this.complete)
      return void 0

    if(this.homeScore + this.awayScore > this.ou)
      return 'highlightgreen'
    else if(this.homeScore + this.awayScore < this.ou)
      return 'highlightred'
    
    return void 0
  }
}