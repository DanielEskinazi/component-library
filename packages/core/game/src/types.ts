// Game Domain Types

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: Vector2D;
  acceleration: Vector2D;
  rotation: number;
  scale: number;
  visible: boolean;
  active: boolean;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  bounce: number;
  worldBounds: Rectangle;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface GameState {
  objects: GameObject[];
  score: number;
  level: number;
  lives: number;
  timeElapsed: number;
  paused: boolean;
  gameOver: boolean;
}

export interface CollisionInfo {
  object1: GameObject;
  object2: GameObject;
  point: Vector2D;
  normal: Vector2D;
  penetration: number;
}

export interface ScoreConfig {
  multiplier: number;
  bonusThreshold: number;
  timeBonus: boolean;
  comboSystem: boolean;
}

export interface GameLoopConfig {
  targetFPS: number;
  maxDeltaTime: number;
  fixedTimeStep: boolean;
}