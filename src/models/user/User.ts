export class User {
  constructor(
    public username: string,
    public avatar_url: string,
    public followers: number,
    public following: number,
    public bio: string
  ) {}
}
