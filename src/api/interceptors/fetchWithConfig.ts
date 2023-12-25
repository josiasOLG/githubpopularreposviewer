import API_BASE_URL from "../config/ApiConfig";

/**
 * @function fetchWithConfig
 * @description
 * Função para realizar uma requisição HTTP com base na URL fornecida e opções adicionais.
 * Retorna os dados da resposta ou lança um erro em caso de falha na requisição.
 *
 * @param {string} url - URL da requisição.
 * @param {object} options - Opções adicionais para a requisição (por padrão, vazio).
 * @returns {Promise<any>} Retorna os dados da resposta ou lança um erro em caso de falha na requisição.
 *
 * @example
 * const data = await fetchWithConfig('https://api.example.com/items', { method: 'GET' });
 */
const fetchWithConfig = async (url: string, options = {}): Promise<any> => {
  const response = await fetch(API_BASE_URL + url, {
    ...options,
    headers: {},
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json(); // Ou response.text() dependendo do tipo de resposta esperada
};

export default fetchWithConfig;
