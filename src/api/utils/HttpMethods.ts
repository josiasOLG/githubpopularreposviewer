/**
 * @file HttpMethods.ts
 * @description
 * Este arquivo contém funções utilitárias para realizar requisições HTTP com tratamento de erros e respostas.
 * Inclui métodos para GET, POST, PUT, DELETE e PATCH.
 *
 * @requires axios - Biblioteca Axios para requisições HTTP.
 * @requires ApiInterceptor - Interceptor do Axios configurado para a aplicação.
 */

import axios from "../../api/interceptors/ApiInterceptor";
import { handleResponse } from "./handleResponse";
import { handleError } from "./handlerError";

/**
 * @function get
 * @description
 * Função para realizar uma requisição HTTP GET. Retorna os dados da resposta
 * ou um erro manipulado.
 *
 * @param {string} url - URL da requisição.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * get('https://api.exemplo.com/items');
 */
export const get = async (url: string) => {
  try {
    const response = await axios.get(url);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @function getById
 * @description
 * Função para realizar uma requisição HTTP GET por ID. Retorna os dados da resposta
 * ou um erro manipulado.
 *
 * @param {string} url - URL base da requisição.
 * @param {string} id - ID do recurso a ser obtido.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * getById('https://api.exemplo.com/items', '123');
 */
export const getById = async (url: string, id: string) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @function post
 * @description
 * Função para realizar uma requisição HTTP POST. Envia dados para serem criados no servidor.
 * Retorna a resposta da requisição ou um erro manipulado.
 *
 * @param {string} url - URL da requisição.
 * @param {any} data - Dados a serem enviados na requisição.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * post('https://api.exemplo.com/items', { nome: 'Item Novo', valor: 100 });
 */
export const post = async (url: string, data: any) => {
  try {
    const response = await axios.post(url, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @function put
 * @description
 * Função para realizar uma requisição HTTP PUT. Atualiza um recurso existente no servidor.
 * Retorna a resposta da requisição ou um erro manipulado.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser atualizado.
 * @param {any} data - Dados atualizados para o recurso.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * put('https://api.exemplo.com/items', '123', { nome: 'Item Atualizado', valor: 150 });
 */
export const put = async (url: string, id: string, data: any) => {
  try {
    const response = await axios.put(`${url}/${id}`, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @function remove
 * @description
 * Função para realizar uma requisição HTTP DELETE. Remove um recurso do servidor.
 * Retorna a resposta da requisição ou um erro manipulado.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser removido.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * remove('https://api.exemplo.com/items', '123');
 */

export const remove = async (url: string, id: string) => {
  try {
    const response = await axios.delete(`${url}/${id}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * @function patch
 * @description
 * Função para realizar uma requisição HTTP PATCH. Atualiza parcialmente um recurso no servidor.
 * Retorna a resposta da requisição ou um erro manipulado.
 *
 * @param {string} url - URL da requisição.
 * @param {string} id - ID do recurso a ser parcialmente atualizado.
 * @param {any} data - Dados a serem atualizados parcialmente no recurso.
 * @returns Retorna a resposta da requisição ou um erro manipulado.
 *
 * @example
 * patch('https://api.exemplo.com/items', '123', { valor: 200 });
 */
export const patch = async (url: string, id: string, data: any) => {
  try {
    const response = await axios.patch(`${url}/${id}`, data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
