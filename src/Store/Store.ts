import { configureStore } from "@reduxjs/toolkit";
import splashReducer from "./Slices/splashSlice";
import loaderReducer from "./Slices/loaderSlice";
import authReducer from "./Slices/authSlice";

export const store = configureStore({
  reducer: {
    splash: splashReducer,
    loader:loaderReducer,
    auth:authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;