import React from "react";
import { Link } from "react-router-dom";
import { IBreadcrumbProps } from "../../interfaces/atom/IBreadcrumbProps";

const Breadcrumb: React.FC<IBreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="bg-white shadow p-2">
      <ol className="flex leading-none text-gray-800 divide-x divide-gray-400">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center ${
              index === 0 ? "pl-4 pr-2" : "px-2"
            }`}
          >
            <Link to={item.path} className="hover:text-blue-600">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
