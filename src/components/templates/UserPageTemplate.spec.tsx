import React from "react";
import { render } from "@testing-library/react";
import UserPageTemplate from "./UserPageTemplate";
import { MemoryRouter } from "react-router";

test("renders UserPageTemplate without errors", () => {
  const user = {
    username: "testuser",
    avatar_url: "http://example.com/avatar",
    followers: 10,
    following: 5,
    bio: "Test bio",
  };

  const repos = [
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

  const handleSortChange = jest.fn();
  const sortOptions = [{ value: "value1", label: "Label 1" }];

  render(
    <MemoryRouter>
      <UserPageTemplate
        user={user}
        repos={repos}
        handleSortChange={handleSortChange}
        sortOptions={sortOptions}
      />
    </MemoryRouter>
  );

  // O teste passará se o componente renderizar sem erros
});
