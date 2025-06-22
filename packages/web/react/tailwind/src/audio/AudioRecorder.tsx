import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioRecorder as Recorder, type AudioRecorderState, type AudioData, formatDuration, formatFileSize } from '@mycomponents/audio-core';
import { clsx } from 'clsx';

export interface AudioRecorderProps {
  onRecordingComplete?: (audioData: AudioData) => void;
  onError?: (error: Error) => void;
  onLevelUpdate?: (level: number) => void;
  className?: string;
  showWaveform?: boolean;
  showTimer?: boolean;
  showDownload?: boolean;
  maxDuration?: number;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  onError,
  onLevelUpdate,
  className,
  showWaveform = true,
  showTimer = true,
  showDownload = true,
  maxDuration,
}) => {
  const recorderRef = useRef<InstanceType<typeof Recorder> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [state, setState] = useState<AudioRecorderState>({
    isSupported: false,
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    error: null,
  });
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const recorder = new Recorder();
    recorderRef.current = recorder;

    recorder.on('stateChange', (newState: AudioRecorderState) => {
      setState(newState);
    });

    recorder.on('stop', (data: AudioData) => {
      setAudioData(data);
      onRecordingComplete?.(data);
    });

    recorder.on('error', (error: any) => {
      onError?.(new Error(error.message));
    });

    recorder.on('levelUpdate', (level: number) => {
      onLevelUpdate?.(level);
      if (showWaveform && canvasRef.current) {
        drawWaveform(level);
      }
    });

    setState(recorder.getState());

    return () => {
      recorder.destroy();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRecording && !state.isPaused) {
      const startTime = Date.now() - elapsedTime * 1000;
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setElapsedTime(elapsed);

        if (maxDuration && elapsed >= maxDuration) {
          handleStop();
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRecording, state.isPaused, elapsedTime, maxDuration]);

  const drawWaveform = (level: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.save();
    ctx.globalCompositeOperation = 'copy';
    ctx.drawImage(canvas, -2, 0);
    ctx.restore();

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(width - 2, centerY - level * centerY, 2, level * centerY * 2);
  };

  const handleStart = useCallback(async () => {
    if (!recorderRef.current) return;

    try {
      setAudioData(null);
      setElapsedTime(0);
      await recorderRef.current.start();
    } catch (error) {
      console.error('Start recording error:', error);
    }
  }, []);

  const handleStop = useCallback(async () => {
    if (!recorderRef.current) return;

    try {
      await recorderRef.current.stop();
      setElapsedTime(0);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  }, []);

  const handlePause = useCallback(() => {
    recorderRef.current?.pause();
  }, []);

  const handleResume = useCallback(() => {
    recorderRef.current?.resume();
  }, []);

  const handleDownload = useCallback(() => {
    if (!audioData) return;

    const a = document.createElement('a');
    a.href = audioData.url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
  }, [audioData]);

  if (!state.isSupported) {
    return (
      <div className={clsx('p-4 bg-yellow-50 border border-yellow-200 rounded-lg', className)}>
        <p className="text-yellow-800 text-sm">
          Audio recording is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('w-full space-y-4', className)}>
      <div className="flex items-center gap-4">
        {!state.isRecording ? (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              Start Recording
            </span>
          </button>
        ) : (
          <>
            <button
              onClick={handleStop}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                Stop
              </span>
            </button>

            {state.isPaused ? (
              <button
                onClick={handleResume}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Pause
              </button>
            )}
          </>
        )}

        {showTimer && (
          <div className="text-lg font-mono text-gray-700">
            {formatDuration(elapsedTime)}
            {maxDuration && (
              <span className="text-sm text-gray-500">
                {' '}/ {formatDuration(maxDuration)}
              </span>
            )}
          </div>
        )}
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{state.error.message}</p>
        </div>
      )}

      {showWaveform && state.isRecording && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <canvas
            ref={canvasRef}
            width={600}
            height={100}
            className="w-full h-24 bg-white rounded"
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: state.audioLevel > 0.1 ? '#10b981' : '#d1d5db',
                }}
              />
              <span className="text-sm text-gray-600">Level</span>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${state.audioLevel * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {audioData && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Recording Complete</p>
              <p className="text-xs text-gray-500">
                Duration: {formatDuration(audioData.duration)} • 
                Size: {formatFileSize(audioData.size)}
              </p>
            </div>
            {showDownload && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Download
              </button>
            )}
          </div>
          
          <audio
            controls
            src={audioData.url}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};