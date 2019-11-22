import { Team } from './team.model'

export class Game {
  static fromDb(data) {
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

  constructor(
    public gameId: string,
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
      case 'time': return this.gt.toLocaleString();
      case 'homeTeam': return this.home.abbr;
      case 'awayTeam': return this.away.abbr;
    }
    return this[field];
  }
}