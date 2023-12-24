import React from "react";
import Label from "../atoms/Label";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-center text-sm p-3 bottom-0 w-full flex justify-between items-center">
      <Label text="GItHUB - Trabalhando para trazer as melhores soluções em tecnologia." />
      <Label text="© Todos os direitos reservados." />
    </footer>
  );
};

export default Footer;
