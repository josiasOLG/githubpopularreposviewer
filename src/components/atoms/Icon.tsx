import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import MaterialIcon from "@mui/material/Icon";
import { IIconProps } from "../../interfaces/atom/IIconProps";

const Icon: React.FC<IIconProps> = ({ type, name, className }) => {
  switch (type) {
    case "fontAwesome":
      return <FontAwesomeIcon icon={name as IconProp} className={className} />;
    case "material":
      return typeof name === "string" ? (
        <MaterialIcon className={className}>{name}</MaterialIcon>
      ) : null;
    default:
      return null;
  }
};

export default Icon;
