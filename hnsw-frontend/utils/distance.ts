import type { Point } from "../types/hnsw"

export function euclideanDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

export function findNearestNeighbors(query: Point, candidates: Point[], k: number): Point[] {
  return candidates
    .map((point) => ({
      point,
      distance: euclideanDistance(query, point),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map((item) => item.point)
}
