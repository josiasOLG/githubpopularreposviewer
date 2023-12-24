import React from "react";
import UserProfile from "../../components/organisms/UserProfile";
import { IUserProfileProps } from "../../interfaces/user/IUserProfileProps";

/**
 * UserPageTemplate Component
 *
 * Este componente é usado para renderizar a página de perfil de um usuário.
 *
 * Props:
 * - user: User - Informações do usuário.
 * - repos: Repository[] - Lista de repositórios do usuário.
 * - handleSortChange: Function - Função para manipular a ordenação dos repositórios.
 * - sortOptions: SortOption[] - Opções de ordenação para os repositórios.
 *
 * Utiliza o componente UserProfile para renderizar os detalhes do usuário.
 *
 * Exemplo de uso:
 * <UserPageTemplate user={user} repos={repos} handleSortChange={handleSortChange} sortOptions={sortOptions} />
 */
const UserPageTemplate: React.FC<IUserProfileProps> = ({
  user,
  repos,
  handleSortChange,
  sortOptions,
}) => {
  return (
    <div className="container mt-4 p-0">
      <UserProfile
        user={user}
        repos={repos}
        handleSortChange={handleSortChange}
        sortOptions={sortOptions}
      />
    </div>
  );
};

export default UserPageTemplate;
