import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import repoReducer from "./slices/repoSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    repo: repoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
