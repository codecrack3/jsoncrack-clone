# Technology Research

## React Flow for Graph Visualization

### Why React Flow
- Well-documented, active community (1113 code snippets in docs)
- Native React integration
- Built-in pan, zoom, minimap
- Custom node/edge support
- Good TypeScript support

### Layout with Dagre

React Flow doesn't include auto-layout. Use **dagre** for hierarchical tree layout.

```typescript
import dagre from '@dagrejs/dagre';

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isHorizontal = direction === 'LR';

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};
```

### Key React Flow Features

```typescript
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';

// Custom node types
const nodeTypes = {
  jsonNode: JsonNodeComponent,
};

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  fitView
  panOnDrag
  zoomOnScroll
>
  <Background />
  <Controls />
</ReactFlow>
```

---

## Monaco Editor React Integration

### Installation
```bash
npm install @monaco-editor/react
```

### Basic Usage with JSON Validation

```typescript
import Editor from '@monaco-editor/react';

function JsonEditor({ value, onChange, onValidate }) {
  return (
    <Editor
      height="100%"
      language="json"
      value={value}
      onChange={onChange}
      onValidate={(markers) => {
        // markers: array of validation errors
        if (markers.length > 0) {
          onValidate(markers);
        }
      }}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
        formatOnPaste: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}
```

### Validation Markers

```typescript
interface IMarker {
  severity: number;  // 8 = Error, 4 = Warning
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}
```

---

## JSON Parsing with jsonc-parser

### Why jsonc-parser
- Supports JSON with comments
- Provides AST with location info
- Tracks paths through the document
- Used by VS Code itself

### Usage

```typescript
import { parseTree, Node, JSONPath } from 'jsonc-parser';

const ast = parseTree(jsonString);

// Traverse AST
function traverse(node: Node, path: JSONPath = []) {
  switch (node.type) {
    case 'object':
      node.children?.forEach((property) => {
        const key = property.children?.[0].value;
        const value = property.children?.[1];
        traverse(value, [...path, key]);
      });
      break;
    case 'array':
      node.children?.forEach((item, index) => {
        traverse(item, [...path, index]);
      });
      break;
    case 'string':
    case 'number':
    case 'boolean':
    case 'null':
      // Leaf node
      break;
  }
}
```

---

## State Management with Zustand

### Why Zustand
- Minimal boilerplate
- No context providers needed
- Good TypeScript support
- Easy to split stores

### Store Pattern

```typescript
import { create } from 'zustand';

interface JsonStore {
  json: string;
  setJson: (json: string) => void;
}

export const useJsonStore = create<JsonStore>((set) => ({
  json: '{}',
  setJson: (json) => set({ json }),
}));

interface GraphStore {
  nodes: Node[];
  edges: Edge[];
  setGraph: (nodes: Node[], edges: Edge[]) => void;
}

export const useGraphStore = create<GraphStore>((set) => ({
  nodes: [],
  edges: [],
  setGraph: (nodes, edges) => set({ nodes, edges }),
}));
```

---

## Split Pane with Allotment

### Installation
```bash
npm install allotment
```

### Usage

```typescript
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

function App() {
  return (
    <Allotment>
      <Allotment.Pane minSize={200}>
        <EditorPanel />
      </Allotment.Pane>
      <Allotment.Pane>
        <GraphPanel />
      </Allotment.Pane>
    </Allotment>
  );
}
```

---

## Dark Mode with Tailwind

### Setup

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  // ...
}
```

### Implementation

```typescript
// useTheme hook
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') };
}
```

---

## Recommended Package List

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "@xyflow/react": "^12.x",
    "@monaco-editor/react": "^4.x",
    "@dagrejs/dagre": "^1.x",
    "jsonc-parser": "^3.x",
    "zustand": "^4.x",
    "allotment": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^3.x",
    "typescript": "^5.x"
  }
}
```
