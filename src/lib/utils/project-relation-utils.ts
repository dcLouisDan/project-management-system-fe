import { type Node, type Edge } from "@xyflow/react";
import type { ProjectRelationsGraph } from "../types/project-relations";

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