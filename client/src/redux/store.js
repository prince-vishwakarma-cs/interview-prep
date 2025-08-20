import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import { userApi } from "./api/userApi";
import { aiApi } from "./api/aiApi";
import { sessionApi } from "./api/sessionAPi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(aiApi.middleware)
      .concat(sessionApi.middleware),
});
