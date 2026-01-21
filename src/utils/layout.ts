import dagre from '@dagrejs/dagre';
import { JsonNode, JsonEdge, DAGRE_CONFIG } from '../types';

/**
 * Apply dagre layout to graph nodes
 */
export function applyLayout(nodes: JsonNode[], edges: JsonEdge[]): JsonNode[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: DAGRE_CONFIG.rankdir,
    nodesep: DAGRE_CONFIG.nodesep,
    ranksep: DAGRE_CONFIG.ranksep,
    edgesep: DAGRE_CONFIG.edgesep,
    marginx: DAGRE_CONFIG.marginx,
    marginy: DAGRE_CONFIG.marginy,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to graph with dimensions
  nodes.forEach((node) => {
    const width = 150; // Default width (could be calculated from node data)
    const height = 40; // Default height
    g.setNode(node.id, { width, height });
  });

  // Add edges to graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(g);

  // Apply positions to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    } as JsonNode;
  });

  return layoutedNodes;
}
