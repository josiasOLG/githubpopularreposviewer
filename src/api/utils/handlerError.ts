/**
 * @function handleError
 * @description
 * Função para manipular erros de requisições HTTP. Registra o erro no console e retorna
 * uma mensagem adequada dependendo do tipo de erro ocorrido.
 *
 * @param {any} error - O objeto de erro retornado pela requisição HTTP.
 * @returns Retorna um objeto com a mensagem de erro ou a resposta de erro HTTP.
 *
 * @example
 * try {
 *   // requisição HTTP
 * } catch (error) {
 *   handleError(error);
 * }
 */
export const handleError = (error: any) => {
  if (error.response) {
    console.error("Problem with response", error.response.status);
    return error.response.data;
  } else if (error.request) {
    console.error("Problem with request");
  } else {
    console.error("Error", error.message);
  }
  return { message: "An error occurred" };
};
