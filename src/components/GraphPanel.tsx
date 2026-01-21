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
import { JsonNodeData } from '../types';

interface GraphPanelProps {
  effectiveTheme: 'light' | 'dark';
}

const nodeTypes: NodeTypes = {
  jsonNode: JsonNode,
};

export const GraphPanel = memo<GraphPanelProps>(({ effectiveTheme }) => {
  const { nodes: storeNodes, edges: storeEdges, selectNode } = useGraphStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Update nodes and edges when store changes
  useEffect(() => {
    const nodesWithTheme = storeNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        effectiveTheme,
      },
    }));
    setNodes(nodesWithTheme);
    setEdges(storeEdges);
  }, [storeNodes, storeEdges, setNodes, setEdges, effectiveTheme]);

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
