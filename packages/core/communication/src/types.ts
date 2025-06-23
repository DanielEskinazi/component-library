// Communication Domain Types

export interface ChatConfig {
  maxMessages?: number;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  allowFiles?: boolean;
  maxFileSize?: number;
}

export interface WebRTCConfig {
  video?: boolean;
  audio?: boolean;
  iceServers?: RTCIceServer[];
  constraints?: MediaStreamConstraints;
}

export interface CollaborationConfig {
  roomId: string;
  userId: string;
  permissions?: Permission[];
  syncInterval?: number;
}

export interface NotificationConfig {
  permission?: boolean;
  sound?: boolean;
  vibration?: boolean;
  persistent?: boolean;
  badge?: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  metadata?: Record<string, any>;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

export type Permission = 'read' | 'write' | 'delete' | 'admin';

export interface CollaborativeOperation {
  type: 'insert' | 'delete' | 'update';
  position: number;
  content: string;
  userId: string;
  timestamp: Date;
}