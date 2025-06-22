export function getBrowserName(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'safari';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'opera';
  
  return 'unknown';
}

export function isChrome(): boolean {
  return getBrowserName() === 'chrome';
}

export function isFirefox(): boolean {
  return getBrowserName() === 'firefox';
}

export function isSafari(): boolean {
  return getBrowserName() === 'safari';
}

export function isEdge(): boolean {
  return getBrowserName() === 'edge';
}

export function isOpera(): boolean {
  return getBrowserName() === 'opera';
}

export function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
}

export function supportsAVIF(): boolean {
  if (typeof document === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  
  return canvas.toDataURL('image/avif').indexOf('image/avif') === 0;
}

export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

export function getScreenSize(): { width: number; height: number } {
  if (typeof screen === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: screen.width,
    height: screen.height,
  };
}

export function getDevicePixelRatio(): number {
  return typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
}

export function isRetina(): boolean {
  return getDevicePixelRatio() > 1;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

export function prefersColorScheme(): 'light' | 'dark' | 'no-preference' {
  if (typeof window === 'undefined') return 'no-preference';
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return 'no-preference';
}