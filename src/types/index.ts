import { Node, Edge } from '@xyflow/react';

/**
 * JSON path - array of strings (object keys) and numbers (array indices)
 */
export type JsonPath = (string | number)[];

/**
 * JSON node types from jsonc-parser
 */
export type JsonNodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

/**
 * Data for custom JSON node in React Flow
 */
export interface JsonNodeData extends Record<string, unknown> {
  nodeType: JsonNodeType;
  label: string;
  value?: string;
  childCount?: number;
  path: JsonPath;
  collapsed: boolean;
  effectiveTheme?: 'light' | 'dark';
}

/**
 * Custom JSON node for React Flow
 */
export interface JsonNode extends Node {
  id: string;
  type: 'jsonNode';
  position: { x: number; y: number };
  data: JsonNodeData;
}

/**
 * Custom JSON edge for React Flow
 */
export interface JsonEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: 'smoothstep';
}

/**
 * Theme options
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Monaco validation marker
 */
export interface ValidationMarker {
  severity: number;
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  JSON_CONTENT: 'jsoncrack-clone:json',
  THEME: 'jsoncrack-clone:theme',
} as const;

/**
 * Node configuration constants
 */
export const NODE_CONFIG = {
  MIN_WIDTH: 120,
  MAX_WIDTH: 300,
  HEIGHT: 40,
  PADDING_X: 16,
  PADDING_Y: 8,
  CHAR_WIDTH: 7.5,
  FONT_SIZE: 13,
  MAX_DISPLAY_LENGTH: 40,
} as const;

/**
 * Dagre layout configuration
 */
export const DAGRE_CONFIG = {
  rankdir: 'LR' as const,
  nodesep: 30,
  ranksep: 80,
  edgesep: 10,
  marginx: 20,
  marginy: 20,
} as const;

/**
 * Size limits
 */
export const MAX_SIZE_BYTES = 300 * 1024; // 300KB

/**
 * Debounce timing configuration
 */
export const DEBOUNCE_CONFIG = {
  TYPING_DEBOUNCE: 300,
  VALIDATION_DEBOUNCE: 150,
  LAYOUT_DEBOUNCE: 100,
} as const;

/**
 * Monaco severity levels
 */
export const SEVERITY = {
  ERROR: 8,
  WARNING: 4,
  INFO: 2,
} as const;

/**
 * Theme colors
 */
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  graphBackground: string;
  graphGrid: string;
  nodeColors: Record<JsonNodeType, { bg: string; border: string; text: string }>;
  edge: string;
  text: string;
  textSecondary: string;
}
