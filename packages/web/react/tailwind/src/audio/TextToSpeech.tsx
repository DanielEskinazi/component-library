import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TextToSpeech as TTS, type TextToSpeechState } from '@mycomponents/audio-core';
import { clsx } from 'clsx';

export interface TextToSpeechProps {
  text: string;
  autoSpeak?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  showControls?: boolean;
  showVoiceSelector?: boolean;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  autoSpeak = false,
  onStart,
  onEnd,
  onError,
  className,
  showControls = true,
  showVoiceSelector = true,
}) => {
  const ttsRef = useRef<InstanceType<typeof TTS> | null>(null);
  const [state, setState] = useState<TextToSpeechState>({
    isSupported: false,
    isSpeaking: false,
    isPaused: false,
    voices: [],
    currentVoice: null,
    rate: 1,
    pitch: 1,
    volume: 1,
    error: null,
  });

  useEffect(() => {
    const tts = new TTS();
    ttsRef.current = tts;

    tts.on('stateChange', (newState: TextToSpeechState) => {
      setState(newState);
    });

    tts.on('start', () => onStart?.());
    tts.on('end', () => onEnd?.());
    tts.on('error', (error: any) => onError?.(new Error(error.message)));

    setState(tts.getState());

    if (autoSpeak && text && tts.isSupported()) {
      tts.speak(text);
    }

    return () => {
      tts.destroy();
    };
  }, []);

  useEffect(() => {
    if (autoSpeak && text && ttsRef.current && !state.isSpeaking) {
      ttsRef.current.speak(text);
    }
  }, [text, autoSpeak]);

  const handleSpeak = useCallback(async () => {
    if (!ttsRef.current || !text) return;

    try {
      if (state.isSpeaking) {
        ttsRef.current.cancel();
      } else {
        await ttsRef.current.speak(text);
      }
    } catch (error) {
      console.error('Speak error:', error);
    }
  }, [text, state.isSpeaking]);

  const handlePause = useCallback(() => {
    ttsRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    ttsRef.current?.resume();
  }, []);

  const handleVoiceChange = useCallback((voiceName: string) => {
    ttsRef.current?.setVoice(voiceName);
  }, []);

  const handleRateChange = useCallback((rate: number) => {
    ttsRef.current?.setRate(rate);
  }, []);

  const handlePitchChange = useCallback((pitch: number) => {
    ttsRef.current?.setPitch(pitch);
  }, []);

  const handleVolumeChange = useCallback((volume: number) => {
    ttsRef.current?.setVolume(volume);
  }, []);

  if (!state.isSupported) {
    return (
      <div className={clsx('p-4 bg-yellow-50 border border-yellow-200 rounded-lg', className)}>
        <p className="text-yellow-800 text-sm">
          Text-to-speech is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('w-full space-y-4', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleSpeak}
          disabled={!text}
          className={clsx(
            'px-4 py-2 rounded-lg font-medium transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            text
              ? state.isSpeaking
                ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                : 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <span className="flex items-center gap-2">
            {state.isSpeaking ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Speak
              </>
            )}
          </span>
        </button>

        {state.isSpeaking && (
          <>
            {state.isPaused ? (
              <button
                onClick={handleResume}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Pause
              </button>
            )}
          </>
        )}
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{state.error.message}</p>
        </div>
      )}

      {showControls && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          {showVoiceSelector && state.voices.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={state.currentVoice?.name || ''}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {state.voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed: {state.rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={state.rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pitch: {state.pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={state.pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume: {Math.round(state.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={state.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};