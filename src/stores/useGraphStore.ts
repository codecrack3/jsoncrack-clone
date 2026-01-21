import { create } from 'zustand';
import { JsonNode, JsonEdge } from '../types';

interface GraphState {
  nodes: JsonNode[];
  edges: JsonEdge[];
  selectedNodeId: string | null;
  collapsedNodes: Set<string>;
  setGraph: (nodes: JsonNode[], edges: JsonEdge[]) => void;
  selectNode: (id: string | null) => void;
  toggleCollapse: (id: string) => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  collapsedNodes: new Set<string>(),

  setGraph: (nodes: JsonNode[], edges: JsonEdge[]) => {
    set({ nodes, edges });
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  toggleCollapse: (id: string) => {
    set((state) => {
      const newCollapsed = new Set(state.collapsedNodes);
      if (newCollapsed.has(id)) {
        newCollapsed.delete(id);
      } else {
        newCollapsed.add(id);
      }
      return { collapsedNodes: newCollapsed };
    });
  },

  reset: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      collapsedNodes: new Set<string>(),
    });
  },
}));
