"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./index";
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/storage";
import {
  loadSavedPreferences,
} from "@/features/preferences/preferencesSlice";
import { UserPreferences } from "@/types/preferences";
import {
  loadSavedFavorites,
} from "@/features/favorites/favoritesSlice";
import { UnifiedContentItem } from "@/types/content";

function PersistenceManager({ store }: { store: AppStore }) {
  useEffect(() => {
    // 1. Initial rehydration from localStorage
    const savedPrefs = loadFromStorage<Partial<UserPreferences> | null>(
      STORAGE_KEYS.PREFERENCES,
      null
    );
    if (savedPrefs) {
      store.dispatch(loadSavedPreferences(savedPrefs));
    }

    const savedFavs = loadFromStorage<UnifiedContentItem[] | null>(
      STORAGE_KEYS.FAVORITES,
      null
    );
    if (savedFavs && Array.isArray(savedFavs)) {
      store.dispatch(loadSavedFavorites(savedFavs));
    }

    // 2. Subscribe to store changes and persist to localStorage
    let currentPrefs = store.getState().preferences;
    let currentFavs = store.getState().favorites.items;

    // Apply initial theme
    applyTheme(currentPrefs.theme);

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();

      if (state.preferences !== currentPrefs) {
        currentPrefs = state.preferences;
        saveToStorage(STORAGE_KEYS.PREFERENCES, currentPrefs);
        applyTheme(currentPrefs.theme);
      }

      if (state.favorites.items !== currentFavs) {
        currentFavs = state.favorites.items;
        saveToStorage(STORAGE_KEYS.FAVORITES, currentFavs);
      }
    });

    // Listen to system theme change if in 'system' mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (store.getState().preferences.theme === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [store]);

  return null;
}

function applyTheme(theme: "light" | "dark" | "system") {
  if (typeof window === "undefined") return;
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => makeStore());
  const isHydrated = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  return (
    <Provider store={store}>
      <div data-hydrated={isHydrated ? "true" : "false"} className="contents">
        <PersistenceManager store={store} />
        {children}
      </div>
    </Provider>
  );
}
