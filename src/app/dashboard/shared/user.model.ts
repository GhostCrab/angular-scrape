export class User {
  static fromDb(data) {
    if(!data)
      return null;
    return new this(
      data.id,
      data.email,
      data.name
    );
  }

  constructor(
    public id: number,
    public email: string,
    public name: string) { }
}