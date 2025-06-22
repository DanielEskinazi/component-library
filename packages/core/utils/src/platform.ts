export function isServer(): boolean {
  return typeof window === 'undefined';
}

export function isClient(): boolean {
  return !isServer();
}

export function isBrowser(): boolean {
  return isClient() && typeof document !== 'undefined';
}

export function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

export function isIOS(): boolean {
  if (isServer()) return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isAndroid(): boolean {
  if (isServer()) return false;
  return /Android/.test(navigator.userAgent);
}

export function isMobile(): boolean {
  return isIOS() || isAndroid();
}

export function isMacOS(): boolean {
  if (isServer()) return false;
  return navigator.platform.toLowerCase().includes('mac');
}

export function isWindows(): boolean {
  if (isServer()) return false;
  return navigator.platform.toLowerCase().includes('win');
}

export function isLinux(): boolean {
  if (isServer()) return false;
  return navigator.platform.toLowerCase().includes('linux');
}

export function isTouchDevice(): boolean {
  if (isServer()) return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

export function getPlatform(): string {
  if (isReactNative()) return 'react-native';
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (isMacOS()) return 'macos';
  if (isWindows()) return 'windows';
  if (isLinux()) return 'linux';
  return 'unknown';
}

export function supportsVibration(): boolean {
  return isClient() && 'vibrate' in navigator;
}

export function vibrate(pattern: number | number[]): boolean {
  if (!supportsVibration()) return false;
  return navigator.vibrate(pattern);
}