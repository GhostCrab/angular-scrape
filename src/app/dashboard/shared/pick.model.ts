export class Pick {
  static fromDb(data) {
    return new this(
      User.fromDb(data.user),
      User.fromDb(data.team),
      User.fromDb(data.game)
    );
  }

  constructor(
    public user: User,
    public team: Team,
    public game: Game) { }
}