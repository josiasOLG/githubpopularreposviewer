import React from "react";
import { render } from "@testing-library/react";
import RepoDetailsTemplate from "./RepoDetailsTemplate";
import { MemoryRouter } from "react-router";

// Dados de exemplo para os detalhes do repositório
const mockRepoDetails = {
  name: "Test Repo",
  description: "This is a test repository",
  stars: 50,
  language: "JavaScript",
  url: "https://github.com/example/test-repo",
};

test("renders RepoDetailsTemplate without errors", () => {
  render(
    <MemoryRouter>
      <RepoDetailsTemplate repoDetails={mockRepoDetails} />
    </MemoryRouter>
  );
});
