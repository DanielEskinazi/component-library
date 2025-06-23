// AI Domain Types

export interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering';
  trained: boolean;
  accuracy?: number;
}

export interface TrainingData {
  features: number[][];
  labels: string[] | number[];
  metadata?: Record<string, any>;
}

export interface PredictionResult {
  prediction: string | number;
  confidence: number;
  alternatives?: Array<{
    value: string | number;
    confidence: number;
  }>;
}

export interface NLPConfig {
  language: string;
  tasks: NLPTask[];
  model?: string;
}

export type NLPTask = 'tokenization' | 'sentiment' | 'entities' | 'translation' | 'summarization';

export interface TextAnalysis {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  entities: Entity[];
  keywords: string[];
  language: string;
}

export interface Entity {
  text: string;
  type: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface VisionConfig {
  tasks: VisionTask[];
  model?: string;
  threshold?: number;
}

export type VisionTask = 'detection' | 'classification' | 'segmentation' | 'ocr';

export interface DetectionResult {
  objects: DetectedObject[];
  processingTime: number;
}

export interface DetectedObject {
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface RecommendationConfig {
  algorithm: 'collaborative' | 'content' | 'hybrid';
  maxRecommendations: number;
  threshold: number;
}

export interface ChatbotConfig {
  personality: string;
  context: string[];
  responseStyle: 'formal' | 'casual' | 'technical';
  fallbackMessage: string;
}