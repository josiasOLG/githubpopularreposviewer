import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg p-4">
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink to="/" className="block p-2 rounded hover:bg-gray-700">
              Home
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
