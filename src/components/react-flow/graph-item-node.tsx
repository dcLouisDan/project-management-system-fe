import { Handle, Position } from "@xyflow/react"

export default function GraphItemNode({ id, data }: { id: string, data: any }) {
    return (
        <div className="p-2 border rounded-md shadow-sm bg-card">
            <Handle type="target" position={Position.Top} />
            <div className="text-sm font-medium">{data.label}</div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}