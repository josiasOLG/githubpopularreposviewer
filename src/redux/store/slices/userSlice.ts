import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../models/user/User";

interface UserState {
  userDetails: User | null;
}

const initialState: UserState = {
  userDetails: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action: PayloadAction<User | null>) {
      state.userDetails = action.payload;
    },
  },
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;
