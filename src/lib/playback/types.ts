export type Point = {
  x: number;
  y: number;
};

export type SnakeCustomizations = {
  color?: string;
  head?: string;
  tail?: string;
}

export type RequestSnake = {
  id: string;
  name: string;
  health: number;
  body: Point[];
  latency: string;
  length: number;
  customizations: SnakeCustomizations;
};

export type Snake = Omit<RequestSnake, "shout" | "customizations"> & {
  head: string;
  color: string;
  tail: string;
};

export type Frame = {
  turn: number;
  width: number;
  height: number;
  snakes: Snake[];
  food: Point[];
  hazards: Point[];
  isFinalFrame: boolean;
  descendents?: Frame[];
};

export type RoyaleSettings = {
  shrinkEveryNTurns: number;
}

export type RulesetSettings = {
  foodSpawnChance: number;
  minimumFood: number;
  hazardDamagePerTurn: number;
  royale?: RoyaleSettings;
}

export type Ruleset = {
  name: string;
  version: string;
  settings: RulesetSettings;
}

export type Game = {
  id: string;
  ruleset: Ruleset;
  map: string;
  timeout: number;
  source: string;
}

export type Board = {
  height: number;
  width: number;
  food: Point[];
  hazards: Point[];
  snakes: RequestSnake[];
}

export type Request = {
  game: Game;
  turn: number;
  board: Board;
  you: RequestSnake;
  descendents?: Request[];
}

export type PlaybackHandler = () => void;

export type PlaybackState = {
  frame: Frame;
  finalFrame: null | Frame;
};

// We're lenient with typing data that's received from the game engine
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
type EngineObject = any;

export function jsonToFrame(
  requestInfo: Request
): Frame {
  const coordsToPoint = function(coords: EngineObject): Point {
    return { x: coords.x, y: coords.y };
  };

  const requestSnakeToSnake = function(snake: RequestSnake): Snake {
    return {
      // Fixed properties
      id: snake.id,
      name: snake.name,
      color: snake.customizations.color || "default",
      head: snake.customizations.head || "default",
      tail: snake.customizations.tail || "default",
      // Frame specific
      health: snake.health,
      latency: snake.latency,
      body: snake.body.map(coordsToPoint),
      length: snake.length
    };
  };

  return {
    turn: requestInfo.turn,
    width: requestInfo.board.width,
    height: requestInfo.board.height,
    snakes: requestInfo.board.snakes.map(requestSnakeToSnake),
    food: requestInfo.board.food.map(coordsToPoint),
    hazards: requestInfo.board.hazards.map(coordsToPoint),
    isFinalFrame: false,
    descendents: requestInfo.descendents?.map(jsonToFrame)
  };
}
