export class Team {
  static fromDb(data) {
    return new this(
      data.id,
      data.name,
      data.city,
      data.abbr,
      data.active
    );
  }

  constructor(
    public team_id: number,
    public name: string,
    public city: string,
    public abbr: string,
    public active: boolean) { }
}
