export class Pick {
  static fromDb(data) {
    if(!data)
      return null;
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