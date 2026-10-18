import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { pulseApi } from "@/services/apiSlice";
import preferencesReducer from "@/features/preferences/preferencesSlice";
import favoritesReducer from "@/features/favorites/favoritesSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [pulseApi.reducerPath]: pulseApi.reducer,
      preferences: preferencesReducer,
      favorites: favoritesReducer,
      dashboard: dashboardReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pulseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
