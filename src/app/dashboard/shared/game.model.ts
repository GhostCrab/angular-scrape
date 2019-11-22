export class Game {
  static fromDb(data) {
    return new this(
      data.id,
      new Team(data.home),
      new Team(data.away),
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
    public game_id: string,
    public home: Team,
    public away: Team,
    public gt: Date,
    public week: number,
    public season: number,
    public fav: Team,
    public spread: number,
    public ou: number,
    public complete: boolean,
    public home_score: number,
    public away_score: number,
    public home_pr: string,
    public away_pr: string) { }
}