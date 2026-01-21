import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { JsonNodeData } from '../types';
import { getThemeColors } from '../utils/theme';

interface JsonNodeProps {
  data: JsonNodeData;
  selected?: boolean;
}

export const JsonNode = memo<JsonNodeProps>(({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false);
  const effectiveTheme = data.effectiveTheme === 'dark';
  const colors = getThemeColors(effectiveTheme);
  const typeColors = colors.nodeColors[data.nodeType];

  // Check if node is collapsible (object or array with children)
  const isCollapsible = data.childCount !== undefined && data.childCount > 0;
  const isCollapsed = data.collapsed;

  // Determine node content based on type
  const getNodeContent = () => {
    if (data.value) {
      // Primitive type - show value
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{data.label}:</span>
          <span className="font-mono text-sm">{data.value}</span>
        </div>
      );
    } else if (data.childCount !== undefined) {
      // Object or array - show type and child count
      const typeSymbol = data.nodeType === 'array' ? '[ ]' : '{ }';
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{data.label}</span>
          <span className="text-xs opacity-75">
            {typeSymbol} {data.childCount}
          </span>
        </div>
      );
    }
    return <span className="font-semibold">{data.label}</span>;
  };

  // Handle collapse toggle
  const handleCollapseToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Will be handled by parent via event bubbling or callback
    const event = new CustomEvent('node-collapse-toggle', {
      detail: { path: data.path },
      bubbles: true,
    });
    (e.currentTarget as HTMLElement).dispatchEvent(event);
  };

  // Handle double-click on node body
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isCollapsible) {
      handleCollapseToggle(e);
    }
  };

  return (
    <div
      className={`
        px-4 py-2 rounded-md border-2 shadow-sm transition-all
        ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
        ${isCollapsed ? 'border-dashed' : ''}
        ${isCollapsible ? 'cursor-pointer' : ''}
      `}
      style={{
        backgroundColor: typeColors.bg,
        borderColor: typeColors.border,
        color: typeColors.text,
        minWidth: '120px',
        maxWidth: '300px',
      }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !border-gray-600"
      />

      {/* Node content with collapse toggle */}
      <div className="text-sm flex items-center gap-2">
        {/* Collapse toggle button for objects/arrays */}
        {isCollapsible && (
          <button
            onClick={handleCollapseToggle}
            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            style={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? 'rotate-0' : 'rotate-90'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Node content */}
        <div className="flex-1">{getNodeContent()}</div>
      </div>

      {/* Output handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !border-gray-600"
      />
    </div>
  );
});

JsonNode.displayName = 'JsonNode';
