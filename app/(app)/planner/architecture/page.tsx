'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
const supabase = createClient()
import { StepIndicator, showToast } from '@/components/ui'
import { ArrowRight, Box, Cpu, Settings2, Download, Trash2, MousePointer2, Link2, LayoutDashboard, ImageDown, Info } from 'lucide-react'
import ReactFlow, {
  ReactFlowProvider, addEdge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, MarkerType, useReactFlow, ConnectionMode
} from 'reactflow'
import 'reactflow/dist/style.css'
import ArchitectureNode from '@/components/ArchitectureNode'
import { TECH_TOOLS, CATEGORIES, type TechTool } from '@/lib/tools-data'

const nodeTypes = { techNode: ArchitectureNode }

let id = 0
const getId = () => `dndnode_${id++}`

export default function ArchitectureCanvas() {
  return (
    <ReactFlowProvider>
      <ArchitecturePage />
    </ReactFlowProvider>
  )
}

function ArchitecturePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const { fitView } = useReactFlow()

  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [mode, setMode] = useState<'select' | 'connect'>('select')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    supabase.from('projects').select('*').eq('id', projectId).single()
      .then(({ data }) => { if (data) setProject(data); setLoading(false) })
  }, [projectId])

  const onConnect = useCallback((params: any) =>
    setEdges((eds) => addEdge({
      ...params, animated: true,
      style: { stroke: '#5aa0a4', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#5aa0a4' }
    }, eds)), [])

  const onDragStart = (event: any, tool: TechTool) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(tool))
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback((event: any) => {
    event.preventDefault()
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
    const toolData = event.dataTransfer.getData('application/reactflow')
    if (!toolData || !reactFlowBounds || !reactFlowInstance) return

    const tool: TechTool = JSON.parse(toolData)
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })

    let isValid = true
    let reason = ''
    if (project?.stack) {
      const stackItem = project.stack[tool.category]
      if (stackItem && stackItem.name !== tool.name) {
        isValid = false
        reason = `AI recommended ${stackItem.name} for this layer.`
      }
    }

    const newNode = {
      id: getId(),
      type: 'techNode',
      position,
      data: { tool, isValid, reason },
    }
    setNodes((nds) => nds.concat(newNode))

    const categoryOrder = ['frontend', 'backend', 'database', 'auth', 'ai', 'storage', 'deployment']
    const currentIndex = categoryOrder.indexOf(tool.category)
    if (currentIndex > 0) {
      const prevCategory = categoryOrder[currentIndex - 1]
      setNodes((currentNodes) => {
        const prevNode = currentNodes.find(n => n.data.tool.category === prevCategory)
        if (prevNode) {
          setEdges((eds) => addEdge({
            id: `e-${prevNode.id}-${newNode.id}`,
            source: prevNode.id, target: newNode.id,
            animated: true, style: { stroke: '#5aa0a4', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#5aa0a4' }
          }, eds))
        }
        return currentNodes
      })
    }
  }, [reactFlowInstance, project, setNodes, setEdges])

  const handleAutoLayout = useCallback(() => {
    const categoryOrder = ['frontend', 'backend', 'database', 'auth', 'ai', 'storage', 'cdn', 'deployment']
    const grouped: Record<string, any[]> = {}
    nodes.forEach(n => {
      const cat = n.data.tool.category
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(n)
    })
    const updated = nodes.map(n => {
      const cat = n.data.tool.category
      const colIdx = categoryOrder.indexOf(cat)
      const rowIdx = grouped[cat].indexOf(n)
      return { ...n, position: { x: colIdx * 220 + 60, y: rowIdx * 130 + 80 } }
    })
    setNodes(updated)
    setTimeout(() => fitView({ padding: 0.15 }), 50)
    showToast('Auto-layout applied!')
  }, [nodes, setNodes, fitView])

  const handleClearAll = () => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    showToast('Canvas cleared.')
  }

  const handleExportPNG = () => {
    const svgEl = document.querySelector('.react-flow__renderer svg')
    if (!svgEl) return showToast('Nothing to export.')
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svgEl)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${project?.name || 'architecture'}.svg`
    a.click(); URL.revokeObjectURL(url)
    showToast('Architecture exported!')
  }

  const handleNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const filteredTools = TECH_TOOLS.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', gap: '10px', color: '#607276' }}>
      <div style={{ width: '16px', height: '16px', border: '2px solid rgba(66,127,131,.3)', borderTopColor: '#427f83', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      Loading architecture canvas...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const selectedTool: TechTool | undefined = selectedNode?.data?.tool

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 58px)', background: '#eef3f4' }}>

      {/* Top Header */}
      <div style={{ padding: '16px 24px 0 24px', borderBottom: '1px solid rgba(38,69,72,.1)' }}>
        <StepIndicator steps={['Idea', 'Features', 'Architecture', 'Prompts', 'Blueprint', 'Deploy']} current={2} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: 800, marginBottom: '2px', color: '#172326' }}>
              Architecture Builder — <span style={{ color: '#5aa0a4' }}>{project?.name}</span>
            </h1>
            <p style={{ color: '#8a9a9d', fontSize: '12px' }}>
              Drag tech tools onto the canvas · Click a node to see AI recommendations
            </p>
          </div>
          <button onClick={() => router.push(`/planner/blueprint?project=${projectId}`)}
            style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #365f62, #83b9bd)', border: 'none', borderRadius: '8px', color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 20px rgba(66,127,131,.3)' }}>
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Toolbar strip */}
      <div style={{ padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(38,69,72,.1)', background: 'rgba(9,8,15,.8)' }}>
        {[
          { label: 'Select', icon: <MousePointer2 size={14} />, id: 'select' },
          { label: 'Connect', icon: <Link2 size={14} />, id: 'connect' },
        ].map(t => (
          <button key={t.id} onClick={() => setMode(t.id as any)} style={{
            padding: '6px 14px', borderRadius: '8px', border: `1px solid ${mode === t.id ? '#427f83' : 'rgba(38,69,72,.12)'}`,
            background: mode === t.id ? 'rgba(66,127,131,.15)' : 'transparent',
            color: mode === t.id ? '#83b9bd' : '#607276', fontSize: '12px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
          }}>{t.icon} {t.label}</button>
        ))}
        <div style={{ width: '1px', height: '20px', background: 'rgba(38,69,72,.12)' }} />
        <button onClick={handleAutoLayout} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(38,69,72,.12)', background: 'transparent', color: '#607276', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <LayoutDashboard size={14} /> Auto Layout
        </button>
        <button onClick={handleClearAll} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(38,69,72,.12)', background: 'transparent', color: '#607276', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trash2 size={14} /> Clear All
        </button>
        <button onClick={handleExportPNG} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(38,69,72,.12)', background: 'transparent', color: '#607276', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ImageDown size={14} /> Export PNG
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left Palette */}
        <div style={{ width: '200px', background: '#eef3f4', borderRight: '1px solid rgba(38,69,72,.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(38,69,72,.1)' }}>
            <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Drag to Canvas</div>
            <input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', background: 'rgba(38,69,72,.08)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '8px', padding: '7px 10px', color: '#172326', fontSize: '12px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
            {(searchTerm
              ? [{ id: 'results', label: 'Results', emoji: '🔍' }]
              : CATEGORIES
            ).map(cat => {
              const tools = filteredTools.filter(t => searchTerm ? true : t.category === cat.id)
              if (!tools.length) return null
              return (
                <div key={cat.id} style={{ marginBottom: '12px' }}>
                  {!searchTerm && (
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#607276', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{cat.emoji}</span> {cat.label}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {tools.map(tool => (
                      <div key={tool.id} draggable onDragStart={(e) => onDragStart(e, tool)}
                        style={{
                          background: 'rgba(38,69,72,.07)', border: `1px solid ${tool.color}20`,
                          padding: '8px 10px', borderRadius: '8px', cursor: 'grab',
                          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = `${tool.bg}`; e.currentTarget.style.borderColor = `${tool.color}40` }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(38,69,72,.07)'; e.currentTarget.style.borderColor = `${tool.color}20` }}
                      >
                        <div style={{ fontSize: '14px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{tool.emoji}</div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#172326', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(38,69,72,.1)', fontSize: '10px', color: '#8a9a9d', lineHeight: '1.6' }}>
            💡 <span style={{ color: '#607276' }}>Tips</span><br />
            • Drag nodes to reposition<br />
            • Click a node to configure it<br />
            • Right-click to delete
          </div>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, position: 'relative' }} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            connectionMode={mode === 'connect' ? ConnectionMode.Loose : ConnectionMode.Strict}
            fitView
            deleteKeyCode="Backspace"
          >
            <Controls style={{ background: 'rgba(255,255,255,.62)', borderColor: 'rgba(38,69,72,.12)' }} />
            <MiniMap
              style={{ background: 'rgba(255,255,255,.54)', border: '1px solid rgba(38,69,72,.12)' }}
              nodeColor={() => '#427f83'}
              maskColor="rgba(0,0,0,0.4)"
            />
            <Background color="#2d2b3b" gap={20} size={1} />
          </ReactFlow>
          {nodes.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <Box size={48} color="rgba(38,69,72,.12)" style={{ margin: '0 auto 16px' }} />
              <div style={{ color: '#8a9a9d', fontSize: '15px', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Drag a tool from the palette</div>
              <div style={{ color: '#3d3a55', fontSize: '12px', marginTop: '6px' }}>Nodes auto-connect when you add matching layers</div>
            </div>
          )}
        </div>

        {/* Right Configuration Panel */}
        <div style={{
          width: '240px', background: '#eef3f4', borderLeft: '1px solid rgba(38,69,72,.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(38,69,72,.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings2 size={14} color="#5aa0a4" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#172326', fontFamily: 'Syne, sans-serif' }}>Configuration</span>
          </div>

          {!selectedTool ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', color: '#3d3a55' }}>
              <Info size={28} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <div style={{ fontSize: '12px', color: '#8a9a9d' }}>Click a node to configure it</div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

              {/* Node label */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Node</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#172326', background: 'rgba(38,69,72,.1)', border: '1px solid rgba(38,69,72,.12)', borderRadius: '8px', padding: '8px 12px' }}>
                  {selectedTool.category.charAt(0).toUpperCase() + selectedTool.category.slice(1)} — {selectedTool.name}
                </div>
              </div>

              {/* AI Recommended */}
              {selectedTool.aiRecommended && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>AI Recommended</div>
                  <div style={{ fontSize: '12px', color: '#83b9bd', background: 'rgba(66,127,131,.1)', border: '1px solid rgba(66,127,131,.2)', borderRadius: '8px', padding: '8px 12px', fontWeight: 600 }}>
                    {selectedTool.aiRecommended}
                  </div>
                </div>
              )}

              {/* Why This Tool */}
              {selectedTool.whyThisTool && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Why This Tool</div>
                  <div style={{ fontSize: '11px', color: '#607276', background: 'rgba(38,69,72,.07)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '8px', padding: '8px 12px', lineHeight: '1.5' }}>
                    {selectedTool.whyThisTool}
                  </div>
                </div>
              )}

              {/* Alternative */}
              {selectedTool.alternative && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Alternative</div>
                  <div style={{ fontSize: '12px', color: '#06b6d4', background: 'rgba(6,182,212,.08)', border: '1px solid rgba(6,182,212,.15)', borderRadius: '8px', padding: '8px 12px', fontWeight: 600 }}>
                    {selectedTool.alternative}
                  </div>
                </div>
              )}

              {/* Cost / Month */}
              {selectedTool.costPerMonth !== undefined && (
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>Cost / Month</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: selectedTool.costPerMonth === '$0' ? '#10b981' : '#f97316', fontFamily: 'Syne, sans-serif', background: 'rgba(38,69,72,.07)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '8px', padding: '8px 12px' }}>
                    {selectedTool.costPerMonth}
                  </div>
                </div>
              )}

              {/* Performance Score */}
              {selectedTool.performanceScore !== undefined && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Performance Score</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{
                        flex: 1, height: '6px', borderRadius: '3px',
                        background: i < selectedTool.performanceScore! ? '#5aa0a4' : 'rgba(38,69,72,.12)'
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Export actions */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['PNG', 'PDF', 'Share'].map(label => (
                  <button key={label} onClick={handleExportPNG} style={{
                    flex: 1, padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(38,69,72,.12)',
                    background: 'rgba(38,69,72,.07)', color: '#607276', fontSize: '11px', fontWeight: 600, cursor: 'pointer'
                  }}>{label}</button>
                ))}
              </div>

              {/* Continue button */}
              <button onClick={() => router.push(`/planner/blueprint?project=${projectId}`)} style={{
                width: '100%', padding: '11px', background: 'linear-gradient(135deg, #365f62, #83b9bd)',
                border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(66,127,131,.28)'
              }}>
                Continue → <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

      </div>

      <style>{`
        .react-flow__controls button { background: rgba(255,255,255,.62) !important; border: 1px solid rgba(38,69,72,.12) !important; color: #172326 !important; }
        .react-flow__controls button:hover { background: rgba(66,127,131,.2) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
