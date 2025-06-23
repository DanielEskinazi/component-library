// Data processing and transformation utilities

import type { DataProcessingConfig, DataTransformation, ValidationRule } from './types';

export class DataProcessor {
  static process(data: any[], config: DataProcessingConfig): any[] {
    let processedData = [...data];

    // Apply transformations
    for (const transformation of config.transformations) {
      processedData = this.applyTransformation(processedData, transformation);
    }

    // Apply validation if configured
    if (config.validation) {
      processedData = this.validateData(processedData, config.validation);
    }

    return processedData;
  }

  private static applyTransformation(data: any[], transformation: DataTransformation): any[] {
    switch (transformation.type) {
      case 'filter':
        return typeof transformation.operation === 'function'
          ? data.filter(transformation.operation)
          : data.filter(item => this.evaluateExpression(item, transformation.operation as string));

      case 'map':
        return typeof transformation.operation === 'function'
          ? data.map(transformation.operation)
          : data.map(item => this.evaluateExpression(item, transformation.operation as string));

      case 'sort':
        return data.sort(typeof transformation.operation === 'function'
          ? transformation.operation
          : (a, b) => this.compareValues(a, b, transformation.operation as string));

      case 'reduce':
        // Implementation for reduce operation
        return data;

      default:
        return data;
    }
  }

  private static evaluateExpression(item: any, expression: string): any {
    // Simple expression evaluation placeholder
    // In a real implementation, this would be more sophisticated
    return item;
  }

  private static compareValues(a: any, b: any, field: string): number {
    const aVal = a[field];
    const bVal = b[field];
    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
  }

  private static validateData(data: any[], rules: ValidationRule[]): any[] {
    return data.filter(item => {
      return rules.every(rule => this.validateField(item[rule.field], rule));
    });
  }

  private static validateField(value: any, rule: ValidationRule): boolean {
    switch (rule.rule) {
      case 'required':
        return value != null && value !== '';
      
      case 'number':
        return typeof value === 'number' || !isNaN(Number(value));
      
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      
      case 'custom':
        return rule.validator ? rule.validator(value) : true;
      
      default:
        return true;
    }
  }
}

export class DataAggregator {
  static sum(data: number[]): number {
    return data.reduce((acc, val) => acc + val, 0);
  }

  static average(data: number[]): number {
    return data.length > 0 ? this.sum(data) / data.length : 0;
  }

  static median(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  static groupBy(data: any[], key: string): Record<string, any[]> {
    return data.reduce((groups, item) => {
      const groupKey = item[key];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  }
}