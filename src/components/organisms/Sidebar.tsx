import React from "react";
import NavItemMolecule from "../molecules/NavItem";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg p-4">
      <nav>
        <ul>
          <NavItemMolecule to="/" label="Home" />
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
