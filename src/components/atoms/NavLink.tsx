import React from "react";
import { NavLink } from "react-router-dom";
import { INavLinkAtomProps } from "../../interfaces/atom/INavLinkAtomProps";

const NavLinkAtom: React.FC<INavLinkAtomProps> = ({ to, children }) => (
  <NavLink to={to} className="block p-2 rounded hover:bg-gray-700">
    {children}
  </NavLink>
);

export default NavLinkAtom;
