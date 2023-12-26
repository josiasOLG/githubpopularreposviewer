import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer"; // Ajuste o caminho de importação conforme necessário

describe("Footer Component", () => {
  test("renders labels with correct texts", () => {
    render(<Footer />);

    const githubLabel = screen.getByText(
      /GItHUB - Trabalhando para trazer as melhores soluções em tecnologia./i
    );
    expect(githubLabel).toBeInTheDocument();

    const rightsLabel = screen.getByText(/© Todos os direitos reservados./i);
    expect(rightsLabel).toBeInTheDocument();
  });
});
