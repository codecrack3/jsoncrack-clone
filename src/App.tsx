import { useEffect, useState, useCallback } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { useJsonStore } from './stores/useJsonStore';
import { useGraphStore } from './stores/useGraphStore';
import { useConfigStore } from './stores/useConfigStore';
import { Toolbar } from './components/Toolbar';
import { EditorPanel } from './components/EditorPanel';
import { GraphPanel } from './components/GraphPanel';
import { SizeWarning } from './components/SizeWarning';
import { transformJsonToGraph, validateJson } from './utils/parser';
import { applyLayout } from './utils/layout';
import { createValidationMarkers } from './utils/validation';
import { checkSizeLimit, formatSize, getSizeCategory } from './utils/storage';
import { DEBOUNCE_CONFIG, JsonPath, MAX_SIZE_BYTES } from './types';

function App() {
  const { json, setIsValid, setError, loadFromStorage } = useJsonStore();
  const { setGraph, reset: resetGraph, toggleCollapse } = useGraphStore();
  const { effectiveTheme, applyTheme } = useConfigStore();
  const [jsonSize, setJsonSize] = useState(0);

  // Initialize theme and load saved data
  useEffect(() => {
    applyTheme();
    loadFromStorage();
  }, [applyTheme, loadFromStorage]);

  // Update graph when JSON changes (debounced based on file size)
  useEffect(() => {
    // Calculate debounce based on current JSON size
    const sizeCategory = getSizeCategory(json);
    const debounceTime =
      sizeCategory === 'small'
        ? DEBOUNCE_CONFIG.TYPING_DEBOUNCE_SMALL
        : sizeCategory === 'medium'
          ? DEBOUNCE_CONFIG.TYPING_DEBOUNCE_MEDIUM
          : DEBOUNCE_CONFIG.TYPING_DEBOUNCE_LARGE;

    const handler = setTimeout(() => {
      const sizeBytes = new Blob([json]).size;
      setJsonSize(sizeBytes);

      // Hard limit - block rendering
      if (!checkSizeLimit(json)) {
        resetGraph();
        setIsValid(false);
        setError(`JSON too large (${formatSize(sizeBytes)}). Maximum size is ${formatSize(MAX_SIZE_BYTES)}.`);
        return;
      }

      // Validate JSON
      const errors = validateJson(json);

      if (errors.length > 0) {
        // Invalid JSON - show error markers, keep last valid graph
        createValidationMarkers(errors, json);
        setIsValid(false);
        setError(errors[0].error.toString());
        return;
      }

      // Valid JSON - clear errors, update graph
      setIsValid(true);
      setError(null);

      // Transform JSON to graph
      const { nodes, edges } = transformJsonToGraph(json);

      // Apply layout
      const layoutedNodes = applyLayout(nodes, edges);

      // Update graph store
      setGraph(layoutedNodes, edges);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [json, resetGraph, setGraph, setIsValid, setError]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme]);

  // Listen for collapse toggle events from nodes
  useEffect(() => {
    const handleCollapseToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: JsonPath }>;
      if (customEvent.detail && customEvent.detail.path) {
        // Generate node ID from path
        const path = customEvent.detail.path;
        const nodeId =
          path.length === 0
            ? 'node-root'
            : `node-${path.map((p) => String(p).replace(/[^a-zA-Z0-9]/g, '_')).join('-')}`;
        toggleCollapse(nodeId);
      }
    };

    // Add event listener to document
    document.addEventListener('node-collapse-toggle', handleCollapseToggle);

    return () => {
      document.removeEventListener('node-collapse-toggle', handleCollapseToggle);
    };
  }, [toggleCollapse]);

  const handleValidationMarkers = useCallback((_markers: unknown[]) => {
    // Monaco's onValidate provides markers, but we also validate ourselves
    // Combine both sources if needed
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-text">
      <Toolbar />

      <div className="flex-1 relative">
        <SizeWarning size={jsonSize} />

        <Allotment defaultSizes={[40, 60]}>
          <Allotment.Pane minSize={200}>
            <EditorPanel onValidationMarkers={handleValidationMarkers} />
          </Allotment.Pane>
          <Allotment.Pane minSize={400}>
            <GraphPanel effectiveTheme={effectiveTheme} />
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
}

export default App;
