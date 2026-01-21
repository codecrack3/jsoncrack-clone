import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { JsonNodeData } from '../types';
import { getThemeColors } from '../utils/theme';

interface JsonNodeProps {
  data: JsonNodeData;
  selected?: boolean;
}

export const JsonNode = memo<JsonNodeProps>(({ data, selected }) => {
  const effectiveTheme = data.effectiveTheme === 'dark';
  const colors = getThemeColors(effectiveTheme);
  const typeColors = colors.nodeColors[data.nodeType];

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

  return (
    <div
      className={`
        px-4 py-2 rounded-md border-2 shadow-sm transition-all
        ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
      `}
      style={{
        backgroundColor: typeColors.bg,
        borderColor: typeColors.border,
        color: typeColors.text,
        minWidth: '120px',
        maxWidth: '300px',
      }}
    >
      {/* Input handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !border-gray-600"
      />

      {/* Node content */}
      <div className="text-sm">
        {getNodeContent()}
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
