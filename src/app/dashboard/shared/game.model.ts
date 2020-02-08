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

  get favScore(): number {
    if(!this.complete)
      return void 0

    if(this.home.id === this.fav.id)
      return this.homeScore
    else
      return this.awayScore
  }

  get undScore(): number {
    if(!this.complete)
      return void 0

    if(this.home.id === this.fav.id)
      return this.awayScore
    else
      return this.homeScore
  }

  get totalScore(): number {
    if(!this.complete)
      return void 0

    return this.homeScore + this.awayScore
  }

  get und(): Team {
    if(this.fav.id === this.home.id)
      return this.away
    return this.home
  }

  tableData(field) {
    switch(field) {
      case 'time':
        return this.gt.toLocaleString("en-US",
          {
            weekday:"short",
            month:"numeric",
            day:"numeric",
            hour:"numeric",
            minute:"numeric",
          }
        )
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
        classes += " " + this.decideColorTeam(this.home)
        break
      
      case 'awayTeam':
      case 'awayScore':
        classes += " " + this.decideColorTeam(this.away)
        break

      // case 'ou':
      //   return this.decideColorOU()
    }

    return classes;
  }

  decideColorTeam(team) {
    if(!this.complete)
      return void 0

    let result = this.result(team)

    if(result === true)
      return 'highlightgreen'
    if(result === false)
      return 'highlightred'

    return void 0
  }

  result(team) {
    if(!this.complete)
      return void 0

    if(team.isOU()) {
      if(team.isUnd()) {
        if(this.totalScore < this.ou) return true
        if(this.totalScore > this.ou) return false
      } else {  
        if(this.totalScore < this.ou) return false
        if(this.totalScore > this.ou) return true
      }
    } else {
      let favScoreAdjusted = this.favScore + this.spread
      if(this.fav.id === team.id) {
        if(favScoreAdjusted > this.undScore) return true
        if(favScoreAdjusted < this.undScore) return false
      } else {
        if(favScoreAdjusted > this.undScore) return false
        if(favScoreAdjusted < this.undScore) return true
      }
    }
    return void 0
  }

  resultStr(team) {
    if(!this.complete)
      return ""

    if(team.isOU()) {
      if(this.totalScore < this.ou) return "UND +" + this.totalScore
      if(this.totalScore > this.ou) return "OVR +" + this.totalScore
      return "PUSH +" + this.totalScore
    }

    let teamName, score
    if(this.fav.id === team.id) {
      teamName = this.fav.abbr
      score = -(this.favScore - this.undScore)
    } else {
      teamName = this.und.abbr
      score = -(this.undScore - this.favScore)
    }
    if(score > 0)
      return teamName + " +" + score
    return teamName + " " + score
  }
}