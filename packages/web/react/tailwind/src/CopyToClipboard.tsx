import React, { useState, useCallback } from 'react';
import { copyToClipboard } from '@mycomponents/utils';
import { clsx } from 'clsx';

export interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  onCopy?: (success: boolean) => void;
  className?: string;
  successDuration?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  successTooltipText?: string;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  onCopy,
  className,
  successDuration = 2000,
  showTooltip = true,
  tooltipText = 'Copy to clipboard',
  successTooltipText = 'Copied!',
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  const handleCopy = useCallback(async () => {
    const result = await copyToClipboard(text);
    
    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    }
    
    onCopy?.(result.success);
  }, [text, onCopy, successDuration]);

  const defaultButton = (
    <button
      className={clsx(
        'relative px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        copied
          ? 'bg-green-500 text-white focus:ring-green-500'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
        className
      )}
    >
      <span className="flex items-center gap-2">
        {copied ? (
          <>
            <svg
              className="w-4 h-4 animate-scale-in"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy
          </>
        )}
      </span>
    </button>
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
    >
      <div onClick={handleCopy}>
        {children || defaultButton}
      </div>
      
      {showTooltip && showTooltipState && (
        <div
          className={clsx(
            'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            'px-2 py-1 text-xs text-white rounded',
            'pointer-events-none transition-opacity duration-200',
            'whitespace-nowrap',
            copied ? 'bg-green-500' : 'bg-gray-800'
          )}
        >
          {copied ? successTooltipText : tooltipText}
          <div
            className={clsx(
              'absolute top-full left-1/2 transform -translate-x-1/2',
              'w-0 h-0 border-4 border-transparent',
              copied ? 'border-t-green-500' : 'border-t-gray-800'
            )}
          />
        </div>
      )}
    </div>
  );
};