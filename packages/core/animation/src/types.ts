// Animation Domain Types

export interface AnimationConfig {
  duration: number;
  easing: EasingFunction | string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export type EasingFunction = (t: number) => number;

export interface Keyframe {
  time: number; // 0-1
  properties: Record<string, any>;
  easing?: EasingFunction | string;
}

export interface AnimationTarget {
  element: HTMLElement;
  properties: Record<string, any>;
}

export interface PhysicsAnimationConfig {
  mass: number;
  tension: number;
  friction: number;
  velocity: number;
  precision: number;
}

export interface ParticleConfig {
  count: number;
  lifetime: number;
  birthRate: number;
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  color: Color;
  size: number;
  texture?: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Particle {
  id: string;
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  color: Color;
  size: number;
  life: number;
  maxLife: number;
  active: boolean;
}

export interface TransitionConfig {
  property: string;
  duration: number;
  easing: string;
  delay?: number;
}

export interface TimelineEvent {
  time: number;
  action: () => void;
  executed: boolean;
}