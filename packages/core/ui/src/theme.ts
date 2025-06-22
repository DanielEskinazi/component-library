export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  storageKey?: string;
  defaultTheme?: Theme;
  attribute?: string;
  class?: string;
}

const DEFAULT_CONFIG: Required<ThemeConfig> = {
  storageKey: 'theme',
  defaultTheme: 'system',
  attribute: 'data-theme',
  class: '',
};

export class ThemeManager {
  private config: Required<ThemeConfig>;
  private listeners: Set<(theme: Theme) => void>;
  private mediaQuery: MediaQueryList | null;

  constructor(config?: ThemeConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.listeners = new Set();
    this.mediaQuery = null;
    
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.initialize();
    }
  }

  private initialize(): void {
    const savedTheme = this.getSavedTheme();
    this.setTheme(savedTheme || this.config.defaultTheme);
    
    if (this.mediaQuery) {
      this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
    }
  }

  private handleSystemThemeChange = (): void => {
    const currentTheme = this.getTheme();
    if (currentTheme === 'system') {
      this.applyTheme('system');
    }
  };

  private getSavedTheme(): Theme | null {
    if (typeof localStorage === 'undefined') return null;
    
    const saved = localStorage.getItem(this.config.storageKey);
    return saved as Theme | null;
  }

  private saveTheme(theme: Theme): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.config.storageKey, theme);
    }
  }

  private getSystemTheme(): 'light' | 'dark' {
    if (this.mediaQuery?.matches) {
      return 'dark';
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    const resolvedTheme = theme === 'system' ? this.getSystemTheme() : theme;
    
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      if (this.config.attribute) {
        root.setAttribute(this.config.attribute, resolvedTheme);
      }
      
      if (this.config.class) {
        root.classList.remove(`${this.config.class}-light`, `${this.config.class}-dark`);
        root.classList.add(`${this.config.class}-${resolvedTheme}`);
      }
    }
    
    this.notifyListeners(theme);
  }

  setTheme(theme: Theme): void {
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  getTheme(): Theme {
    return this.getSavedTheme() || this.config.defaultTheme;
  }

  getResolvedTheme(): 'light' | 'dark' {
    const theme = this.getTheme();
    return theme === 'system' ? this.getSystemTheme() : theme;
  }

  toggleTheme(): void {
    const current = this.getTheme();
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  cycleTheme(themes: Theme[] = ['light', 'dark']): void {
    const current = this.getTheme();
    const currentIndex = themes.indexOf(current);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  onChange(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(callback => callback(theme));
  }

  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
    this.listeners.clear();
  }
}

export function getPreferredColorScheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function watchColorScheme(callback: (scheme: 'light' | 'dark') => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };
  
  mediaQuery.addEventListener('change', handler);
  
  callback(mediaQuery.matches ? 'dark' : 'light');
  
  return () => mediaQuery.removeEventListener('change', handler);
}