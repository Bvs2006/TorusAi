import { Handle, Position } from 'reactflow';
import type { TechTool } from '@/lib/tools-data';

// Vibrant color palettes per layer
const LAYER_COLORS: Record<string, { accent: string; bg: string; glow: string; border: string; text: string }> = {
  Frontend: { accent: '#6366f1', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', glow: 'rgba(99,102,241,0.25)', border: '#a5b4fc', text: '#4338ca' },
  Backend:  { accent: '#f59e0b', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', glow: 'rgba(245,158,11,0.25)', border: '#fcd34d', text: '#b45309' },
  Data:     { accent: '#10b981', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', glow: 'rgba(16,185,129,0.25)', border: '#6ee7b7', text: '#047857' },
  DevOps:   { accent: '#ec4899', bg: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', glow: 'rgba(236,72,153,0.25)', border: '#f9a8d4', text: '#be185d' },
  root:     { accent: '#8b5cf6', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', glow: 'rgba(139,92,246,0.25)', border: '#c4b5fd', text: '#6d28d9' },
};

// Category-specific color overrides for more variety
const CATEGORY_COLORS: Record<string, { accent: string; bg: string; glow: string; border: string; text: string }> = {
  frontend:   { accent: '#6366f1', bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', glow: 'rgba(99,102,241,0.25)', border: '#a5b4fc', text: '#4338ca' },
  backend:    { accent: '#f97316', bg: 'linear-gradient(135deg, #fff7ed, #ffedd5)', glow: 'rgba(249,115,22,0.25)', border: '#fdba74', text: '#c2410c' },
  database:   { accent: '#06b6d4', bg: 'linear-gradient(135deg, #ecfeff, #cffafe)', glow: 'rgba(6,182,212,0.25)', border: '#67e8f9', text: '#0e7490' },
  auth:       { accent: '#8b5cf6', bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)', glow: 'rgba(139,92,246,0.25)', border: '#c4b5fd', text: '#6d28d9' },
  ai:         { accent: '#ec4899', bg: 'linear-gradient(135deg, #fdf2f8, #fce7f3)', glow: 'rgba(236,72,153,0.25)', border: '#f9a8d4', text: '#be185d' },
  storage:    { accent: '#f59e0b', bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', glow: 'rgba(245,158,11,0.25)', border: '#fcd34d', text: '#b45309' },
  cdn:        { accent: '#14b8a6', bg: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', glow: 'rgba(20,184,166,0.25)', border: '#5eead4', text: '#0f766e' },
  deployment: { accent: '#10b981', bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', glow: 'rgba(16,185,129,0.25)', border: '#6ee7b7', text: '#047857' },
};

function getNodeColors(tool: TechTool) {
  // First try category, then layer, then fallback
  const cat = tool.category?.toLowerCase();
  if (cat && CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat];
  const layer = (tool as any).layer;
  if (layer && LAYER_COLORS[layer]) return LAYER_COLORS[layer];
  return LAYER_COLORS.root;
}

export default function ArchitectureNode({ data, isConnectable, selected }: any) {
  const { tool, isValid, reason } = data as { tool: TechTool; isValid: boolean; reason?: string };

  const colors = getNodeColors(tool);

  const borderColor = !isValid
    ? '#f43f5e'
    : selected
    ? colors.accent
    : colors.border;

  const boxShadow = selected
    ? `0 0 0 2px ${colors.accent}80, 0 8px 28px ${colors.glow}`
    : !isValid
    ? `0 0 16px rgba(244,63,94,0.5)`
    : `0 2px 8px rgba(0,0,0,0.06), 0 4px 16px ${colors.glow}`;

  return (
    <div style={{
      background: colors.bg,
      backdropFilter: 'blur(12px)',
      padding: '10px 14px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '160px',
      maxWidth: '220px',
      border: `1.5px solid ${borderColor}`,
      boxShadow,
      transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
      position: 'relative',
      cursor: 'pointer',
    }}>
      {/* Input handle */}
      {tool.category !== 'frontend' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: colors.accent, border: '2px solid #fff', width: '10px', height: '10px', top: '-5px' }}
        />
      )}
      {tool.category !== 'frontend' && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ background: colors.accent, border: '2px solid #fff', width: '10px', height: '10px', left: '-5px' }}
        />
      )}

      {/* Icon */}
      <div style={{
        width: '36px', height: '36px', flexShrink: 0,
        background: `${colors.accent}18`,
        border: `1.5px solid ${colors.accent}35`,
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: typeof tool.emoji === 'string' && tool.emoji.length <= 2 ? '15px' : '18px',
        fontWeight: 900, color: colors.accent,
      }}>
        {tool.emoji}
      </div>

      {/* Labels */}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: '8px', color: colors.text, fontFamily: 'DM Mono, monospace',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px',
          fontWeight: 700, opacity: 0.7,
        }}>
          {tool.category}
        </div>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 700,
          color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {tool.name}
        </div>
        {tool.costPerMonth && (
          <div style={{
            fontSize: '10px',
            color: tool.costPerMonth === '$0' ? '#10b981' : '#f97316',
            fontFamily: 'DM Mono, monospace', marginTop: '2px', fontWeight: 600,
          }}>
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
            width: '16px', height: '16px', borderRadius: '50%',
            background: '#f43f5e', border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '8px', color: '#fff', fontWeight: 900,
            boxShadow: '0 2px 6px rgba(244,63,94,0.4)',
          }}
        >!</div>
      )}

      {/* Output handle */}
      {tool.category !== 'deployment' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ background: colors.accent, border: '2px solid #fff', width: '10px', height: '10px', bottom: '-5px' }}
        />
      )}
      {tool.category !== 'deployment' && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ background: colors.accent, border: '2px solid #fff', width: '10px', height: '10px', right: '-5px' }}
        />
      )}
    </div>
  );
}
