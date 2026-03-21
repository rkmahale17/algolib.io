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
    onNodeClick?: (nodeVal: number) => void;
}

export const GraphDiagram: React.FC<GraphDiagramProps> = ({
    data,
    className = "",
    width = 400,
    height = 250,
    highlightNodes,
    highlightEdges,
    currentNode,
    onNodeClick
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
        <div className={`relative bg-background/50 border rounded-lg p-2 overflow-hidden ${className}`}>
            <svg
                className="w-full h-full mx-auto overflow-visible"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
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
                    const isStart = node.isStart;

                    return (
                        <g
                            key={node.id}
                            className={`transition-all duration-300 ${onNodeClick ? 'cursor-pointer hover:scale-110 active:scale-95 group' : ''}`}
                            onClick={() => onNodeClick?.(node.val)}
                        >
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r="16"
                                className={`transition-all duration-300 ${isCurrent
                                    ? "fill-primary/20 stroke-primary stroke-[3] animate-pulse"
                                    : isStart
                                        ? "fill-amber-500/20 stroke-amber-500 stroke-[2]"
                                        : isVisited
                                            ? "fill-green-500/20 stroke-green-500"
                                            : "fill-card stroke-primary/50"
                                    }`}
                                strokeWidth="1.5"
                            />
                            {isStart && !isCurrent && (
                                <text
                                    x={node.x}
                                    y={node.y - 20}
                                    textAnchor="middle"
                                    className="fill-amber-500 text-[8px] font-bold uppercase"
                                >
                                    Start
                                </text>
                            )}
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
                            {onNodeClick && (
                                <title>Click to set Node {node.val} as start</title>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
