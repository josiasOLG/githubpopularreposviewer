import React, { useEffect, useState } from "react";
import "../../style/organisms/TopBar.scss";

const TopBar: React.FC<{ toggleSidebar: () => void; isOpen: boolean }> = ({
  toggleSidebar,
  isOpen,
}) => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") === "dark";
    setDarkTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme);
  }, []);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    localStorage.setItem("theme", !darkTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", !darkTheme);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 GT-topbar text-white p-4">
      <div className="flex items-center space-x-2">
        <button onClick={toggleSidebar} className="GT-btn text-2xl">
          {isOpen ? "\u2715" : "\u2630"}
        </button>
        <div className="logo text-xl md:text-2xl lg:text-3xl">LOGO</div>
      </div>
      {/* <div className="hidden md:block logo text-xl md:text-2xl lg:text-3xl">
        LOGO
      </div> */}
      <div className="user-dropdown text-sm md:text-base lg:text-lg relative">
        <button onClick={toggleDropdown} className="flex items-center">
          Settings
          <span className="ml-2">&#9660;</span>
        </button>
        <div
          className={`dropdown-content ${
            isDropdownOpen ? "block" : "hidden"
          } absolute right-0 mt-2 py-2 w-48 bg-black rounded-md shadow-xl z-20`}
        >
          <button
            onClick={toggleTheme}
            className="text-sm w-full text-left px-4 py-2 hover:bg-black-100"
          >
            {darkTheme ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
