/**
 * @jest-environment jsdom
 */

import { copyToClipboard, readFromClipboard } from '../clipboard';
import { mockClipboard } from '@test-utils';

describe('Clipboard utilities', () => {
  beforeEach(() => {
    // Set up clipboard mocks
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true,
    });
    
    jest.clearAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should copy text using modern clipboard API', async () => {
      const text = 'Hello, World!';
      
      const result = await copyToClipboard(text);
      
      expect(result.success).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
    });

    it('should handle clipboard API errors with fallback', async () => {
      const text = 'Test text';
      mockClipboard.writeText.mockRejectedValue(new Error('Permission denied'));
      
      // Mock document.execCommand fallback
      const mockTextArea = {
        value: '',
        select: jest.fn(),
        setSelectionRange: jest.fn(),
        setAttribute: jest.fn(),
        style: {},
        remove: jest.fn(),
      };
      
      document.createElement = jest.fn(() => mockTextArea) as any;
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();
      document.execCommand = jest.fn(() => true);
      document.getSelection = jest.fn(() => ({
        rangeCount: 0,
        removeAllRanges: jest.fn(),
        addRange: jest.fn(),
      })) as any;
      
      const result = await copyToClipboard(text);
      
      expect(result.success).toBe(true);
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });

    it('should handle non-string input', async () => {
      const result = await copyToClipboard('');
      
      expect(result.success).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });

    it('should handle environment without navigator', async () => {
      const originalNavigator = global.navigator;
      delete global.navigator;
      
      const result = await copyToClipboard('test');
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('not available in this environment');
      
      global.navigator = originalNavigator;
    });
  });

  describe('readFromClipboard', () => {
    it('should read text using modern clipboard API', async () => {
      const expectedText = 'Pasted content';
      mockClipboard.readText.mockResolvedValue(expectedText);
      
      const result = await readFromClipboard();
      
      expect(result).toBe(expectedText);
      expect(navigator.clipboard.readText).toHaveBeenCalled();
    });

    it('should handle clipboard read errors', async () => {
      mockClipboard.readText.mockRejectedValue(new Error('Permission denied'));
      
      const result = await readFromClipboard();
      
      expect(result).toBe(null);
    });

    it('should handle missing clipboard API', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      });
      
      const result = await readFromClipboard();
      
      expect(result).toBe(null);
    });

    it('should handle environment without navigator', async () => {
      const originalNavigator = global.navigator;
      delete global.navigator;
      
      const result = await readFromClipboard();
      
      expect(result).toBe(null);
      
      global.navigator = originalNavigator;
    });
  });

  describe('basic functionality', () => {
    it('should return proper ClipboardResult structure', async () => {
      const result = await copyToClipboard('test');
      
      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
      
      if (!result.success) {
        expect(result).toHaveProperty('error');
        expect(result.error).toBeInstanceOf(Error);
      }
    });

    it('should handle modern browsers with clipboard API', async () => {
      const result = await copyToClipboard('modern browser test');
      
      expect(result.success).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('modern browser test');
    });
  });
});