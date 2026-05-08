import { Handle, Position } from 'reactflow';
import type { TechTool } from '@/lib/tools-data';

export default function ArchitectureNode({ data, isConnectable, selected }: any) {
  const { tool, isValid, reason } = data as { tool: TechTool; isValid: boolean; reason?: string };

  const borderColor = !isValid ? '#f43f5e' : selected ? tool.color : `${tool.color}40`
  const glowColor = !isValid ? 'rgba(244,63,94,0.4)' : selected ? `${tool.color}40` : 'transparent'

  return (
    <div style={{
      background: tool.bg || 'rgba(26,23,48,0.8)',
      backdropFilter: 'blur(8px)',
      padding: '10px 14px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '160px',
      maxWidth: '220px',
      border: `1px solid ${borderColor}`,
      boxShadow: selected
        ? `0 0 0 2px ${tool.color}60, 0 8px 24px ${glowColor}`
        : !isValid
        ? `0 0 16px rgba(244,63,94,0.5)`
        : '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.2s',
      position: 'relative',
    }}>
      {/* Input handle */}
      {tool.category !== 'frontend' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: tool.color, border: '2px solid #eef3f4', width: '10px', height: '10px', top: '-5px' }}
        />
      )}
      {tool.category !== 'frontend' && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ background: tool.color, border: '2px solid #eef3f4', width: '10px', height: '10px', left: '-5px' }}
        />
      )}

      {/* Icon */}
      <div style={{
        width: '34px', height: '34px', flexShrink: 0,
        background: `${tool.color}15`,
        border: `1px solid ${tool.color}30`,
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: typeof tool.emoji === 'string' && tool.emoji.length <= 2 ? '14px' : '18px',
        fontWeight: 900, color: tool.color,
      }}>
        {tool.emoji}
      </div>

      {/* Labels */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '8px', color: `${tool.color}aa`, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
          {tool.category}
        </div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700, color: '#172326', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tool.name}
        </div>
        {tool.costPerMonth && (
          <div style={{ fontSize: '10px', color: tool.costPerMonth === '$0' ? '#10b981' : '#f97316', fontFamily: 'DM Mono, monospace', marginTop: '2px' }}>
            {tool.costPerMonth}/mo
          </div>
        )}
      </div>

      {/* Conflict indicator */}
      {!isValid && (
        <div
          title={reason || 'Incompatible with AI stack'}
          style={{
            position: 'absolute', top: '-6px', right: '-6px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#f43f5e', border: '2px solid #eef3f4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '8px', color: '#fff', fontWeight: 900
          }}
        >!</div>
      )}

      {/* Output handle */}
      {tool.category !== 'deployment' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ background: tool.color, border: '2px solid #eef3f4', width: '10px', height: '10px', bottom: '-5px' }}
        />
      )}
      {tool.category !== 'deployment' && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ background: tool.color, border: '2px solid #eef3f4', width: '10px', height: '10px', right: '-5px' }}
        />
      )}
    </div>
  );
}
