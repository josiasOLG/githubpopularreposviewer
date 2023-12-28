import React from "react";
import { NavLink } from "react-router-dom";
import { INavLinkAtomProps } from "../../interfaces/atom/INavLinkAtomProps";

const NavLinkAtom: React.FC<INavLinkAtomProps> = ({
  to,
  children,
  className,
}) => (
  <NavLink
    to={to}
    className={`block p-2 rounded hover:bg-gray-700 ${className}`}
  >
    {children}
  </NavLink>
);

export default NavLinkAtom;
