export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let lastCallTime: number | null = null;
  
  const leading = options?.leading ?? false;
  const trailing = options?.trailing ?? true;

  const later = () => {
    const last = Date.now() - (lastCallTime || 0);
    
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (trailing && lastArgs) {
        func.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
      }
    }
  };

  return function debounced(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    lastCallTime = Date.now();
    
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (leading) {
        func.apply(this, args);
      }
    }
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; trailing?: boolean }
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  let lastCallTime = 0;
  
  const leading = options?.leading ?? true;
  const trailing = options?.trailing ?? true;

  const later = () => {
    lastCallTime = leading === false ? 0 : Date.now();
    timeout = null;
    if (lastArgs) {
      func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }
  };

  return function throttled(this: any, ...args: Parameters<T>) {
    const now = Date.now();
    
    if (!lastCallTime && leading === false) {
      lastCallTime = now;
    }
    
    const remaining = wait - (now - lastCallTime);
    
    lastArgs = args;
    lastThis = this;
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCallTime = now;
      func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(later, remaining);
    }
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function animationFrame(): Promise<number> {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

export function nextTick(): Promise<void> {
  return Promise.resolve();
}

export function timeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(errorMessage || `Timeout after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

export function retry<T>(
  fn: () => Promise<T>,
  options?: {
    attempts?: number;
    delay?: number;
    backoff?: boolean;
    onError?: (error: Error, attempt: number) => void;
  }
): Promise<T> {
  const attempts = options?.attempts ?? 3;
  const delayMs = options?.delay ?? 1000;
  const backoff = options?.backoff ?? true;
  const onError = options?.onError;

  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < attempts; i++) {
      try {
        const result = await fn();
        resolve(result);
        return;
      } catch (error) {
        const err = error as Error;
        
        if (onError) {
          onError(err, i + 1);
        }
        
        if (i === attempts - 1) {
          reject(err);
          return;
        }
        
        const waitTime = backoff ? delayMs * Math.pow(2, i) : delayMs;
        await delay(waitTime);
      }
    }
  });
}

export class Timer {
  private startTime: number = 0;
  private pausedTime: number = 0;
  private isPaused: boolean = false;

  start(): void {
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.isPaused = false;
  }

  pause(): void {
    if (!this.isPaused && this.startTime) {
      this.pausedTime += Date.now() - this.startTime;
      this.isPaused = true;
    }
  }

  resume(): void {
    if (this.isPaused) {
      this.startTime = Date.now();
      this.isPaused = false;
    }
  }

  getElapsed(): number {
    if (!this.startTime) return 0;
    
    if (this.isPaused) {
      return this.pausedTime;
    }
    
    return this.pausedTime + (Date.now() - this.startTime);
  }

  reset(): void {
    this.startTime = 0;
    this.pausedTime = 0;
    this.isPaused = false;
  }
}