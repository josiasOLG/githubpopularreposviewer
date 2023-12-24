export class RepoDTO {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public stars: number,
    public language: string
  ) {}
}
