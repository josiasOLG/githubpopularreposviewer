import React from "react";

const TopBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="logo">LOGO</div>
      <div className="user-dropdown">
        <button className="flex items-center">
          Settings
          <span className="ml-2">&#9660;</span>{" "}
          {/* Símbolo de seta para baixo */}
        </button>
        {/* Aqui você pode adicionar o conteúdo do dropdown */}
      </div>
    </div>
  );
};

export default TopBar;
