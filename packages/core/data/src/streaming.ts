// Real-time data streaming utilities

import type { StreamingDataConfig } from './types';

export class DataStreamManager {
  private config: StreamingDataConfig;
  private connection: WebSocket | EventSource | null = null;
  private listeners: Set<(data: any) => void> = new Set();
  private reconnectAttempts = 0;

  constructor(config: StreamingDataConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        switch (this.config.protocol) {
          case 'websocket':
            this.connectWebSocket(resolve, reject);
            break;
          case 'sse':
            this.connectSSE(resolve, reject);
            break;
          case 'polling':
            this.startPolling(resolve, reject);
            break;
          default:
            reject(new Error(`Unsupported protocol: ${this.config.protocol}`));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private connectWebSocket(resolve: () => void, reject: (error: Error) => void) {
    this.connection = new WebSocket(this.config.url);
    
    this.connection.onopen = () => {
      this.reconnectAttempts = 0;
      resolve();
    };

    this.connection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.connection.onerror = (error) => {
      reject(new Error('WebSocket connection failed'));
    };

    this.connection.onclose = () => {
      this.handleReconnect();
    };
  }

  private connectSSE(resolve: () => void, reject: (error: Error) => void) {
    this.connection = new EventSource(this.config.url);
    
    this.connection.onopen = () => {
      this.reconnectAttempts = 0;
      resolve();
    };

    this.connection.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    this.connection.onerror = () => {
      reject(new Error('SSE connection failed'));
    };
  }

  private startPolling(resolve: () => void, reject: (error: Error) => void) {
    // Polling implementation placeholder
    resolve();
  }

  private handleReconnect() {
    const maxAttempts = this.config.maxReconnectAttempts || 5;
    if (this.reconnectAttempts < maxAttempts) {
      this.reconnectAttempts++;
      const delay = this.config.reconnectDelay || 1000;
      setTimeout(() => this.connect(), delay * this.reconnectAttempts);
    }
  }

  addListener(callback: (data: any) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (data: any) => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners(data: any) {
    this.listeners.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.connection) {
      if (this.connection instanceof WebSocket) {
        this.connection.close();
      } else if (this.connection instanceof EventSource) {
        this.connection.close();
      }
      this.connection = null;
    }
  }
}