import React from "react";
import NavItemMolecule from "../molecules/NavItem";

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div
      className={`w-64 md:w-16 lg:w-64 bg-gray-800 text-white shadow-lg p-4 ${
        isOpen ? "hidden md:block" : ""
      }`}
    >
      <nav>
        <ul>
          <NavItemMolecule to="/" label="Home" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
