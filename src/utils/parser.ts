import { parseTree, Node as ASTNode, ParseError } from 'jsonc-parser';
import { JsonNode, JsonEdge, JsonPath, JsonNodeType, NODE_CONFIG } from '../types';

/**
 * Format a primitive value for display
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

/**
 * Truncate value to max display length
 */
function truncateValue(value: string): string {
  const { MAX_DISPLAY_LENGTH } = NODE_CONFIG;
  if (value.length <= MAX_DISPLAY_LENGTH) return value;
  return value.slice(0, MAX_DISPLAY_LENGTH - 3) + '...';
}

/**
 * Generate a stable node ID from a JSON path with caching
 */
const nodeIdCache = new Map<string, string>();

function generateNodeId(path: JsonPath): string {
  if (path.length === 0) return 'node-root';

  const cacheKey = path.join('.');
  if (nodeIdCache.has(cacheKey)) {
    return nodeIdCache.get(cacheKey)!;
  }

  const id = `node-${path.map((p) => String(p).replace(/[^a-zA-Z0-9]/g, '_')).join('-')}`;
  nodeIdCache.set(cacheKey, id);
  return id;
}

/**
 * Calculate node dimensions based on content
 */
function calculateNodeWidth(label: string, value?: string): number {
  const { MIN_WIDTH, MAX_WIDTH, PADDING_X, CHAR_WIDTH } = NODE_CONFIG;

  const labelWidth = label.length * CHAR_WIDTH;
  const valueWidth = (value?.length ?? 0) * CHAR_WIDTH;
  const contentWidth = Math.max(labelWidth, valueWidth) + PADDING_X * 2;

  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, contentWidth));
}

/**
 * Transform JSON AST to graph nodes and edges
 */
export function transformAstToGraph(ast: ASTNode): { nodes: JsonNode[]; edges: JsonEdge[] } {
  // Clear cache for fresh parsing
  nodeIdCache.clear();

  const nodes: JsonNode[] = [];
  const edges: JsonEdge[] = [];

  function traverse(
    astNode: ASTNode,
    parentId: string | null,
    key: string | null,
    path: JsonPath
  ) {
    const id = generateNodeId(path);
    const nodeType = astNode.type as JsonNodeType;

    // Determine label and display value
    let label: string;
    let displayValue: string | undefined;

    if (key !== null) {
      label = key;
    } else {
      // Root node
      label = nodeType === 'array' ? 'Array' : 'Object';
    }

    // For primitive types, show the value
    if (astNode.type === 'string' || astNode.type === 'number' || astNode.type === 'boolean' || astNode.type === 'null') {
      const rawValue = formatValue(astNode.value);
      displayValue = truncateValue(rawValue);
    }

    // Calculate child count
    const childCount = astNode.children?.length ?? 0;

    // Calculate node dimensions (not used yet, but will be for sizing)
    calculateNodeWidth(label, displayValue);

    // Create graph node
    const graphNode: JsonNode = {
      id,
      type: 'jsonNode',
      position: { x: 0, y: 0 }, // Will be set by layout engine
      data: {
        nodeType,
        label,
        value: displayValue,
        childCount,
        path,
        collapsed: false,
      },
    };

    nodes.push(graphNode);

    // Create edge to parent
    if (parentId) {
      const edge: JsonEdge = {
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
      };
      edges.push(edge);
    }

    // Recurse into children
    if (nodeType === 'object' && astNode.children) {
      astNode.children.forEach((prop) => {
        const propKey = prop.children?.[0].value as string;
        const propValue = prop.children?.[1];
        if (propValue) {
          traverse(propValue, id, propKey, [...path, propKey]);
        }
      });
    } else if (nodeType === 'array' && astNode.children) {
      astNode.children.forEach((item, idx) => {
        traverse(item, id, `[${idx}]`, [...path, idx]);
      });
    }
  }

  traverse(ast, null, null, []);

  return { nodes, edges };
}

/**
 * Transform JSON string to graph nodes and edges
 */
export function transformJsonToGraph(jsonString: string): { nodes: JsonNode[]; edges: JsonEdge[] } {
  const ast = parseTree(jsonString);
  if (!ast) {
    return { nodes: [], edges: [] };
  }

  return transformAstToGraph(ast);
}

/**
 * Validate JSON and return parse errors
 */
export function validateJson(jsonString: string): ParseError[] {
  const errors: ParseError[] = [];
  parseTree(jsonString, errors);
  return errors;
}

/**
 * Get line and column from offset in text
 */
export function offsetToPosition(text: string, offset: number): { line: number; column: number } {
  const lines = text.substring(0, offset).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}
