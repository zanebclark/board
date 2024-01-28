import { get, writable } from "svelte/store";

import {
  fromLocalStorage,
  toLocalStorage,
  getBoolFromURL,
  getIntFromURL,
  getStringFromURL
} from "./helpers";
import { setTheme } from "$lib/theme";

// Each setting receives it's value using the following algorithm:
// If url param is set, take value from URL.
// Else if setting is backed by local storage, take value from local storage.
// Else load default value from getDefaultSettings()
//
// Only a subset of settings are backed by local storage and user preference. This is by design.

// Keys for load from URL and local storage
export enum Setting {
  ENGINE = "engine",
  GAME = "game",
  SHOW_CONTROLS = "showControls",
  SHOW_COORDS = "showCoords",
  SHOW_SCOREBOARD = "showScoreboard",
  THEME = "theme",
  TITLE = "title",
  TURN = "turn"
}

export enum Theme {
  DARK = "dark",
  LIGHT = "light",
  SYSTEM = "system"
}

export type Settings = {
  engine: string;
  game: string;
  showControls: boolean;
  showCoords: boolean;
  showScoreboard: boolean;
  theme: Theme;
  title: string;
  turn: number;
};

export function getDefaultSettings(): Settings {
  return {
    engine: "https://engine.battlesnake.com",
    game: "",
    showControls: true,
    showCoords: false,
    showScoreboard: true,
    theme: Theme.SYSTEM,
    title: "",
    turn: 0
  };
}

// These settings are backed by user preference, stored in local storage

// Show Coordinates
export const showCoords = writable<boolean>(
  fromLocalStorage(Setting.SHOW_COORDS, getDefaultSettings().showCoords)
);
showCoords.subscribe((value: boolean) => {
  toLocalStorage(Setting.SHOW_COORDS, value);
});

// Theme
export const theme = writable<Theme>(fromLocalStorage(Setting.THEME, getDefaultSettings().theme));
theme.subscribe((value: Theme) => {
  toLocalStorage(Setting.THEME, value);
  setTheme(value);
});

// Load settings, with option to override via URL params
export function loadSettingsWithURLOverrides(url: URL): Settings {
  const defaults = getDefaultSettings();

  // Note that defaults are already baked into the settings backed by local storage
  return {
    // Preference controlled
    showCoords: getBoolFromURL(url, Setting.SHOW_COORDS, get(showCoords)),
    theme: getStringFromURL(url, Setting.THEME, get(theme)) as Theme,
    // URL param controlled
    engine: getStringFromURL(url, Setting.ENGINE, defaults.engine),
    game: getStringFromURL(url, Setting.GAME, defaults.game),
    showControls: getBoolFromURL(url, Setting.SHOW_CONTROLS, defaults.showControls),
    showScoreboard: getBoolFromURL(url, Setting.SHOW_SCOREBOARD, defaults.showScoreboard),
    title: getStringFromURL(url, Setting.TITLE, defaults.title),
    turn: getIntFromURL(url, Setting.TURN, defaults.turn)
  };
}
