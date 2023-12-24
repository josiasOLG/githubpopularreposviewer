import React from "react";
import { IAvatarProps } from "../../interfaces/atom/IAvatarProps";

const Avatar: React.FC<IAvatarProps> = ({
  imageUrl,
  altText,
  className = "",
}) => {
  return (
    <img src={imageUrl} alt={altText} className={`rounded-full ${className}`} />
  );
};

export default Avatar;
