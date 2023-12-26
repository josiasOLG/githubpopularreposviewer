import React from "react";
import { IRepoDetailsTemplateProps } from "../../interfaces/repository/IRepoDetailsTemplateProps";
import Text from "../atoms/Text";

/**
 * RepoDetailsTemplate Component
 *
 * Este componente é usado para exibir detalhes de um repositório específico.
 *
 * Props:
 * - repoDetails: IRepoDetailsTemplateProps - Objeto contendo informações do repositório.
 *
 * Exibe:
 * - Nome, descrição, número de estrelas, linguagem principal e link para o repositório no GitHub.
 *
 * Exemplo de uso:
 * <RepoDetailsTemplate repoDetails={repoDetails} />
 */

const RepoDetailsTemplate: React.FC<IRepoDetailsTemplateProps> = ({
  repoDetails,
}) => {
  return (
    <div className="container mt-4 p-0">
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6">
        <Text as="h2" className="text-2xl font-semibold mb-2">
          {repoDetails.name}
        </Text>
        <Text as="p" className="text-gray-700 mb-4">
          {repoDetails.description}
        </Text>
        <div className="flex justify-between items-center">
          <Text as="span" className="text-gray-600">
            {repoDetails.stars}
          </Text>
          <Text as="span" className="text-gray-600">
            {repoDetails.language}
          </Text>
          <a
            href={repoDetails.url}
            className="text-blue-500 hover:text-blue-600 dark:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoDetailsTemplate;
