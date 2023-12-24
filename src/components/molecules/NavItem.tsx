import React from "react";
import NavLinkAtom from "../atoms/NavLink";
import { INavItemMoleculeProps } from "../../interfaces/molecules/INavItemMoleculeProps";

const NavItemMolecule: React.FC<INavItemMoleculeProps> = ({ to, label }) => (
  <li className="mb-2">
    <NavLinkAtom to={to}>{label}</NavLinkAtom>
  </li>
);

export default NavItemMolecule;
