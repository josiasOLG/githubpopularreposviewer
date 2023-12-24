import axios from "../../api/interceptors/ApiInterceptor";

/**
 * @class GitHubService
 * @description
 * Esta classe fornece métodos para interagir com a API do GitHub.
 * Permite recuperar detalhes do usuário, repositórios do usuário e detalhes do repositório.
 *
 * @requires axios - Utiliza axios para realizar as requisições HTTP.
 * @requires ApiInterceptor - Axios com interceptores configurados para a aplicação.
 */
export class GitHubService {
  /**
   * @method getUserDetails
   * @description
   * Recupera detalhes de um usuário do GitHub.
   *
   * @param {string} username - Nome de usuário do GitHub.
   * @returns Retorna um objeto contendo os detalhes do usuário do GitHub.
   * @throws Lança um erro se a requisição falhar.
   *
   * @example
   * try {
   *   const userDetails = await GitHubService.getUserDetails('nomeDeUsuario');
   *   // use userDetails
   * } catch (error) {
   *   // trate o erro
   * }
   */
  static async getUserDetails(username: string) {
    try {
      const response = await axios.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method getUserRepos
   * @description
   * Recupera os repositórios de um usuário do GitHub.
   *
   * @param {string} username - Nome de usuário do GitHub.
   * @returns Retorna um array de objetos, cada um representando um repositório do usuário.
   * @throws Lança um erro se a requisição falhar.
   *
   * @example
   * try {
   *   const repos = await GitHubService.getUserRepos('nomeDeUsuario');
   *   // use repos
   * } catch (error) {
   *   // trate o erro
   * }
   */
  static async getUserRepos(username: string) {
    try {
      const response = await axios.get(`/users/${username}/repos`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @method getRepoDetails
   * @description
   * Recupera detalhes de um repositório específico do GitHub.
   *
   * @param {string} name - Nome do proprietário do repositório.
   * @param {string} fullName - Nome completo do repositório.
   * @returns Retorna um objeto contendo detalhes do repositório especificado.
   * @throws Lança um erro se a requisição falhar.
   *
   * @example
   * try {
   *   const repoDetails = await GitHubService.getRepoDetails('nomeDoProprietario', 'nomeCompletoDoRepositorio');
   *   // use repoDetails
   * } catch (error) {
   *   // trate o erro
   * }
   */
  static async getRepoDetails(name: string, fullName: string) {
    try {
      const response = await axios.get(`/repos/${name}/${fullName}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
