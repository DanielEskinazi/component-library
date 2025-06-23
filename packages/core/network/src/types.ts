// Network Domain Types

export interface HTTPConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnect: boolean;
  reconnectDelay: number;
  maxReconnectAttempts: number;
  heartbeat: boolean;
  heartbeatInterval: number;
}

export interface SyncConfig {
  strategy: 'optimistic' | 'pessimistic' | 'merge';
  conflictResolution: 'client' | 'server' | 'manual';
  batchSize: number;
  syncInterval: number;
}

export interface CacheConfig {
  strategy: 'memory' | 'localStorage' | 'indexedDB';
  maxSize: number;
  ttl: number;
  compression: boolean;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export interface APIResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  timestamp: Date;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: string;
  data: any;
  timestamp: Date;
  synced: boolean;
  retries: number;
}

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: Date;
  ttl: number;
  size: number;
}

export interface NetworkStatus {
  online: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  downlink: number;
  rtt: number;
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
}