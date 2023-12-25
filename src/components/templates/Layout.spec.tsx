import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Layout from "./Layout";

test("renders RepoDetailsPage without errors", () => {
  render(
    <MemoryRouter>
      <Layout children={"<div></div>"} />
    </MemoryRouter>
  );
});
