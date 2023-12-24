export class UserDTO {
  constructor(
    public username: string,
    public avatarUrl: string,
    public followers: number,
    public following: number,
    public bio: string
  ) {}
}
