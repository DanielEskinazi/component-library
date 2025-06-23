// Device Domain Types

export interface SensorConfig {
  type: SensorType;
  frequency: number;
  threshold?: number;
}

export type SensorType = 'accelerometer' | 'gyroscope' | 'magnetometer' | 'ambient-light' | 'proximity';

export interface SensorReading {
  timestamp: number;
  values: number[];
  accuracy?: number;
}

export interface BluetoothConfig {
  filters?: BluetoothFilter[];
  optionalServices?: string[];
}

export interface BluetoothFilter {
  name?: string;
  namePrefix?: string;
  services?: string[];
}

export interface BluetoothDevice {
  id: string;
  name: string;
  connected: boolean;
  services: BluetoothService[];
}

export interface BluetoothService {
  uuid: string;
  characteristics: BluetoothCharacteristic[];
}

export interface BluetoothCharacteristic {
  uuid: string;
  properties: string[];
  value?: ArrayBuffer;
}

export interface LocationConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  watchPosition: boolean;
}

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime?: number;
  dischargingTime?: number;
}

export interface DeviceInfo {
  platform: string;
  userAgent: string;
  language: string;
  online: boolean;
  cookieEnabled: boolean;
  maxTouchPoints: number;
  hardwareConcurrency: number;
  deviceMemory?: number;
}

export interface HardwareCapabilities {
  webgl: boolean;
  webgl2: boolean;
  webrtc: boolean;
  bluetooth: boolean;
  geolocation: boolean;
  sensors: SensorType[];
  camera: boolean;
  microphone: boolean;
  gamepad: boolean;
  vibration: boolean;
}