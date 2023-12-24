/**
 * @function handleResponse
 * @description
 * Função para processar a resposta de requisições HTTP. Retorna os dados da resposta
 * se o status da resposta for entre 200 e 299. Caso contrário, lança um erro.
 *
 * @param {any} response - O objeto de resposta da requisição HTTP.
 * @returns Retorna os dados contidos na resposta HTTP se a resposta for bem-sucedida.
 *
 * @example
 * const response = await axios.get(url);
 * handleResponse(response);
 */

export const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
};
