import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "@/pages/login/slice";
import appSlice from "./slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    app: appSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
