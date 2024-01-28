import { writable } from "svelte/store";
import { fetchGameFromJson } from "./engine";
import type { Frame, PlaybackState } from "./types";

const writableState = writable<PlaybackState | null>(null);
export const playbackError = writable<string | null>(null);

const reset = () => {
  writableState.set(null);
  playbackError.set(null);
};

const onFrameLoad = (frame: Frame) => {
  // Load the first frame when we see it.
  writableState.set({
    frame: frame,
    finalFrame: null
  });
};


function createPlaybackState() {
  return {
    subscribe: writableState.subscribe,
    load: () => {
      fetchGameFromJson(onFrameLoad);
    },
    reset
  };
}

export const playbackState = createPlaybackState();
