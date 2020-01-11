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

  static TableCols = [
      { field: 'week', header: 'Week', sortable: false },
      { field: 'user', header: 'User', sortable: true },      
      { field: 'pick', header: 'Pick', sortable: true },
      { field: 'result', header: 'Result', sortable: true },
    ]

  constructor(
    public user: User,
    public team: Team,
    public game: Game) { }

  tableData(field) {
    switch(field) {
      case 'week': return this.game.week
      case 'user': return this.user.name
      case 'pick':
        if(!this.game.fav)
          return null
        let spread = 0
        if(this.game.fav.id === this.team.id)
          spread = this.game.spread
        else
          spread = -(this.game.spread)
        return this.team.abbr + " " + spread.toString()
    }
    return this[field];
  }
}