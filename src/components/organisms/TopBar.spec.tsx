import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TopBar from "./TopBar";
import { MemoryRouter } from "react-router-dom";

describe("TopBar Component", () => {
  test("renders the toggle button correctly when sidebar is closed", () => {
    const mockToggle = jest.fn();
    render(
      <MemoryRouter>
        <TopBar toggleSidebar={mockToggle} isOpen={false} />
      </MemoryRouter>
    );
    const toggleButton = screen.getByText("≡");
    expect(toggleButton).toBeInTheDocument();
  });

  test("renders the toggle button correctly when sidebar is open", () => {
    const mockToggle = jest.fn();
    render(
      <MemoryRouter>
        <TopBar toggleSidebar={mockToggle} isOpen={true} />
      </MemoryRouter>
    );
    const toggleButton = screen.getByText("✕");
    expect(toggleButton).toBeInTheDocument();
  });

  test("calls toggleSidebar function when toggle button is clicked", () => {
    const mockToggle = jest.fn();
    render(
      <MemoryRouter>
        <TopBar toggleSidebar={mockToggle} isOpen={false} />
      </MemoryRouter>
    );
    const toggleButton = screen.getByText("≡");
    fireEvent.click(toggleButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
