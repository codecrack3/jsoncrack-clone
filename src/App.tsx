import { useEffect, useState, useCallback, useRef } from 'react';
import type { ParseError } from 'jsonc-parser';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { useJsonStore } from './stores/useJsonStore';
import { useGraphStore } from './stores/useGraphStore';
import { useConfigStore } from './stores/useConfigStore';
import { Toolbar } from './components/Toolbar';
import { EditorPanel } from './components/EditorPanel';
import { GraphPanel } from './components/GraphPanel';
import { SizeWarning } from './components/SizeWarning';
import { createValidationMarkers } from './utils/validation';
import { checkSizeLimit, formatSize, getSizeCategory } from './utils/storage';
import { DEBOUNCE_CONFIG, MAX_SIZE_BYTES } from './types';
import type { JsonEdge, JsonNode, JsonPath } from './types';

type WorkerResponse = {
  id: number;
  nodes?: JsonNode[];
  edges?: JsonEdge[];
  errors?: ParseError[];
};

function App() {
  const { json, setIsValid, setError, loadFromStorage } = useJsonStore();
  const { setGraph, reset: resetGraph, toggleCollapse } = useGraphStore();
  const { effectiveTheme, applyTheme } = useConfigStore();
  const [jsonSize, setJsonSize] = useState(0);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const latestJsonRef = useRef(json);

  // Initialize theme and load saved data
  useEffect(() => {
    applyTheme();
    loadFromStorage();
  }, [applyTheme, loadFromStorage]);

  useEffect(() => {
    latestJsonRef.current = json;
  }, [json]);

  useEffect(() => {
    const worker = new Worker(
      new URL('./workers/jsonGraphWorker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, nodes, edges, errors } = event.data;
      if (id !== requestIdRef.current) {
        return;
      }

      if (errors && errors.length > 0) {
        createValidationMarkers(errors, latestJsonRef.current);
        setIsValid(false);
        setError(errors[0].error.toString());
        return;
      }

      if (nodes && edges) {
        setIsValid(true);
        setError(null);
        setGraph(nodes, edges);
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [setGraph, setIsValid, setError]);

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
      requestIdRef.current += 1;
      const requestId = requestIdRef.current;

      // Hard limit - block rendering
      if (!checkSizeLimit(json)) {
        resetGraph();
        setIsValid(false);
        setError(`JSON too large (${formatSize(sizeBytes)}). Maximum size is ${formatSize(MAX_SIZE_BYTES)}.`);
        return;
      }

      const worker = workerRef.current;
      if (!worker) {
        return;
      }

      worker.postMessage({ id: requestId, json });
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [json, resetGraph, setIsValid, setError]);

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

  const handleValidationMarkers = useCallback(() => {
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
