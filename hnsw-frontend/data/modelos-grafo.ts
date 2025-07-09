import type { GrafoHNSW } from "../types/hnsw"

// Modelo 1: Ejemplo simple para demostración
export const modeloSimple: GrafoHNSW = {
  nombre: "Modelo Simple",
  descripcion: "Un grafo pequeño y fácil de entender para aprender cómo funciona HNSW",
  capas: 3,
  puntoEntrada: 0,
  puntos: [
    // Capa 2 (superior) - punto de entrada
    { id: 0, x: 200, y: 150, capa: 2, capaMaxima: 2, etiqueta: "Entrada" },

    // Capa 1 - nodos hub
    { id: 1, x: 100, y: 100, capa: 1, capaMaxima: 1, etiqueta: "Hub A" },
    { id: 2, x: 300, y: 100, capa: 1, capaMaxima: 1, etiqueta: "Hub B" },

    // Capa 0 - todos los nodos
    { id: 3, x: 50, y: 50, capa: 0, capaMaxima: 0, etiqueta: "Nodo 1" },
    { id: 4, x: 150, y: 50, capa: 0, capaMaxima: 0, etiqueta: "Nodo 2" },
    { id: 5, x: 250, y: 50, capa: 0, capaMaxima: 0, etiqueta: "Nodo 3" },
    { id: 6, x: 350, y: 50, capa: 0, capaMaxima: 0, etiqueta: "Nodo 4" },
    { id: 7, x: 75, y: 200, capa: 0, capaMaxima: 0, etiqueta: "Nodo 5" },
    { id: 8, x: 325, y: 200, capa: 0, capaMaxima: 0, etiqueta: "Nodo 6" },
  ],
  aristas: [
    // Capa 2 - conexiones largas
    { desde: 0, hacia: 1, capa: 2 },
    { desde: 0, hacia: 2, capa: 2 },

    // Capa 1 - conexiones medianas
    { desde: 1, hacia: 2, capa: 1 },
    { desde: 1, hacia: 3, capa: 1 },
    { desde: 1, hacia: 4, capa: 1 },
    { desde: 2, hacia: 5, capa: 1 },
    { desde: 2, hacia: 6, capa: 1 },

    // Capa 0 - conexiones cortas (todas)
    { desde: 3, hacia: 4, capa: 0 },
    { desde: 4, hacia: 5, capa: 0 },
    { desde: 5, hacia: 6, capa: 0 },
    { desde: 3, hacia: 7, capa: 0 },
    { desde: 6, hacia: 8, capa: 0 },
    { desde: 1, hacia: 7, capa: 0 },
    { desde: 2, hacia: 8, capa: 0 },
  ],
}

// Modelo 2: Ejemplo con clusters
export const modeloClusters: GrafoHNSW = {
  nombre: "Modelo con Clusters",
  descripcion: "Demuestra cómo HNSW maneja datos agrupados en clusters",
  capas: 3,
  puntoEntrada: 9,
  puntos: [
    // Capa 2 - punto de entrada central
    { id: 9, x: 200, y: 125, capa: 2, capaMaxima: 2, etiqueta: "Centro" },

    // Capa 1 - representantes de clusters
    { id: 10, x: 100, y: 75, capa: 1, capaMaxima: 1, etiqueta: "Rep. A" },
    { id: 11, x: 300, y: 75, capa: 1, capaMaxima: 1, etiqueta: "Rep. B" },
    { id: 12, x: 200, y: 200, capa: 1, capaMaxima: 1, etiqueta: "Rep. C" },

    // Capa 0 - Cluster A (izquierda)
    { id: 13, x: 80, y: 60, capa: 0, capaMaxima: 0, etiqueta: "A1" },
    { id: 14, x: 120, y: 60, capa: 0, capaMaxima: 0, etiqueta: "A2" },
    { id: 15, x: 100, y: 100, capa: 0, capaMaxima: 0, etiqueta: "A3" },

    // Capa 0 - Cluster B (derecha)
    { id: 16, x: 280, y: 60, capa: 0, capaMaxima: 0, etiqueta: "B1" },
    { id: 17, x: 320, y: 60, capa: 0, capaMaxima: 0, etiqueta: "B2" },
    { id: 18, x: 300, y: 100, capa: 0, capaMaxima: 0, etiqueta: "B3" },

    // Capa 0 - Cluster C (abajo)
    { id: 19, x: 180, y: 180, capa: 0, capaMaxima: 0, etiqueta: "C1" },
    { id: 20, x: 220, y: 180, capa: 0, capaMaxima: 0, etiqueta: "C2" },
    { id: 21, x: 200, y: 220, capa: 0, capaMaxima: 0, etiqueta: "C3" },
  ],
  aristas: [
    // Capa 2 - conexiones del centro
    { desde: 9, hacia: 10, capa: 2 },
    { desde: 9, hacia: 11, capa: 2 },
    { desde: 9, hacia: 12, capa: 2 },

    // Capa 1 - conexiones entre representantes
    { desde: 10, hacia: 11, capa: 1 },
    { desde: 10, hacia: 12, capa: 1 },
    { desde: 11, hacia: 12, capa: 1 },

    // Capa 0 - conexiones dentro de clusters
    // Cluster A
    { desde: 13, hacia: 14, capa: 0 },
    { desde: 13, hacia: 15, capa: 0 },
    { desde: 14, hacia: 15, capa: 0 },
    { desde: 10, hacia: 13, capa: 0 },
    { desde: 10, hacia: 15, capa: 0 },

    // Cluster B
    { desde: 16, hacia: 17, capa: 0 },
    { desde: 16, hacia: 18, capa: 0 },
    { desde: 17, hacia: 18, capa: 0 },
    { desde: 11, hacia: 16, capa: 0 },
    { desde: 11, hacia: 18, capa: 0 },

    // Cluster C
    { desde: 19, hacia: 20, capa: 0 },
    { desde: 19, hacia: 21, capa: 0 },
    { desde: 20, hacia: 21, capa: 0 },
    { desde: 12, hacia: 19, capa: 0 },
    { desde: 12, hacia: 21, capa: 0 },

    // Conexiones entre clusters
    { desde: 10, hacia: 11, capa: 0 },
    { desde: 11, hacia: 12, capa: 0 },
    { desde: 12, hacia: 10, capa: 0 },
  ],
}
