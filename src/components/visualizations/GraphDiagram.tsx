import React, { useMemo } from 'react';
import { calculateGraphPositions, parseGraphValue } from '@/utils/graphUtils';

interface GraphDiagramProps {
    data: unknown; // Can be adjacency list (number[][]) or stringified
    className?: string;
    width?: number;
    height?: number;
    highlightNodes?: Set<number>;
    highlightEdges?: Set<string>; // "u-v"
    currentNode?: number | null;
}

export const GraphDiagram: React.FC<GraphDiagramProps> = ({
    data,
    className = "",
    width = 400,
    height = 250,
    highlightNodes,
    highlightEdges,
    currentNode
}) => {
    const { nodes, edges } = useMemo(() => {
        const graphData = parseGraphValue(data);
        if (!graphData) return { nodes: [], edges: [] };

        return calculateGraphPositions(graphData, width, height);
    }, [data, width, height]);

    if (nodes.length === 0) {
        return (
            <div className={`p-4 text-center text-muted-foreground text-sm border border-dashed rounded-lg ${className}`}>
                Empty or Invalid Graph
            </div>
        );
    }

    return (
        <div className={`relative bg-background/50 border rounded-lg p-2 overflow-auto no-scrollbar ${className}`}>
            <svg
                width={width}
                height={height}
                className="mx-auto overflow-visible"
                viewBox={`0 0 ${width} ${height}`}
            >
                {/* Render Edges */}
                {edges.map((edge, i) => {
                    const edgeId1 = `${edge.from}-${edge.to}`;
                    const edgeId2 = `${edge.to}-${edge.from}`;
                    const isHighlighted = highlightEdges?.has(edgeId1) || highlightEdges?.has(edgeId2);

                    return (
                        <line
                            key={`edge-${i}`}
                            x1={edge.x1}
                            y1={edge.y1}
                            x2={edge.x2}
                            y2={edge.y2}
                            stroke="currentColor"
                            className={`transition-all duration-300 ${isHighlighted ? "text-primary stroke-2" : "text-muted-foreground/40"
                                }`}
                            strokeWidth={isHighlighted ? "2.5" : "1.5"}
                        />
                    );
                })}

                {/* Render Nodes */}
                {nodes.map((node) => {
                    const isVisited = highlightNodes?.has(node.val);
                    const isCurrent = currentNode === node.val;

                    return (
                        <g key={node.id} className="transition-all duration-300">
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r="16"
                                className={`transition-all duration-300 ${isCurrent
                                    ? "fill-primary/20 stroke-primary stroke-[3] animate-pulse"
                                    : isVisited
                                        ? "fill-green-500/20 stroke-green-500"
                                        : "fill-card stroke-primary/50"
                                    }`}
                                strokeWidth="1.5"
                            />
                            <text
                                x={node.x}
                                y={node.y + 1}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`fill-foreground font-mono text-[10px] font- ${isCurrent ? "text-primary" : isVisited ? "text-green-500" : ""
                                    }`}
                            >
                                {node.val}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
