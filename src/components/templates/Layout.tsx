import React, { useState } from "react";
import Sidebar from "../../components/organisms/Sidebar";
import Footer from "../../components/organisms/Footer";
import TopBar from "../../components/organisms/TopBar";
import { ILayoutProps } from "../../interfaces/templates/ILayoutProps";

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <TopBar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      <div className="flex min-h-screen">
        <Sidebar isOpen={isOpen} />
        <div className="flex flex-col flex-1">
          <main className="p-3 flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
