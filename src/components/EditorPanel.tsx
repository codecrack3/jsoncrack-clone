import { memo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useJsonStore } from '../stores/useJsonStore';
import { getSizeCategory } from '../utils/storage';
import { DEBOUNCE_CONFIG } from '../types';

interface EditorPanelProps {
  onValidationMarkers: (markers: unknown[]) => void;
}

export const EditorPanel = memo<EditorPanelProps>(({ onValidationMarkers }) => {
  const { json, setJson, saveToStorage } = useJsonStore();

  useEffect(() => {
    // Save to localStorage whenever JSON changes
    const sizeCategory = getSizeCategory(json);
    const debounceTime =
      sizeCategory === 'small'
        ? DEBOUNCE_CONFIG.TYPING_DEBOUNCE_SMALL
        : sizeCategory === 'medium'
          ? DEBOUNCE_CONFIG.TYPING_DEBOUNCE_MEDIUM
          : DEBOUNCE_CONFIG.TYPING_DEBOUNCE_LARGE;

    const timer = setTimeout(() => {
      saveToStorage();
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [json, saveToStorage]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setJson(value);
    }
  };

  const handleValidate = (markers: unknown[]) => {
    onValidationMarkers(markers);
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="json"
        value={json}
        onChange={handleEditorChange}
        onValidate={handleValidate}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          automaticLayout: true,
          formatOnPaste: true,
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
});

EditorPanel.displayName = 'EditorPanel';
