import React from "react";
import { IStarIconProps } from "../../interfaces/atom/IStarIconProps";

const StarIcon: React.FC<IStarIconProps> = ({
  filled = false,
  className = "",
}) => {
  return (
    <svg
      className={`h-5 w-5 ${
        filled ? "text-yellow-500" : "text-gray-400"
      } ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.922 1.603-.922 1.902 0l1.888 5.812h6.11c.998 0 1.411 1.26.683 1.888l-4.923 3.58 1.888 5.812c.3.922-.756 1.684-1.566 1.162l-4.923-3.58-4.923 3.58c-.81.522-1.866-.24-1.566-1.162l1.888-5.812-4.923-3.58c-.728-.628-.315-1.888.683-1.888h6.11l1.888-5.812z" />
    </svg>
  );
};

export default StarIcon;
