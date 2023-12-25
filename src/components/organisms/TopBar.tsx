import React from "react";

const TopBar: React.FC<{ toggleSidebar: () => void; isOpen: boolean }> = ({
  toggleSidebar,
  isOpen,
}) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex items-center space-x-2 md:hidden">
        {isOpen ? (
          <button onClick={toggleSidebar} className="text-2xl">
            &#x2715;
          </button>
        ) : (
          <button onClick={toggleSidebar} className="text-2xl">
            &#8801;
          </button>
        )}
        <div className="logo text-xl md:text-2xl lg:text-3xl">LOGO</div>
      </div>
      <div className="hidden md:block logo text-xl md:text-2xl lg:text-3xl">
        LOGO
      </div>
      <div className="user-dropdown text-sm md:text-base lg:text-lg">
        <button className="flex items-center">
          Settings
          <span className="ml-2">&#9660;</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
