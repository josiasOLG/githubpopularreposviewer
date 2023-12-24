import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserPage from "./UserPage";
import { GitHubService } from "../../api/services/GitHubService";

// Mock do módulo inteiro do GitHubService
jest.mock("../../api/services/GitHubService");

describe("UserPage Component", () => {
  const mockUserData = {
    login: "testuser",
    avatar_url: "http://example.com/avatar",
    followers: 10,
    following: 5,
    bio: "Test bio",
  };

  const mockReposData = [
    {
      id: 1,
      name: "repo1",
      owner: { login: "testuser" },
      description: "Test repo 1",
      stargazers_count: 10,
      language: "JavaScript",
      isPrivate: false,
    },
  ];

  beforeEach(() => {
    // Aqui usamos tipagem explícita para as funções mockadas
    (GitHubService.getUserDetails as jest.Mock).mockResolvedValue(mockUserData);
    (GitHubService.getUserRepos as jest.Mock).mockResolvedValue(mockReposData);
  });

  it("renders the component", () => {
    render(<UserPage />);
    expect(
      screen.getByPlaceholderText("Enter GitHub username")
    ).toBeInTheDocument();
  });

  it("handles user input and form submission", async () => {
    render(<UserPage />);

    fireEvent.change(screen.getByPlaceholderText("Enter GitHub username"), {
      target: { value: "testuser" },
    });
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() =>
      expect(GitHubService.getUserDetails).toHaveBeenCalledWith("testuser")
    );
    await waitFor(() =>
      expect(GitHubService.getUserRepos).toHaveBeenCalledWith("testuser")
    );

    expect(screen.getByText(mockUserData.login)).toBeInTheDocument();
    expect(screen.getByText(mockReposData[0].name)).toBeInTheDocument();
  });
});
