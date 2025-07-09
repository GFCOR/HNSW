"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SearchStep } from "../types/hnsw"

interface SearchResultsProps {
  searchSteps: SearchStep[]
  currentStep: number
  queryPoint: { x: number; y: number } | null
}

export const SearchResults: React.FC<SearchResultsProps> = ({ searchSteps, currentStep, queryPoint }) => {
  const currentSearchStep = searchSteps[currentStep]

  if (!currentSearchStep || !queryPoint) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No search results available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Results - Step {currentStep + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Current Layer: {currentSearchStep.layer}</h4>
          <p className="text-sm text-gray-600">
            Current Point: ({currentSearchStep.currentPoint.x}, {currentSearchStep.currentPoint.y})
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">Nearest Neighbors Found:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {currentSearchStep.nearestNeighbors.map((result, index) => (
              <div key={result.point.id} className="text-sm p-2 bg-green-50 rounded">
                <span className="font-medium">#{index + 1}</span> - Point {result.point.id} at ({result.point.x},{" "}
                {result.point.y}) - Distance: {result.distance.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium">Visited Points:</h5>
            <p className="text-gray-600">{currentSearchStep.visited.length} points</p>
          </div>
          <div>
            <h5 className="font-medium">Candidates:</h5>
            <p className="text-gray-600">{currentSearchStep.candidates.length} points</p>
          </div>
        </div>

        {currentStep === searchSteps.length - 1 && (
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <h4 className="font-medium text-blue-800">Final Results:</h4>
            <p className="text-sm text-blue-600">
              Search completed! Found {currentSearchStep.nearestNeighbors.length} nearest neighbors.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
