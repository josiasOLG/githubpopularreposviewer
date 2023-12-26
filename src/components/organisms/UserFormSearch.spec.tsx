import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserFormSearch from "./UserFormSearch";

const mockSetUsername = jest.fn();
const mockHandleSearch = jest.fn();
const username = "testuser";

describe("UserFormSearch Component", () => {
  test("calls handleSearch on form submission", () => {
    render(
      <MemoryRouter>
        <UserFormSearch
          username={username}
          setUsername={mockSetUsername}
          handleSearch={mockHandleSearch}
        />
      </MemoryRouter>
    );
    fireEvent.submit(screen.getByTestId("user-form"));
    expect(mockHandleSearch).toHaveBeenCalled();
  });

  test("calls setUsername when input value changes", () => {
    render(
      <MemoryRouter>
        <UserFormSearch
          username={username}
          setUsername={mockSetUsername}
          handleSearch={mockHandleSearch}
        />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Enter GitHub username");
    fireEvent.change(input, { target: { value: "newuser" } });
    expect(mockSetUsername).toHaveBeenCalledWith("newuser");
  });
});
