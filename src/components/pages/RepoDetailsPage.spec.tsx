import React from "react";
import { render } from "@testing-library/react";
import RepoDetailsPage from "./RepoDetailsPage";
import { MemoryRouter } from "react-router";

test("renders RepoDetailsPage without errors", () => {
  render(
    <MemoryRouter>
      <RepoDetailsPage />
    </MemoryRouter>
  );
});
