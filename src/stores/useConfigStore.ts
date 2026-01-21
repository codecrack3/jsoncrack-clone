import { create } from 'zustand';
import { Theme, STORAGE_KEYS } from '../types';

interface ConfigState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  theme: 'system',
  effectiveTheme: getSystemTheme(),

  setTheme: (theme: Theme) => {
    set({ theme });
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    get().applyTheme();
  },

  applyTheme: () => {
    const { theme } = get();
    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    set({ effectiveTheme });

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', effectiveTheme === 'dark');
    }
  },
}));
