'use client'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore'
import { auth, db } from '@/utils/firebase/client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const [aiTools, setAiTools] = useState<any[]>([])
  const [allAvailableTools, setAllAvailableTools] = useState<any[]>([])
  const [features, setFeatures] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedToolConfig, setSelectedToolConfig] = useState<any>(null)
  const [loadingTools, setLoadingTools] = useState(false)

  useEffect(() => {
    if (!projectId) { router.push('/planner'); return }
    
    // Fetch all available AI tools from worldwide catalog
    setLoadingTools(true)
    fetch('/api/ai/all-tools', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data.tools && Array.isArray(data.tools)) {
          setAllAvailableTools(data.tools)
        }
      })
      .catch(err => console.error('Error fetching all tools:', err))
      .finally(() => setLoadingTools(false))
    
    // Load project and features
    getDoc(doc(db as any, 'projects', projectId)).then(async (s) => {
      if (s.exists()) {
        const proj = { id: s.id, ...s.data() as any }
        setProject(proj)
        
        // Fetch features
        const featsSnap = await getDocs(query(collection(db as any, 'features'), where('project_id', '==', projectId)))
        const feats = featsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))
        setFeatures(feats)
        
        // Fetch AI tools recommendations for this project
        try {
          const res = await fetch('/api/ai/recommend-tools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectIdea: proj.idea,
              features: feats,
              platform: proj.platform,
              stack: proj.stack
            })
          })
          const data = await res.json()
          if (data.tools) {
            setAiTools(data.tools)
            // Create initial nodes from AI tools
            createAIToolNodes(data.tools)
          }
        } catch (err) {
          console.error('Error fetching AI tools:', err)
        }
      }
      setLoading(false)
    })
    
    // Save current step when visiting architecture page
    updateDoc(doc(db as any, 'projects', projectId!), { current_step: 'architecture' }).catch(() => {})
  }, [projectId])

  const getLayerEmoji = (layer: string): string => {
    const emojis: { [key: string]: string } = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Data': '💾',
      'DevOps': '🚀'
    }
    return emojis[layer] || '🔧'
  }

  const createAIToolNodes = (tools: any[]) => {
    const newNodes = []
    const newEdges = []
    
    // Root node
    const rootNode = {
      id: 'ai-root',
      type: 'techNode',
      position: { x: 0, y: 0 },
      data: { tool: { name: 'AI Tool IDE', category: 'root', description: 'Recommended AI Tools Hub', layer: 'root' }, isValid: true }
    }
    newNodes.push(rootNode)
    
    // Group tools by layer
    const layers: { [key: string]: any[] } = { Frontend: [], Backend: [], Data: [], DevOps: [] }
    tools.forEach((tool: any) => {
      const layer = tool.layer || 'Backend'
      if (layers[layer]) layers[layer].push(tool)
    })
    
    let yOffset = -250
    let xOffset = -400
    const layerSpacing = 200
    const toolSpacing = 100
    
    // Create nodes for each layer
    Object.entries(layers).forEach(([layer, toolsList]: [string, any[]]) => {
      toolsList.forEach((tool: any, idx: number) => {
        const nodeId = `tool-${tool.id}`
        const xPos = xOffset + (Object.keys(layers).indexOf(layer) * layerSpacing)
        const yPos = yOffset + (idx * toolSpacing)
        
        newNodes.push({
          id: nodeId,
          type: 'techNode',
          position: { x: xPos, y: yPos },
          data: { 
            tool: { 
              ...tool, 
              name: tool.name,
              layer: layer,
              description: `${tool.category} - ${tool.reason}`,
              displayName: `${getLayerEmoji(layer)} ${tool.name}`,
              configuration: tool.configuration || `Configure ${tool.name} by setting up API keys and connecting it to your ${layer.toLowerCase()} services.`
            },
            isValid: true,
            relevance: tool.relevance
          }
        })
        
        // Connect to root
        newEdges.push({
          id: `edge-root-${nodeId}`,
          source: 'ai-root',
          target: nodeId,
          animated: true,
          style: { stroke: '#5aa0a4', strokeWidth: 2 }
        })
      })
    })
    
    setNodes(newNodes)
    setEdges(newEdges)
  }

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

    const tool: any = JSON.parse(toolData)
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })

    // Check if dropping on an existing node to swap
    const nodesAtPosition = reactFlowInstance.getNodes().filter(n => {
      const distance = Math.sqrt(
        Math.pow(n.position.x - position.x, 2) + Math.pow(n.position.y - position.y, 2)
      )
      return distance < 80 // Within 80px = on the node
    })

    if (nodesAtPosition.length > 0 && nodesAtPosition[0].id !== 'ai-root') {
      // Swap tool on existing node
      const targetNode = nodesAtPosition[0]
      setNodes((nds) =>
        nds.map(n =>
          n.id === targetNode.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  tool: {
                    ...tool,
                    layer: n.data.tool.layer,
                    displayName: `${getLayerEmoji(n.data.tool.layer)} ${tool.name}`,
                    configuration: tool.configuration || `Configure ${tool.name} by setting up API keys and connecting it to your ${n.data.tool.layer.toLowerCase()} services.`
                  }
                }
              }
            : n
        )
      )
      
      // Update selected tool config if this is the selected node
      if (selectedNode?.id === targetNode.id) {
        setSelectedToolConfig({
          name: tool.name,
          layer: selectedNode.data.tool.layer,
          category: tool.category,
          reason: `Swapped to known tool: ${tool.name}`,
          relevance: tool.relevance || 75,
          description: tool.description,
          configuration: tool.configuration || `Configure ${tool.name} by setting up API keys and connecting it to your ${selectedNode.data.tool.layer.toLowerCase()} services.`
        })
      }
      
      showToast(`✓ Swapped to ${tool.name}`)
      return
    }

    // Otherwise, create new node
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

  const swapToolInNode = (newTool: any) => {
    if (!selectedNode) return
    
    // Update the selected node with new tool data
    setNodes((nds) =>
      nds.map(n =>
        n.id === selectedNode.id
          ? {
              ...n,
              data: {
                ...n.data,
                tool: {
                  ...newTool,
                  layer: n.data.tool.layer,
                  displayName: `${getLayerEmoji(n.data.tool.layer)} ${newTool.name}`,
                  configuration: newTool.configuration || `Configure ${newTool.name} by setting up API keys and connecting it to your ${n.data.tool.layer.toLowerCase()} services.`
                }
              }
            }
          : n
      )
    )
    
    // Update the selected tool config panel
    setSelectedToolConfig({
      name: newTool.name,
      layer: selectedNode.data.tool.layer,
      category: newTool.category,
      reason: newTool.reason || `Swapped from ${selectedToolConfig.name}`,
      relevance: newTool.relevance || 75,
      description: newTool.description,
      configuration: newTool.configuration || `Configure ${newTool.name} by setting up API keys and connecting it to your ${selectedNode.data.tool.layer.toLowerCase()} services.`
    })
    
    showToast(`✓ Swapped to ${newTool.name}`)
  }

  const handleNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node)
    if (node.data?.tool?.layer) {
      setSelectedToolConfig({
        name: node.data.tool.name,
        layer: node.data.tool.layer,
        category: node.data.tool.category,
        reason: node.data.tool.reason,
        relevance: node.data.relevance,
        description: node.data.tool.description,
        configuration: node.data.tool.configuration
      })
    }
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

        {/* Left AI Tools Palette */}
        <div style={{ width: '220px', background: '#eef3f4', borderRight: '1px solid rgba(38,69,72,.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(38,69,72,.1)', background: '#fbfcfc' }}>
            <div style={{ fontSize: '10px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>🤖 AI Tools</div>
            <input
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', background: 'rgba(66,127,131,.08)', border: '1px solid rgba(66,127,131,.2)', borderRadius: '6px', padding: '6px 10px', color: '#172326', fontSize: '11px', outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>
          
          {/* Category Tabs - All Categories */}
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(38,69,72,.1)', display: 'flex', gap: '4px', overflowX: 'auto', flexWrap: 'wrap' }}>
            {['All', 'LLMs', 'Agents', 'Image', 'Speech', 'Search', 'Vector', 'Code', 'Embeddings', 'Video', 'Audio', '3D', 'Analytics', 'Automation', 'Design', 'Other'].map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
                padding: '4px 10px', borderRadius: '6px', fontSize: '9px', fontWeight: 600, whiteSpace: 'nowrap',
                border: `1px solid ${selectedCategory === cat ? '#427f83' : 'rgba(38,69,72,.12)'}`,
                background: selectedCategory === cat ? 'rgba(66,127,131,.15)' : 'transparent',
                color: selectedCategory === cat ? '#427f83' : '#8a9a9d',
                cursor: 'pointer', transition: 'all 0.15s'
              }}>{cat}</button>
            ))}
          </div>
          
          {/* All Available AI Tools List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loadingTools ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: '#8a9a9d', fontSize: '12px' }}>
                <div style={{ animation: 'spin 0.7s linear infinite' }}>⚙️</div>
                <div style={{ marginTop: '8px' }}>Loading world catalog...</div>
              </div>
            ) : allAvailableTools.length === 0 ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: '#8a9a9d', fontSize: '12px' }}>
                📋 No tools found. Check back soon!
              </div>
            ) : (
              allAvailableTools
                .filter(t => {
                  const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory || t.category.includes(selectedCategory)
                  const matchesSearch = searchTerm === '' || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase())
                  return matchesCategory && matchesSearch
                })
                .map(tool => (
                  <div key={tool.id} draggable onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy'
                    e.dataTransfer.setData('application/reactflow', JSON.stringify({ ...tool, isDraggedTool: true }))
                  }}
                    style={{
                      background: 'rgba(66,127,131,.08)', border: '1px solid rgba(66,127,131,.15)',
                      padding: '9px', borderRadius: '8px', cursor: 'grab', marginBottom: '8px',
                      transition: 'all 0.15s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(66,127,131,.15)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.3)' }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(66,127,131,.08)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.15)' }}
                    title={tool.description}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#172326', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</div>
                    <div style={{ fontSize: '8px', color: '#8a9a9d', marginBottom: '3px', display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                      <span>{tool.category}</span>
                      <span style={{ color: '#5aa0a4', fontWeight: 600 }}>{tool.pricing}</span>
                    </div>
                    <div style={{ fontSize: '8px', color: '#607276', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tool.description}
                    </div>
                  </div>
                ))
            )}
          </div>
          
          <div style={{ padding: '10px', borderTop: '1px solid rgba(38,69,72,.1)', fontSize: '9px', color: '#8a9a9d', background: '#fbfcfc', lineHeight: '1.4' }}>
            💡 <strong>Search</strong> 100+ tools • <strong>Drag</strong> to add • <strong>Click</strong> node to swap • <strong>Use tools you know best!</strong>
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
          width: '280px', background: '#eef3f4', borderLeft: '1px solid rgba(38,69,72,.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(38,69,72,.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings2 size={14} color="#5aa0a4" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#172326', fontFamily: 'Syne, sans-serif' }}>Configuration</span>
          </div>

          {!selectedToolConfig ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', color: '#3d3a55' }}>
              <Info size={28} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <div style={{ fontSize: '12px', color: '#8a9a9d' }}>Click an AI tool node to see configuration</div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

              {/* Tool Name with Layer */}
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(66,127,131,.12)', borderRadius: '10px', border: '1px solid rgba(66,127,131,.2)' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#172326', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{getLayerEmoji(selectedToolConfig.layer)}</span>
                  {selectedToolConfig.name}
                </div>
                <div style={{ fontSize: '11px', color: '#5aa0a4', fontWeight: 600 }}>
                  {selectedToolConfig.layer} Layer
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Category</div>
                <div style={{ fontSize: '12px', color: '#607276', background: 'rgba(38,69,72,.07)', borderRadius: '6px', padding: '8px 12px', fontWeight: 600 }}>
                  {selectedToolConfig.category}
                </div>
              </div>

              {/* Relevance Score */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Relevance Score</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(38,69,72,.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedToolConfig.relevance}%`, height: '100%', background: 'linear-gradient(90deg, #427f83, #5aa0a4)', borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#5aa0a4', minWidth: '35px', textAlign: 'right' }}>
                    {selectedToolConfig.relevance}%
                  </div>
                </div>
              </div>

              {/* Why This Tool */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Why Recommended</div>
                <div style={{ fontSize: '11px', color: '#607276', background: 'rgba(38,69,72,.07)', border: '1px solid rgba(38,69,72,.1)', borderRadius: '8px', padding: '10px 12px', lineHeight: '1.6' }}>
                  {selectedToolConfig.reason}
                </div>
              </div>

              {/* How to Configure */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>How to Use & Configure</div>
                <div style={{ fontSize: '11px', color: '#607276', background: 'rgba(66,127,131,.08)', border: '1px solid rgba(66,127,131,.15)', borderRadius: '8px', padding: '10px 12px', lineHeight: '1.6' }}>
                  {selectedToolConfig.configuration}
                  <br /><br />
                  <span style={{ color: '#5aa0a4', fontWeight: 600 }}>✓</span> Setup involves API key configuration, environment variables, and integration with your {selectedToolConfig.layer.toLowerCase()} services.
                </div>
              </div>

              {/* Swap Tool Section */}
              {allAvailableTools.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '9px', color: '#8a9a9d', fontFamily: 'DM Mono, monospace', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>💱 Swap Tool</div>
                  <div style={{ fontSize: '10px', color: '#607276', marginBottom: '8px', lineHeight: '1.4' }}>
                    Know a tool better? Select from compatible options to swap it.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {allAvailableTools
                      .filter(t => t.category === selectedToolConfig.category && t.name !== selectedToolConfig.name)
                      .slice(0, 8)
                      .map(tool => (
                        <button key={tool.id} onClick={() => swapToolInNode(tool)} style={{
                          padding: '8px 12px', textAlign: 'left', borderRadius: '8px', border: '1px solid rgba(66,127,131,.2)',
                          background: 'rgba(66,127,131,.08)', color: '#172326', fontSize: '10px', fontWeight: 600,
                          cursor: 'pointer', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}
                          onMouseOver={e => { e.currentTarget.style.background = 'rgba(66,127,131,.15)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.4)' }}
                          onMouseOut={e => { e.currentTarget.style.background = 'rgba(66,127,131,.08)'; e.currentTarget.style.borderColor = 'rgba(66,127,131,.2)' }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ fontWeight: 700, marginBottom: '1px' }}>{tool.name}</div>
                            <div style={{ fontSize: '9px', color: '#8a9a9d' }}>{tool.pricing}</div>
                          </div>
                          <div style={{ fontSize: '14px', marginLeft: '8px' }}>→</div>
                        </button>
                      ))
                    }
                    {allAvailableTools.filter(t => t.category === selectedToolConfig.category && t.name !== selectedToolConfig.name).length === 0 && (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#8a9a9d', fontSize: '10px', background: 'rgba(38,69,72,.05)', borderRadius: '6px' }}>
                        No alternatives available
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Continue button */}
              <button onClick={() => router.push(`/planner/blueprint?project=${projectId}`)} style={{
                width: '100%', padding: '11px', background: 'linear-gradient(135deg, #365f62, #83b9bd)',
                border: 'none', borderRadius: '10px', color: '#fff', fontFamily: 'Syne, sans-serif',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(66,127,131,.28)', marginTop: 'auto'
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
