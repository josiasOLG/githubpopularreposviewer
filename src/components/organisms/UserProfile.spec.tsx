import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "./UserProfile";
import { IUserProfileProps } from "../../interfaces/user/IUserProfileProps";

const mockUser = {
  username: "johndoe",
  avatar_url: "https://example.com/avatar.jpg",
  followers: 10,
  following: 5,
  bio: "Developer",
};

const mockRepos = [
  {
    id: 1,
    name: "repo1",
    owner: mockUser,
    description: "Repo 1 description",
    stargazers_count: 5,
    language: "JavaScript",
    isPrivate: false,
  },
];

const mockHandleSortChange = jest.fn();
const mockSortOptions = [{ value: "stars", label: "Stars" }];

describe("UserProfile Component", () => {
  test("renders UserDetails and RepoList components", () => {
    render(
      <MemoryRouter>
        <UserProfile
          user={mockUser}
          repos={mockRepos}
          handleSortChange={mockHandleSortChange}
          sortOptions={mockSortOptions}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.username)).toBeInTheDocument();
    mockRepos.forEach((repo) => {
      expect(screen.getByText(repo.name)).toBeInTheDocument();
    });
  });
});
