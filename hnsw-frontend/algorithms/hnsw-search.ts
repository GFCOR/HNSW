import type { HNSWGraph, Point, SearchStep } from "../types/hnsw"
import { euclideanDistance, findNearestNeighbors } from "../utils/distance"

export class HNSWSearcher {
  private graph: HNSWGraph

  constructor(graph: HNSWGraph) {
    this.graph = graph
  }

  // Algorithm 5: K-NN-SEARCH from the paper
  public searchKNN(query: Point, k: number, ef = 1): SearchStep[] {
    const steps: SearchStep[] = []
    const entryPoint = this.graph.points.find((p) => p.id === this.graph.entryPoint)!
    let currentLayer = this.graph.layers - 1
    let ep = entryPoint

    // Search from top layer to layer 1
    while (currentLayer > 0) {
      const layerResult = this.searchLayer(query, [ep], 1, currentLayer)
      ep = layerResult.nearest[0]

      steps.push({
        currentPoint: ep,
        candidates: layerResult.candidates,
        visited: layerResult.visited,
        layer: currentLayer,
        nearestNeighbors: layerResult.nearest.map((p) => ({
          point: p,
          distance: euclideanDistance(query, p),
          visited: true,
        })),
      })

      currentLayer--
    }

    // Search at layer 0 with ef parameter
    const finalResult = this.searchLayer(query, [ep], ef, 0)
    const kNearest = findNearestNeighbors(query, finalResult.nearest, k)

    steps.push({
      currentPoint: ep,
      candidates: finalResult.candidates,
      visited: finalResult.visited,
      layer: 0,
      nearestNeighbors: kNearest.map((p) => ({
        point: p,
        distance: euclideanDistance(query, p),
        visited: true,
      })),
    })

    return steps
  }

  // Algorithm 2: SEARCH-LAYER from the paper
  private searchLayer(
    query: Point,
    entryPoints: Point[],
    ef: number,
    layer: number,
  ): { nearest: Point[]; candidates: Point[]; visited: Point[] } {
    const visited = new Set<number>()
    const candidates: Point[] = [...entryPoints]
    const w: Point[] = [...entryPoints]
    const allCandidates: Point[] = []
    const allVisited: Point[] = []

    entryPoints.forEach((ep) => {
      visited.add(ep.id)
      allVisited.push(ep)
    })

    while (candidates.length > 0) {
      // Extract nearest element from candidates to query
      let nearestIdx = 0
      let nearestDist = euclideanDistance(query, candidates[0])

      for (let i = 1; i < candidates.length; i++) {
        const dist = euclideanDistance(query, candidates[i])
        if (dist < nearestDist) {
          nearestDist = dist
          nearestIdx = i
        }
      }

      const c = candidates.splice(nearestIdx, 1)[0]
      allCandidates.push(c)

      // Get furthest element from w to query
      const furthestInW = w.reduce((furthest, point) => {
        const dist = euclideanDistance(query, point)
        const furthestDist = euclideanDistance(query, furthest)
        return dist > furthestDist ? point : furthest
      })

      const furthestDist = euclideanDistance(query, furthestInW)

      if (nearestDist > furthestDist) {
        break // All elements in w are evaluated
      }

      // Get neighbors of c at current layer
      const neighbors = this.getNeighbors(c, layer)

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id)
          allVisited.push(neighbor)

          const neighborDist = euclideanDistance(query, neighbor)
          const currentFurthestDist = euclideanDistance(query, furthestInW)

          if (neighborDist < currentFurthestDist || w.length < ef) {
            candidates.push(neighbor)
            w.push(neighbor)

            if (w.length > ef) {
              // Remove furthest element from w
              let furthestIdx = 0
              let maxDist = euclideanDistance(query, w[0])

              for (let i = 1; i < w.length; i++) {
                const dist = euclideanDistance(query, w[i])
                if (dist > maxDist) {
                  maxDist = dist
                  furthestIdx = i
                }
              }

              w.splice(furthestIdx, 1)
            }
          }
        }
      }
    }

    return {
      nearest: w,
      candidates: allCandidates,
      visited: allVisited,
    }
  }

  private getNeighbors(point: Point, layer: number): Point[] {
    const neighbors: Point[] = []
    const edges = this.graph.edges.filter(
      (edge) => edge.layer === layer && (edge.from === point.id || edge.to === point.id),
    )

    for (const edge of edges) {
      const neighborId = edge.from === point.id ? edge.to : edge.from
      const neighbor = this.graph.points.find((p) => p.id === neighborId)
      if (neighbor && neighbor.layer >= layer) {
        neighbors.push(neighbor)
      }
    }

    return neighbors
  }
}
