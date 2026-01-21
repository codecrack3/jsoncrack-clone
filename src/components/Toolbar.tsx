import { memo } from 'react';
import { useConfigStore } from '../stores/useConfigStore';
import { Theme } from '../types';

export const Toolbar = memo(() => {
  const { theme, effectiveTheme, setTheme } = useConfigStore();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="h-12 border-b flex items-center justify-between px-4 bg-background-secondary">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold">JSON Visualizer</h1>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary">Theme:</span>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value as Theme)}
          className="px-3 py-1 rounded border bg-background text-text border-gray-300 dark:border-gray-600"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <span className="text-xs text-secondary">
          ({effectiveTheme})
        </span>
      </div>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';
