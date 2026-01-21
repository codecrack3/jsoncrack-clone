import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  NodeTypes,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { JsonNode } from './JsonNode';
import { useGraphStore } from '../stores/useGraphStore';
import { getThemeColors } from '../utils/theme';
import { JsonNodeData, JsonPath, JsonNode as JsonNodeType } from '../types';

interface GraphPanelProps {
  effectiveTheme: 'light' | 'dark';
}

const nodeTypes: NodeTypes = {
  jsonNode: JsonNode,
};

/**
 * Generate node ID from path (cached version)
 */
function generateNodeId(path: JsonPath): string {
  if (path.length === 0) return 'node-root';
  return `node-${path.map((p) => String(p).replace(/[^a-zA-Z0-9]/g, '_')).join('-')}`;
}

/**
 * Check if a node should be visible based on collapse state
 * A node is visible if none of its ancestors are collapsed
 * Uses memoization to avoid repeated path traversals
 */
function isNodeVisible(
  nodePath: JsonPath,
  collapsedNodes: Set<string>,
  visibilityCache: Map<string, boolean>
): boolean {
  // Check cache first
  const cacheKey = nodePath.join('.');
  if (visibilityCache.has(cacheKey)) {
    return visibilityCache.get(cacheKey)!;
  }

  // Check each ancestor in the path
  for (let i = 0; i < nodePath.length; i++) {
    const ancestorPath = nodePath.slice(0, i + 1);
    const ancestorId = generateNodeId(ancestorPath);

    if (collapsedNodes.has(ancestorId)) {
      visibilityCache.set(cacheKey, false);
      return false;
    }
  }

  visibilityCache.set(cacheKey, true);
  return true;
}

/**
 * Update collapse state in nodes based on store
 */
function updateNodeCollapseState(
  nodes: Node[],
  collapsedNodes: Set<string>
): Node[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      collapsed: collapsedNodes.has(node.id),
    },
  }));
}

export const GraphPanel = memo<GraphPanelProps>(({ effectiveTheme }) => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    selectNode,
    collapsedNodes,
  } = useGraphStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Cache for visibility checks to avoid repeated path traversals
  const visibilityCacheRef = useRef<Map<string, boolean>>(new Map());

  // Clear cache when collapsed nodes change significantly
  useEffect(() => {
    if (collapsedNodes.size === 0) {
      visibilityCacheRef.current.clear();
    }
  }, [collapsedNodes.size]);

  // Memoize colors to avoid recalculation
  const colors = useMemo(
    () => getThemeColors(effectiveTheme === 'dark'),
    [effectiveTheme]
  );

  // Memoize expensive graph computations
  const { nodesWithTheme, visibleEdges } = useMemo(() => {
    // Update collapse state in node data
    const nodesWithCollapseState = updateNodeCollapseState(
      storeNodes,
      collapsedNodes
    );

    // Use fresh cache for this computation
    const cache = new Map<string, boolean>();

    // Filter visible nodes (not descendants of collapsed nodes)
    const visibleNodes = nodesWithCollapseState.filter((node) => {
      const data = node.data as JsonNodeData;
      return isNodeVisible(data.path, collapsedNodes, cache);
    });

    // Get visible node IDs
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

    // Filter edges to only those between visible nodes
    const filteredEdges = storeEdges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // Add theme to node data
    const themedNodes = visibleNodes.map((node) => ({
      ...node,
      type: 'jsonNode' as const,
      data: {
        ...node.data,
        effectiveTheme,
      },
    }));

    return {
      nodesWithTheme: themedNodes as JsonNodeType[],
      visibleEdges: filteredEdges,
    };
  }, [storeNodes, storeEdges, collapsedNodes, effectiveTheme]);

  // Update nodes and edges only when computed values change
  useEffect(() => {
    // Use requestAnimationFrame for smooth rendering
    const rafId = requestAnimationFrame(() => {
      setNodes(nodesWithTheme);
      setEdges(visibleEdges);
    });

    return () => cancelAnimationFrame(rafId);
  }, [nodesWithTheme, visibleEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: unknown, node: Node) => {
      const data = node.data as JsonNodeData;
      selectNode(data.path.join('.') || 'root');
    },
    [selectNode]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color={colors.graphGrid}
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as JsonNodeData;
            return colors.nodeColors[data.nodeType].border;
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
});

GraphPanel.displayName = 'GraphPanel';
