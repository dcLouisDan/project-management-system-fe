import { createFileRoute } from '@tanstack/react-router'
import {
  ReactFlow,
  addEdge,
  type FitViewOptions,
  type OnConnect,
  type OnNodeDrag,
  type DefaultEdgeOptions,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import '@xyflow/react/dist/style.css'
import { useAppearance } from '@/hooks/use-appearance';
import { mockProjectGraphData } from '@/lib/mock/project-graph-data';
import { getLayoutedElements, projectRelationsGraphToNodesAndEdges } from '@/lib/utils/project-relation-utils';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_main/tree')({
  component: RouteComponent,
})

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('drag event', node.data);
};

function LayoutFlow() {
  const { appearance } = useAppearance()
  const { fitView } = useReactFlow()
  const { nodes: mockNodes, edges: mockEdges } = projectRelationsGraphToNodesAndEdges(mockProjectGraphData)
  const [nodes, setNodes, onNodesChange] = useNodesState(mockNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mockEdges);


  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onLayout = useCallback((direction: 'LR' | 'TB') => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, { direction });
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    fitView()
  }, [nodes, edges]);

  useEffect(() => {
    onLayout('TB')
  }, [])

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
        <Panel position="top-right" className='flex gap-2'>
          <Button onClick={() => onLayout('TB')}>vertical</Button>
          <Button onClick={() => onLayout('LR')}>horizontal</Button>
        </Panel>
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} size={1} />
      </ReactFlow>
    </div>
  )
}

function RouteComponent() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  )
}
