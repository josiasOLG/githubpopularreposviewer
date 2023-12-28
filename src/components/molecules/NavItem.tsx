import React from "react";
import NavLinkAtom from "../atoms/NavLink";
import { INavItemMoleculeProps } from "../../interfaces/molecules/INavItemMoleculeProps";
import { motion } from "framer-motion";
import Icon from "../atoms/Icon";
import "../../style/molecules/NavItem.scss";
import Label from "../atoms/Label";
import { useLocation } from "react-router-dom";

const NavItemMolecule: React.FC<
  INavItemMoleculeProps & { isOpen: boolean }
> = ({ to, label, name, isOpen }) => {
  const location = useLocation();

  const isActive = location.pathname === to; // Verifique se o item está ativo

  return (
    <li
      className={`GT-li ${isActive ? "active" : ""} ${
        isOpen ? "flex items-center" : "flex justify-center items-center h-full"
      }`}
    >
      <motion.span
        animate={isOpen ? { scale: 1, x: 0 } : { scale: 1.2, x: 0 }}
        className="icon"
      >
        <Icon type="fontAwesome" name={name}></Icon>
        {!isOpen && <Label className="GT-label" text={label} />}
      </motion.span>
      {isOpen && (
        <NavLinkAtom to={to} className="ml-2">
          {label}
        </NavLinkAtom>
      )}
    </li>
  );
};

export default NavItemMolecule;
