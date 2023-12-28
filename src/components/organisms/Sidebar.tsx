import React from "react";
import { motion } from "framer-motion";
import NavItemMolecule from "../molecules/NavItem";
import { faHome, faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import "../../style/organisms/Sidebar.scss";

const sidebarVariants = {
  expanded: { width: "150px", transition: { type: "spring", stiffness: 30 } },
  collapsed: { width: "90px", transition: { type: "spring", stiffness: 30 } },
};

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <motion.div
      data-testid="sidebar"
      variants={sidebarVariants}
      animate={isOpen ? "expanded" : "collapsed"}
      className="GT-sidebar bg-gray-800 text-white shadow-lg dark:box-shadow-white-light"
    >
      <nav>
        <ul>
          <NavItemMolecule
            to="/"
            label="Dashboard"
            name={faTachometerAlt}
            isOpen={isOpen}
          />
          <NavItemMolecule
            to="/home"
            label="Home"
            name={faHome}
            isOpen={isOpen}
          />
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
