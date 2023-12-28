export class Repository {
  constructor(
    public id?: number,
    public name?: string,
    public owner?: any,
    public description?: string,
    public stargazers_count?: number,
    public language?: string,
    public isPrivate?: boolean,
    public onSelect?: (repo: Repository) => void
  ) {}
}
