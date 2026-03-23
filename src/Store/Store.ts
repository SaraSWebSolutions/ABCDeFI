import { configureStore } from "@reduxjs/toolkit";
import splashReducer from "./Slices/splashSlice";
import loaderReducer from "./Slices/loaderSlice";
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/profileSlice"
import homeReducer from "./Slices/homeSlice";

export const store = configureStore({
  reducer: {
    splash: splashReducer,
    loader:loaderReducer,
    auth:authReducer,
    profile:profileReducer,
    home:homeReducer
  },
  
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;