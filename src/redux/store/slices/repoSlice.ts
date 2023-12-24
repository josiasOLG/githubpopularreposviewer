import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Repository } from "../../../models/repository/Repository";

interface RepoState {
  repos: Repository[];
}

const initialState: RepoState = {
  repos: [],
};

const repoSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {
    setRepos(state, action: PayloadAction<Repository[]>) {
      state.repos = action.payload;
    },
  },
});

export const { setRepos } = repoSlice.actions;
export default repoSlice.reducer;
