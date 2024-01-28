import { jsonToFrame, type Frame } from "./types";
import requestInfo from "./move.json";

type FrameCallback = (frame: Frame) => void;

// Converts http://foo to ws://foo or https://foo to wss://foo
export function httpToWsProtocol(url: string) {
  return url
    .replace(/^https:\/\//i, "wss://") // https:// --> wss://
    .replace(/^http:\/\//i, "ws://"); // http:// --> ws://
}

export function fetchGameFromJson(
  onFrameLoad: FrameCallback,
) {
  const frame = jsonToFrame(requestInfo);
  onFrameLoad(frame);
}
