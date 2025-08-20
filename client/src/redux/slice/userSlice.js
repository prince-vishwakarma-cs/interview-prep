import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        userApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
        }
      )
      .addMatcher(
        userApi.endpoints.getUserProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
