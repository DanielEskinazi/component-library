// Data Domain Types

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'number' | 'date' | 'boolean';
}

export interface TableData {
  columns: TableColumn[];
  rows: Record<string, any>[];
}

export interface StreamingDataConfig {
  url: string;
  protocol: 'websocket' | 'sse' | 'polling';
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface DataProcessingConfig {
  transformations: DataTransformation[];
  validation?: ValidationRule[];
}

export interface DataTransformation {
  type: 'filter' | 'map' | 'reduce' | 'sort';
  operation: string | Function;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'number' | 'email' | 'url' | 'custom';
  message?: string;
  validator?: Function;
}