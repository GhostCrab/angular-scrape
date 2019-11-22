export class User {
  static fromDb(data) {
    return new this(
      data.id,
      data.email,
      data.name
    );
  }

  constructor(
    public user_id: number,
    public email: string,
    public name: string) { }
}