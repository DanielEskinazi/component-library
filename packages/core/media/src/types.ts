// Media Domain Types

export interface VideoConfig {
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  poster?: string;
}

export interface ImageConfig {
  lazy?: boolean;
  placeholder?: string;
  quality?: number;
  formats?: string[];
  sizes?: string[];
}

export interface CameraConfig {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
  facingMode?: 'user' | 'environment';
  resolution?: {
    width: number;
    height: number;
  };
}

export interface GalleryConfig {
  thumbnails?: boolean;
  autoplay?: boolean;
  infinite?: boolean;
  slideInterval?: number;
  navigation?: boolean;
  pagination?: boolean;
}

export interface MediaProcessingConfig {
  format?: string;
  quality?: number;
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
  };
  filters?: MediaFilter[];
}

export interface MediaFilter {
  type: 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'sepia';
  intensity: number;
}

export interface MediaMetadata {
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  createdAt?: Date;
}