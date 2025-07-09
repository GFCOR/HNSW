"use client"

import { useState, useEffect, useCallback } from "react"
import type { HNSWGraph, Point, SearchStep } from "./types/hnsw"
import { HNSWSearcher } from "./algorithms/hnsw-search"
import { clusteredModel, uniformModel } from "./data/graph-models"
import { GraphVisualization } from "./components/graph-visualization"
import { SearchControls } from "./components/search-controls"
import { SearchResults } from "./components/search-results"
import { AnimationControls } from "./components/animation-controls"

export default function HNSWSearchApp() {
  const [currentModel, setCurrentModel] = useState<"clustered" | "uniform">("clustered")
  const [graph, setGraph] = useState<HNSWGraph>(clusteredModel)
  const [searcher, setSearcher] = useState<HNSWSearcher>(new HNSWSearcher(clusteredModel))
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([])
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [queryPoint, setQueryPoint] = useState<Point | null>(null)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000)

  // Update graph when model changes
  useEffect(() => {
    const newGraph = currentModel === "clustered" ? clusteredModel : uniformModel
    setGraph(newGraph)
    setSearcher(new HNSWSearcher(newGraph))
    setSearchSteps([])
    setCurrentStep(0)
    setQueryPoint(null)
    setIsSearching(false)
    setIsPlaying(false)
  }, [currentModel])

  // Animation effect
  useEffect(() => {
    if (!isPlaying || searchSteps.length === 0) return

    const timer = setTimeout(() => {
      if (currentStep < searchSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }, animationSpeed)

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, searchSteps.length, animationSpeed])

  const handleModelChange = (model: "clustered" | "uniform") => {
    setCurrentModel(model)
  }

  const handleSearch = useCallback(
    async (queryPt: Point, k: number, ef: number) => {
      setIsSearching(true)
      setQueryPoint(queryPt)

      try {
        // Simulate async search for better UX
        await new Promise((resolve) => setTimeout(resolve, 100))

        const steps = searcher.searchKNN(queryPt, k, ef)
        setSearchSteps(steps)
        setCurrentStep(0)
        setIsPlaying(false)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    },
    [searcher],
  )

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)
  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleNext = () => {
    if (currentStep < searchSteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const getCurrentLayer = (): number => {
    if (searchSteps.length === 0 || currentStep >= searchSteps.length) {
      return 0
    }
    return searchSteps[currentStep].layer
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HNSW Graph Search Visualization</h1>
          <p className="text-gray-600">
            Interactive demonstration of Hierarchical Navigable Small World graph search algorithm
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-4">
            <SearchControls
              onSearch={handleSearch}
              onModelChange={handleModelChange}
              currentModel={currentModel}
              isSearching={isSearching}
            />

            <AnimationControls
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={searchSteps.length}
              currentLayer={getCurrentLayer()}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onStepChange={setCurrentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
            />
          </div>

          {/* Center Column - Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-xl font-semibold mb-4">
                Graph Visualization - {currentModel === "clustered" ? "Clustered" : "Uniform"} Model
              </h2>
              <GraphVisualization
                graph={graph}
                currentLayer={getCurrentLayer()}
                searchSteps={searchSteps}
                currentStep={currentStep}
                queryPoint={queryPoint}
              />
            </div>

            <SearchResults searchSteps={searchSteps} currentStep={currentStep} queryPoint={queryPoint} />
          </div>
        </div>

        {/* Algorithm Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Algorithm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">HNSW Search Process:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Start from entry point at top layer</li>
                <li>Perform greedy search to find local minimum</li>
                <li>Move to next lower layer</li>
                <li>Repeat until reaching layer 0</li>
                <li>Return K nearest neighbors</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">Parameters:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>
                  <strong>K:</strong> Number of nearest neighbors to find
                </li>
                <li>
                  <strong>ef:</strong> Search width parameter (higher = more accurate)
                </li>
                <li>
                  <strong>Layers:</strong> Hierarchical structure for efficient search
                </li>
                <li>
                  <strong>Entry Point:</strong> Starting node for search (red)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
