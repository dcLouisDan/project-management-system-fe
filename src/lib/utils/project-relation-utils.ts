import { type Node, type Edge } from "@xyflow/react";
import type { ProjectRelationsGraph } from "../types/project-relations";
import Dagre from '@dagrejs/dagre';

export function projectRelationsGraphToNodesAndEdges(graph: ProjectRelationsGraph): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodePositions: Record<string, { x: number, y: number }> = {};
    let x = 0;
    let y = 0;
    for (const [source, relations] of Object.entries(graph)) {
        if (nodePositions[source]) {
            x = nodePositions[source].x;
        }
        nodes.push({
            id: source,
            position: { x, y },
            data: { label: source },
        });
        nodePositions[source] = { x, y };
        // const relationsLength = relations.length;
        y += 100;
        for (const [index, relation] of relations.entries()) {
            edges.push({
                id: `${source}-${relation.target}`,
                source,
                target: relation.target,
                type: relation.type,
            });
            if (!Object.keys(graph).includes(relation.target)) {
                const xPosition = computeXPosition(relations.length, x, index);
                nodes.push({
                    id: relation.target,
                    position: { x: xPosition, y },
                    data: { label: relation.target },
                });
                nodePositions[relation.target] = { x: xPosition, y };
            }
        }
    }
    return { nodes, edges };
}

function computeXPosition(total: number, offset: number, index: number) {
    if (total == 1) {
        return 0 + offset;
    }
    return (index - (total - 1) / 2) * 320 + offset;
}

export const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: 'LR' | 'TB' }) => {
    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            ...node,
            width: node.measured?.width ?? 0,
            height: node.measured?.height ?? 0,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const position = g.node(node.id);
            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            const x = position.x - (node.measured?.width ?? 0) / 2;
            const y = position.y - (node.measured?.height ?? 0) / 2;

            return { ...node, position: { x, y } };
        }),
        edges,
    };
};