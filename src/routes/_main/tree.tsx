import { createFileRoute } from '@tanstack/react-router'
import {
  ReactFlow,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  Controls,
  MiniMap
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css'
import { useAppearance } from '@/hooks/use-appearance';
import { mockProjectGraphData } from '@/lib/mock/project-graph-data';
import { projectRelationsGraphToNodesAndEdges } from '@/lib/utils/project-relation-utils';

export const Route = createFileRoute('/_main/tree')({
  component: RouteComponent,
})

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 5 },
    data: { label: 'Input' },
  },
  {
    id: '2',
    position: { x: 100, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    position: { x: 400, y: 100 },
    data: { label: 'Node 3' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
]
const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('drag event', node.data);
};

function RouteComponent() {
  const { appearance } = useAppearance()
  const { nodes: mockNodes, edges: mockEdges } = projectRelationsGraphToNodesAndEdges(mockProjectGraphData)

  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [edges, setEdges] = useState<Edge[]>(mockEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDrag={onNodeDrag}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        colorMode={appearance}
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}
