import React from "react";
import Sidebar from "../../components/organisms/Sidebar";
import Footer from "../../components/organisms/Footer";
import TopBar from "../../components/organisms/TopBar";
import { ILayoutProps } from "../../interfaces/templates/ILayoutProps";

/**
 * Layout Component
 *
 * Este componente é usado para estruturar o layout principal da aplicação.
 *
 * Props:
 * - children: ReactNode - Os elementos filhos que serão renderizados dentro do layout.
 *
 * Utiliza os seguintes componentes:
 * - Sidebar: Painel lateral para navegação.
 * - TopBar: Barra superior para funcionalidades adicionais.
 * - Footer: Rodapé da página.
 *
 * Exemplo de uso:
 * <Layout>
 *   <YourComponent />
 * </Layout>
 */
const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main className="p-3 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
