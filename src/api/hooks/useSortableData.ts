/**
 * @file useSortableData.ts
 * @description
 * Este arquivo contém o hook `useSortableData`, que é utilizado para criar uma lista ordenável de itens.
 * O hook oferece funcionalidades para ordenar uma lista de itens com base em critérios definidos.
 *
 * @requires useState, useMemo - Hooks do React para estado e memoização.
 * @requires SortCriteria - Enum que define os critérios de ordenação.
 */
import { useState, useMemo } from "react";
import { SortCriteria } from "../../enums/SortCriteria.enum";

/**
 * @function useSortableData
 * @description
 * Hook para ordenar uma lista de itens. Permite ordenar por nome ou contagem de estrelas, tanto em ordem crescente quanto decrescente.
 *
 * @template T - Tipo genérico que estende um objeto com 'name' e 'stargazers_count'.
 * @param {T[]} items - Array de itens a serem ordenados.
 * @returns Um objeto contendo `sortedItems`, a lista ordenada, e `setSortConfig`, uma função para mudar o critério de ordenação.
 *
 * @example
 * const Component = () => {
 *   const { sortedItems, setSortConfig } = useSortableData<RepoType>(repos);
 *   // Utilização de sortedItems e setSortConfig
 * }
 *
 * @note
 * `T` deve ser um tipo que inclua as propriedades 'name' (string) e 'stargazers_count' (number).
 */
const useSortableData = <T extends { name: string; stargazers_count: number }>(
  items: T[]
) => {
  const [sortConfig, setSortConfig] = useState<SortCriteria>(
    SortCriteria.NameAscending
  );

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    switch (sortConfig) {
      case SortCriteria.StarsAscending:
        sortableItems.sort((a, b) => a.stargazers_count - b.stargazers_count);
        break;
      case SortCriteria.StarsDescending:
        sortableItems.sort((a, b) => b.stargazers_count - a.stargazers_count);
        break;
      case SortCriteria.NameAscending:
        sortableItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortCriteria.NameDescending:
        sortableItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return sortableItems;
  }, [items, sortConfig]);

  return { sortedItems, setSortConfig };
};

export default useSortableData;
