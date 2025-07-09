import type { Punto } from "../types/hnsw"

export function distanciaEuclidiana(p1: Punto, p2: Punto): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

export function encontrarVecinosCercanos(consulta: Punto, candidatos: Punto[], k: number): Punto[] {
  return candidatos
    .map((punto) => ({
      punto,
      distancia: distanciaEuclidiana(consulta, punto),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, k)
    .map((item) => item.punto)
}
