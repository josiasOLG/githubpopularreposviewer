import fetchWithConfig from "../interceptors/fetchWithConfig";

/**
 * @function get
 * @description
 * Função para realizar uma requisição HTTP GET. Retorna os dados da resposta
 * ou um erro caso ocorra.
 *
 * @param {string} url - URL da requisição.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await get('https://api.example.com/items');
 */
export const get = async (url: string): Promise<Response> => {
  try {
    const response = await fetchWithConfig(url);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * @function getById
 * @description
 * Função para realizar uma requisição HTTP GET por ID. Retorna os dados da resposta
 * ou um erro caso ocorra.
 *
 * @param {string} url - URL base da requisição.
 * @param {string} id - ID do recurso a ser obtido.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await getById('https://api.example.com/items', '123');
 */
export const getById = async (url: string, id: string): Promise<Response> => {
  try {
    const response = await fetchWithConfig(`${url}/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * @function post
 * @description
 * Função para realizar uma requisição HTTP POST. Envia dados para serem criados no servidor.
 * Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @param {string} url - URL da requisição.
 * @param {any} data - Dados a serem enviados na requisição.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await post('https://api.example.com/items', { nome: 'Item Novo', valor: 100 });
 */
export const post = async (url: string, data: any): Promise<Response> => {
  try {
    const response = await fetchWithConfig(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * @function put
 * @description
 * Função para realizar uma requisição HTTP PUT. Atualiza um recurso existente no servidor.
 * Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser atualizado.
 * @param {any} data - Dados atualizados para o recurso.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await put('https://api.example.com/items', '123', { nome: 'Item Atualizado', valor: 150 });
 */
export const put = async (
  url: string,
  id: string,
  data: any
): Promise<Response> => {
  try {
    const response = await fetchWithConfig(`${url}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * @function remove
 * @description
 * Função para realizar uma requisição HTTP DELETE. Remove um recurso do servidor.
 * Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser removido.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await remove('https://api.example.com/items', '123');
 */
export const remove = async (url: string, id: string): Promise<Response> => {
  try {
    const response = await fetchWithConfig(`${url}/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * @function patch
 * @description
 * Função para realizar uma requisição HTTP PATCH. Atualiza parcialmente um recurso no servidor.
 * Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser parcialmente atualizado.
 * @param {any} data - Dados a serem atualizados parcialmente no recurso.
 * @returns {Promise<Response>} Retorna a resposta da requisição ou um erro caso ocorra.
 *
 * @example
 * const response = await patch('https://api.example.com/items', '123', { valor: 200 });
 */
export const patch = async (
  url: string,
  id: string,
  data: any
): Promise<Response> => {
  try {
    const response = await fetchWithConfig(`${url}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
};
