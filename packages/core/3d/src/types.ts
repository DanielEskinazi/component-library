// 3D Domain Types

export interface Scene3D {
  objects: Object3D[];
  camera: Camera3D;
  lights: Light3D[];
  background: Color | Texture;
}

export interface Object3D {
  id: string;
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
  geometry: Geometry;
  material: Material;
  visible: boolean;
  castShadow: boolean;
  receiveShadow: boolean;
}

export interface Camera3D {
  position: Vector3D;
  target: Vector3D;
  up: Vector3D;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  type: 'perspective' | 'orthographic';
}

export interface Light3D {
  type: 'directional' | 'point' | 'spot' | 'ambient';
  position?: Vector3D;
  direction?: Vector3D;
  color: Color;
  intensity: number;
  castShadow?: boolean;
}

export interface Geometry {
  vertices: number[];
  indices: number[];
  normals: number[];
  uvs: number[];
  colors?: number[];
}

export interface Material {
  type: 'basic' | 'phong' | 'pbr';
  color: Color;
  texture?: Texture;
  normalMap?: Texture;
  roughness?: number;
  metalness?: number;
  emissive?: Color;
}

export interface Texture {
  url: string;
  wrapS: number;
  wrapT: number;
  magFilter: number;
  minFilter: number;
}

export interface WebGLConfig {
  antialias: boolean;
  alpha: boolean;
  depth: boolean;
  stencil: boolean;
  preserveDrawingBuffer: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
}

export interface XRConfig {
  mode: 'vr' | 'ar';
  features: XRFeature[];
  referenceSpace: 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';
}

export type XRFeature = 'hand-tracking' | 'eye-tracking' | 'plane-detection' | 'hit-test';