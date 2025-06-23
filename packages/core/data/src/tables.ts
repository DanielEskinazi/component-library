// Table utilities for data display and manipulation

import type { TableData, TableColumn } from './types';

export class TableDataProcessor {
  static sortData(data: TableData, column: string, direction: 'asc' | 'desc'): TableData {
    const sortedRows = [...data.rows].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return {
      ...data,
      rows: sortedRows
    };
  }

  static filterData(data: TableData, filters: Record<string, any>): TableData {
    const filteredRows = data.rows.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(String(value).toLowerCase());
      });
    });

    return {
      ...data,
      rows: filteredRows
    };
  }

  static paginateData(data: TableData, page: number, pageSize: number): TableData {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      ...data,
      rows: data.rows.slice(startIndex, endIndex)
    };
  }
}

export class TableColumnUtils {
  static inferColumnType(values: any[]): 'text' | 'number' | 'date' | 'boolean' {
    const sample = values.filter(v => v != null).slice(0, 10);
    
    if (sample.every(v => typeof v === 'boolean')) return 'boolean';
    if (sample.every(v => typeof v === 'number')) return 'number';
    if (sample.every(v => !isNaN(Date.parse(v)))) return 'date';
    
    return 'text';
  }

  static createColumn(key: string, label?: string, options: Partial<TableColumn> = {}): TableColumn {
    return {
      key,
      label: label || key,
      sortable: true,
      filterable: true,
      type: 'text',
      ...options
    };
  }
}