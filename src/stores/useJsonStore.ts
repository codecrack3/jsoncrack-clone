import { create } from 'zustand';
import { STORAGE_KEYS } from '../types';

interface JsonState {
  json: string;
  isValid: boolean;
  error: string | null;
  setJson: (json: string) => void;
  setIsValid: (isValid: boolean) => void;
  setError: (error: string | null) => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const DEFAULT_JSON = `{
  "name": "JSON Visualizer",
  "version": "1.0.0",
  "features": ["graph", "editor", "themes"]
}`;

export const useJsonStore = create<JsonState>((set, get) => ({
  json: DEFAULT_JSON,
  isValid: true,
  error: null,

  setJson: (json: string) => {
    set({ json });
  },

  setIsValid: (isValid: boolean) => {
    set({ isValid });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  saveToStorage: () => {
    const { json } = get();
    localStorage.setItem(STORAGE_KEYS.JSON_CONTENT, json);
  },

  loadFromStorage: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.JSON_CONTENT);
    if (saved) {
      set({ json: saved });
    }
  },
}));
