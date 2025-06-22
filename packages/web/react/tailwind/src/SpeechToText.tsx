import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SpeechRecognition, SpeechRecognitionState } from '@mycomponents/speech-to-text-core';
import { clsx } from 'clsx';

export interface SpeechToTextProps {
  onTranscript?: (transcript: string) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: SpeechRecognitionState) => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  className?: string;
  showTranscript?: boolean;
  autoStart?: boolean;
}

export const SpeechToText: React.FC<SpeechToTextProps> = ({
  onTranscript,
  onError,
  onStateChange,
  continuous = false,
  interimResults = true,
  lang,
  className,
  showTranscript = true,
  autoStart = false,
}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isSupported: false,
    error: null,
    results: [],
    interimTranscript: '',
    finalTranscript: '',
  });

  useEffect(() => {
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.on('stateChange', (newState: SpeechRecognitionState) => {
      setState(newState);
      onStateChange?.(newState);
    });

    recognition.on('result', () => {
      const transcript = recognition.getTranscript();
      onTranscript?.(transcript);
    });

    recognition.on('error', (error: any) => {
      onError?.(new Error(error.message));
    });

    setState(recognition.getState());

    if (autoStart && recognition.isSupported()) {
      recognition.start({ continuous, interimResults, lang });
    }

    return () => {
      recognition.destroy();
    };
  }, []);

  const toggleRecording = useCallback(async () => {
    if (!recognitionRef.current) return;

    try {
      if (state.isListening) {
        await recognitionRef.current.stop();
      } else {
        await recognitionRef.current.start({ continuous, interimResults, lang });
      }
    } catch (error) {
      console.error('Toggle recording error:', error);
    }
  }, [state.isListening, continuous, interimResults, lang]);

  const clearTranscript = useCallback(() => {
    recognitionRef.current?.clearTranscript();
  }, []);

  if (!state.isSupported) {
    return (
      <div className={clsx('p-4 bg-yellow-50 border border-yellow-200 rounded-lg', className)}>
        <p className="text-yellow-800 text-sm">
          Speech recognition is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={toggleRecording}
          className={clsx(
            'relative px-6 py-3 rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            state.isListening
              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
              : 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500'
          )}
        >
          <span className="flex items-center gap-2">
            {state.isListening ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Stop Recording
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Start Recording
              </>
            )}
          </span>
        </button>

        {(state.finalTranscript || state.interimTranscript) && (
          <button
            onClick={clearTranscript}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Clear
          </button>
        )}
      </div>

      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{state.error.message}</p>
        </div>
      )}

      {showTranscript && (state.finalTranscript || state.interimTranscript) && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="space-y-2">
            {state.finalTranscript && (
              <p className="text-gray-800">{state.finalTranscript}</p>
            )}
            {state.interimTranscript && (
              <p className="text-gray-500 italic">{state.interimTranscript}</p>
            )}
          </div>
        </div>
      )}

      {state.isListening && !state.finalTranscript && !state.interimTranscript && (
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm">Listening...</span>
        </div>
      )}
    </div>
  );
};