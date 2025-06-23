// Input Domain Types

export interface FormConfig {
  validation?: ValidationConfig;
  autoSave?: boolean;
  submitOnEnter?: boolean;
  resetOnSubmit?: boolean;
}

export interface ValidationConfig {
  realTime?: boolean;
  showErrors?: boolean;
  customMessages?: Record<string, string>;
}

export interface GestureConfig {
  gestures: GestureType[];
  threshold?: number;
  preventDefault?: boolean;
}

export type GestureType = 'swipe' | 'pinch' | 'rotate' | 'tap' | 'longpress' | 'pan';

export interface DrawingConfig {
  brushSize?: number;
  brushColor?: string;
  smoothing?: boolean;
  pressure?: boolean;
  eraser?: boolean;
}

export interface KeyboardShortcut {
  key: string;
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  action: () => void;
  description?: string;
}

export interface TouchConfig {
  multiTouch?: boolean;
  sensitivity?: number;
  preventDefault?: boolean;
}

export interface GestureEvent {
  type: GestureType;
  target: EventTarget;
  startTime: number;
  endTime: number;
  deltaX?: number;
  deltaY?: number;
  scale?: number;
  rotation?: number;
  velocity?: number;
}

export interface DrawingStroke {
  points: Point[];
  brushSize: number;
  brushColor: string;
  timestamp: number;
}

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}