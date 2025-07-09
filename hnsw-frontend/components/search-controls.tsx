"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import type { Point } from "../types/hnsw"

interface SearchControlsProps {
  onSearch: (queryPoint: Point, k: number, ef: number) => void
  onModelChange: (model: "clustered" | "uniform") => void
  currentModel: "clustered" | "uniform"
  isSearching: boolean
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  onSearch,
  onModelChange,
  currentModel,
  isSearching,
}) => {
  const [queryX, setQueryX] = useState<number>(300)
  const [queryY, setQueryY] = useState<number>(250)
  const [k, setK] = useState<number>(3)
  const [ef, setEf] = useState<number>(5)

  const handleSearch = () => {
    const queryPoint: Point = {
      id: -1,
      x: queryX,
      y: queryY,
      layer: 0,
      maxLayer: 0,
    }
    onSearch(queryPoint, k, ef)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>HNSW Search Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Graph Model:</label>
          <div className="flex gap-2">
            <Button
              variant={currentModel === "clustered" ? "default" : "outline"}
              onClick={() => onModelChange("clustered")}
              disabled={isSearching}
            >
              Clustered Model
            </Button>
            <Button
              variant={currentModel === "uniform" ? "default" : "outline"}
              onClick={() => onModelChange("uniform")}
              disabled={isSearching}
            >
              Uniform Model
            </Button>
          </div>
        </div>

        {/* Query Point Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Query X:</label>
            <Input
              type="number"
              value={queryX}
              onChange={(e) => setQueryX(Number(e.target.value))}
              min="0"
              max="800"
              disabled={isSearching}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Query Y:</label>
            <Input
              type="number"
              value={queryY}
              onChange={(e) => setQueryY(Number(e.target.value))}
              min="0"
              max="600"
              disabled={isSearching}
            />
          </div>
        </div>

        {/* Search Parameters */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">K (nearest neighbors): {k}</label>
            <Slider
              value={[k]}
              onValueChange={(value) => setK(value[0])}
              min={1}
              max={10}
              step={1}
              disabled={isSearching}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ef (search width): {ef}</label>
            <Slider
              value={[ef]}
              onValueChange={(value) => setEf(value[0])}
              min={1}
              max={20}
              step={1}
              disabled={isSearching}
            />
          </div>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} disabled={isSearching} className="w-full">
          {isSearching ? "Searching..." : "Start Search"}
        </Button>
      </CardContent>
    </Card>
  )
}
