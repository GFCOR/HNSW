import type { HNSWGraph } from "../types/hnsw"

// Model 1: Clustered data with clear separation
export const clusteredModel: HNSWGraph = {
  layers: 3,
  entryPoint: 0,
  points: [
    // Layer 2 (top layer) - entry point
    { id: 0, x: 400, y: 300, layer: 2, maxLayer: 2 },

    // Layer 1 - hub nodes
    { id: 1, x: 200, y: 200, layer: 1, maxLayer: 1 },
    { id: 2, x: 600, y: 200, layer: 1, maxLayer: 1 },
    { id: 3, x: 400, y: 500, layer: 1, maxLayer: 1 },

    // Layer 0 - all nodes including clusters
    { id: 4, x: 150, y: 150, layer: 0, maxLayer: 0 },
    { id: 5, x: 180, y: 180, layer: 0, maxLayer: 0 },
    { id: 6, x: 220, y: 160, layer: 0, maxLayer: 0 },
    { id: 7, x: 170, y: 220, layer: 0, maxLayer: 0 },

    { id: 8, x: 580, y: 180, layer: 0, maxLayer: 0 },
    { id: 9, x: 620, y: 160, layer: 0, maxLayer: 0 },
    { id: 10, x: 600, y: 220, layer: 0, maxLayer: 0 },
    { id: 11, x: 640, y: 200, layer: 0, maxLayer: 0 },

    { id: 12, x: 380, y: 480, layer: 0, maxLayer: 0 },
    { id: 13, x: 420, y: 520, layer: 0, maxLayer: 0 },
    { id: 14, x: 360, y: 520, layer: 0, maxLayer: 0 },
    { id: 15, x: 440, y: 480, layer: 0, maxLayer: 0 },
  ],
  edges: [
    // Layer 2 connections
    { from: 0, to: 1, layer: 2 },
    { from: 0, to: 2, layer: 2 },
    { from: 0, to: 3, layer: 2 },

    // Layer 1 connections
    { from: 1, to: 2, layer: 1 },
    { from: 1, to: 3, layer: 1 },
    { from: 2, to: 3, layer: 1 },
    { from: 1, to: 4, layer: 1 },
    { from: 2, to: 8, layer: 1 },
    { from: 3, to: 12, layer: 1 },

    // Layer 0 connections - cluster 1
    { from: 4, to: 5, layer: 0 },
    { from: 4, to: 6, layer: 0 },
    { from: 4, to: 7, layer: 0 },
    { from: 5, to: 6, layer: 0 },
    { from: 5, to: 7, layer: 0 },
    { from: 6, to: 7, layer: 0 },

    // Layer 0 connections - cluster 2
    { from: 8, to: 9, layer: 0 },
    { from: 8, to: 10, layer: 0 },
    { from: 8, to: 11, layer: 0 },
    { from: 9, to: 10, layer: 0 },
    { from: 9, to: 11, layer: 0 },
    { from: 10, to: 11, layer: 0 },

    // Layer 0 connections - cluster 3
    { from: 12, to: 13, layer: 0 },
    { from: 12, to: 14, layer: 0 },
    { from: 12, to: 15, layer: 0 },
    { from: 13, to: 14, layer: 0 },
    { from: 13, to: 15, layer: 0 },
    { from: 14, to: 15, layer: 0 },

    // Inter-cluster connections
    { from: 1, to: 8, layer: 0 },
    { from: 2, to: 12, layer: 0 },
    { from: 3, to: 4, layer: 0 },
  ],
}

// Model 2: Uniform distribution with hierarchical structure
export const uniformModel: HNSWGraph = {
  layers: 3,
  entryPoint: 16,
  points: [
    // Layer 2 (top layer) - entry point
    { id: 16, x: 400, y: 300, layer: 2, maxLayer: 2 },

    // Layer 1 - distributed hubs
    { id: 17, x: 250, y: 250, layer: 1, maxLayer: 1 },
    { id: 18, x: 550, y: 250, layer: 1, maxLayer: 1 },
    { id: 19, x: 400, y: 150, layer: 1, maxLayer: 1 },
    { id: 20, x: 400, y: 450, layer: 1, maxLayer: 1 },

    // Layer 0 - uniform distribution
    { id: 21, x: 150, y: 200, layer: 0, maxLayer: 0 },
    { id: 22, x: 300, y: 100, layer: 0, maxLayer: 0 },
    { id: 23, x: 500, y: 120, layer: 0, maxLayer: 0 },
    { id: 24, x: 650, y: 180, layer: 0, maxLayer: 0 },
    { id: 25, x: 180, y: 350, layer: 0, maxLayer: 0 },
    { id: 26, x: 320, y: 380, layer: 0, maxLayer: 0 },
    { id: 27, x: 480, y: 400, layer: 0, maxLayer: 0 },
    { id: 28, x: 620, y: 350, layer: 0, maxLayer: 0 },
    { id: 29, x: 350, y: 250, layer: 0, maxLayer: 0 },
    { id: 30, x: 450, y: 280, layer: 0, maxLayer: 0 },
    { id: 31, x: 200, y: 450, layer: 0, maxLayer: 0 },
    { id: 32, x: 600, y: 480, layer: 0, maxLayer: 0 },
  ],
  edges: [
    // Layer 2 connections
    { from: 16, to: 17, layer: 2 },
    { from: 16, to: 18, layer: 2 },
    { from: 16, to: 19, layer: 2 },
    { from: 16, to: 20, layer: 2 },

    // Layer 1 connections
    { from: 17, to: 18, layer: 1 },
    { from: 17, to: 19, layer: 1 },
    { from: 17, to: 20, layer: 1 },
    { from: 18, to: 19, layer: 1 },
    { from: 18, to: 20, layer: 1 },
    { from: 19, to: 20, layer: 1 },

    // Layer 0 connections - creating a well-connected graph
    { from: 21, to: 17, layer: 0 },
    { from: 21, to: 25, layer: 0 },
    { from: 22, to: 19, layer: 0 },
    { from: 22, to: 29, layer: 0 },
    { from: 23, to: 19, layer: 0 },
    { from: 23, to: 30, layer: 0 },
    { from: 24, to: 18, layer: 0 },
    { from: 24, to: 28, layer: 0 },
    { from: 25, to: 17, layer: 0 },
    { from: 25, to: 31, layer: 0 },
    { from: 26, to: 20, layer: 0 },
    { from: 26, to: 29, layer: 0 },
    { from: 27, to: 20, layer: 0 },
    { from: 27, to: 30, layer: 0 },
    { from: 28, to: 18, layer: 0 },
    { from: 28, to: 32, layer: 0 },
    { from: 29, to: 30, layer: 0 },
    { from: 29, to: 17, layer: 0 },
    { from: 30, to: 18, layer: 0 },
    { from: 31, to: 32, layer: 0 },
    { from: 31, to: 26, layer: 0 },
    { from: 32, to: 27, layer: 0 },
  ],
}
