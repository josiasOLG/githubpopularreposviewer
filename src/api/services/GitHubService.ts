import fetchWithConfig from "../interceptors/fetchWithConfig";

/**
 * Classe de serviço para interagir com a API do GitHub.
 * Oferece métodos para recuperar detalhes do usuário, repositórios e detalhes do repositório.
 */
export class GitHubService {
  /**
   * Recupera detalhes de um usuário do GitHub.
   * @param {string} username - Nome de usuário do GitHub.
   * @returns {Promise<any>} Uma promessa contendo os detalhes do usuário do GitHub.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  static async getUserDetails(username: string): Promise<any> {
    try {
      const response = await fetchWithConfig(`/users/${username}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recupera os repositórios de um usuário do GitHub.
   * @param {string} username - Nome de usuário do GitHub.
   * @returns {Promise<any[]>} Uma promessa contendo um array dos repositórios do usuário.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  static async getUserRepos(username: string): Promise<any[]> {
    try {
      const response = await fetchWithConfig(`/users/${username}/repos`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recupera detalhes de um repositório específico do GitHub.
   * @param {string} name - Nome do proprietário do repositório.
   * @param {string} fullName - Nome completo do repositório.
   * @returns {Promise<any>} Uma promessa contendo os detalhes do repositório.
   * @throws {Error} Lança um erro se a requisição falhar.
   */
  static async getRepoDetails(name: string, fullName: string): Promise<any> {
    try {
      const response = await fetchWithConfig(`/repos/${name}/${fullName}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
