import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Repository } from "../../models/repository/Repository";
import RepoList from "./RepoList";

describe("RepoList Component", () => {
  const mockRepos: Repository[] = [
    new Repository(
      1,
      "Repo 1",
      { login: "owner1" },
      "Description 1",
      100,
      "JavaScript",
      false
    ),
    new Repository(
      2,
      "Repo 2",
      { login: "owner2" },
      "Description 2",
      150,
      "TypeScript",
      true
    ),
  ];

  it("should render a list of repositories", () => {
    render(
      <MemoryRouter>
        <RepoList repos={mockRepos} />
      </MemoryRouter>
    );
    mockRepos.forEach((repo: any) => {
      expect(screen.getByText(repo.name)).toBeInTheDocument();
      expect(screen.getByText(repo.description)).toBeInTheDocument();
    });
  });
});
