export class Team {
  static fromDb(data) {
    if(!data)
      return null;
    return new this(
      data.id,
      data.name,
      data.city,
      data.abbr,
      data.active
    );
  }

  constructor(
    public id: number,
    public name: string,
    public city: string,
    public abbr: string,
    public active: boolean) { }

  isUnd() {
    return this.abbr === 'UND'
  }

  isOvr() {
    return this.abbr === 'OVR'
  }

  isOU() {
    return this.isUnd() || this.isOvr()
  }
}
