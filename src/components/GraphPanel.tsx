import { memo, useCallback, useEffect } from 'react';
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
 * Check if a node should be visible based on collapse state
 * A node is visible if none of its ancestors are collapsed
 */
function isNodeVisible(
  nodePath: JsonPath,
  collapsedNodes: Set<string>
): boolean {
  // Check each ancestor in the path
  for (let i = 0; i < nodePath.length; i++) {
    const ancestorPath = nodePath.slice(0, i + 1);
    const ancestorId = `node-${ancestorPath.map((p) =>
      String(p).replace(/[^a-zA-Z0-9]/g, '_')
    ).join('-')}`;

    if (collapsedNodes.has(ancestorId)) {
      return false;
    }
  }
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

  // Filter nodes and edges based on collapse state
  useEffect(() => {
    // Update collapse state in node data
    const nodesWithCollapseState = updateNodeCollapseState(
      storeNodes,
      collapsedNodes
    );

    // Filter visible nodes (not descendants of collapsed nodes)
    const visibleNodes = nodesWithCollapseState.filter((node) => {
      const data = node.data as JsonNodeData;
      return isNodeVisible(data.path, collapsedNodes);
    });

    // Get visible node IDs
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

    // Filter edges to only those between visible nodes
    const visibleEdges = storeEdges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );

    // Add theme to node data
    const nodesWithTheme = visibleNodes.map((node) => ({
      ...node,
      type: 'jsonNode' as const,
      data: {
        ...node.data,
        effectiveTheme,
      },
    }));

    setNodes(nodesWithTheme as JsonNodeType[]);
    setEdges(visibleEdges);
  }, [
    storeNodes,
    storeEdges,
    collapsedNodes,
    setNodes,
    setEdges,
    effectiveTheme,
  ]);

  const colors = getThemeColors(effectiveTheme === 'dark');

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
