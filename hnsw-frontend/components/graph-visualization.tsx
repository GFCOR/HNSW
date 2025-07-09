"use client"

import type React from "react"
import type { HNSWGraph, Point, SearchStep } from "../types/hnsw"

interface GraphVisualizationProps {
  graph: HNSWGraph
  currentLayer: number
  searchSteps: SearchStep[]
  currentStep: number
  queryPoint: Point | null
}

export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  graph,
  currentLayer,
  searchSteps,
  currentStep,
  queryPoint,
}) => {
  const getPointColor = (point: Point): string => {
    if (point.id === graph.entryPoint) return "#ff0000" // Entry point - red

    const currentSearchStep = searchSteps[currentStep]
    if (currentSearchStep) {
      if (currentSearchStep.nearestNeighbors.some((nn) => nn.point.id === point.id)) {
        return "#00ff00" // Found neighbors - green
      }
      if (currentSearchStep.visited.some((v) => v.id === point.id)) {
        return "#ffaa00" // Visited - orange
      }
      if (currentSearchStep.candidates.some((c) => c.id === point.id)) {
        return "#0088ff" // Candidates - blue
      }
    }

    return point.maxLayer >= currentLayer ? "#333333" : "#cccccc"
  }

  const getPointRadius = (point: Point): number => {
    if (point.id === graph.entryPoint) return 8
    return point.maxLayer >= currentLayer ? 6 : 4
  }

  const shouldShowEdge = (edge: any): boolean => {
    return edge.layer === currentLayer
  }

  const shouldShowPoint = (point: Point): boolean => {
    return point.maxLayer >= currentLayer
  }

  return (
    <div className="relative w-full h-96 border border-gray-300 bg-white">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        {/* Render edges */}
        {graph.edges.filter(shouldShowEdge).map((edge, index) => {
          const fromPoint = graph.points.find((p) => p.id === edge.from)
          const toPoint = graph.points.find((p) => p.id === edge.to)

          if (!fromPoint || !toPoint || !shouldShowPoint(fromPoint) || !shouldShowPoint(toPoint)) {
            return null
          }

          return (
            <line
              key={`edge-${index}`}
              x1={fromPoint.x}
              y1={fromPoint.y}
              x2={toPoint.x}
              y2={toPoint.y}
              stroke="#666666"
              strokeWidth="1"
              opacity="0.6"
            />
          )
        })}

        {/* Render points */}
        {graph.points.filter(shouldShowPoint).map((point) => (
          <circle
            key={`point-${point.id}`}
            cx={point.x}
            cy={point.y}
            r={getPointRadius(point)}
            fill={getPointColor(point)}
            stroke="#000000"
            strokeWidth="1"
          />
        ))}

        {/* Render query point */}
        {queryPoint && (
          <circle cx={queryPoint.x} cy={queryPoint.y} r="8" fill="#ff00ff" stroke="#000000" strokeWidth="2" />
        )}

        {/* Layer indicator */}
        <text x="10" y="30" fontSize="16" fontWeight="bold" fill="#000000">
          Layer {currentLayer}
        </text>

        {/* Legend */}
        <g transform="translate(10, 50)">
          <circle cx="10" cy="10" r="6" fill="#ff0000" />
          <text x="25" y="15" fontSize="12" fill="#000000">
            Entry Point
          </text>

          <circle cx="10" cy="30" r="6" fill="#ff00ff" />
          <text x="25" y="35" fontSize="12" fill="#000000">
            Query Point
          </text>

          <circle cx="10" cy="50" r="6" fill="#00ff00" />
          <text x="25" y="55" fontSize="12" fill="#000000">
            Found Neighbors
          </text>

          <circle cx="10" cy="70" r="6" fill="#ffaa00" />
          <text x="25" y="75" fontSize="12" fill="#000000">
            Visited
          </text>

          <circle cx="10" cy="90" r="6" fill="#0088ff" />
          <text x="25" y="95" fontSize="12" fill="#000000">
            Candidates
          </text>
        </g>
      </svg>
    </div>
  )
}
