import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar"; // Ajuste o caminho de importação conforme necessário

describe("Sidebar Component", () => {
  test("should render the sidebar when isOpen is true", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={true} />
      </MemoryRouter>
    );
    const sidebarElement = screen.getByText(/home/i);
    expect(sidebarElement).toBeInTheDocument();
  });

  test("should not render the sidebar when isOpen is false", () => {
    render(
      <MemoryRouter>
        <Sidebar isOpen={false} />
      </MemoryRouter>
    );
    const sidebarElement = screen.queryByTestId("sidebar");
    expect(sidebarElement).toHaveClass("hidden");
  });
});
