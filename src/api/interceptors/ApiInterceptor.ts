/**
 * @file ApiInterceptor.ts
 * @description
 * Este arquivo configura uma instância do Axios para ser usada em toda a aplicação.
 * Define a URL base para as requisições e configura interceptores para as requisições e respostas.
 *
 * @requires axios - Biblioteca Axios para requisições HTTP.
 * @requires ApiConfig - Configuração da API, incluindo a URL base.
 */
import axios from "axios";
import API_BASE_URL from "../../api/config/ApiConfig";

/**
 * @constant instance
 * @description
 * Cria uma instância do Axios com a URL base configurada.
 * A URL base é importada de `API_BASE_URL` do arquivo `ApiConfig`.
 *
 * @type {AxiosInstance}
 */
const instance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Interceptor de Requisição
 * @description
 * Intercepta todas as requisições enviadas pela instância do Axios.
 * Pode ser utilizado para modificar a configuração das requisições antes de enviá-las.
 *
 * @param {AxiosRequestConfig} config - Configuração da requisição.
 * @returns {AxiosRequestConfig} - Retorna a configuração da requisição possivelmente modificada.
 */
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta
 * @description
 * Intercepta todas as respostas recebidas pela instância do Axios.
 * Pode ser utilizado para modificar a resposta ou tratar erros antes de passá-la adiante.
 *
 * @param {AxiosResponse} response - Resposta recebida.
 * @returns {AxiosResponse} - Retorna a resposta possivelmente modificada.
 */
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
