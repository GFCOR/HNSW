import type { GrafoHNSW } from "../types/hnsw"

// Modelo que sigue exactamente la estructura del paper con coordenadas específicas
export const modeloClasico: GrafoHNSW = {
  nombre: "Modelo HNSW Jerárquico - Según Paper Malkov & Yashunin",
  descripcion: "Implementación exacta del algoritmo con estructura de capas jerárquicas navegables",
  capas: 3,
  puntoEntrada: 1,
  nodos: [
    // Capa 2 (L=2) - Solo punto de entrada según el paper
    { id: 1, x: 400, y: 200, capa: 2, capaMaxima: 2, etiqueta: "EP", esEntrada: true },

    // Capa 1 (L=1) - Nodos hub con conexiones de escala media
    { id: 2, x: 200, y: 150, capa: 1, capaMaxima: 1, etiqueta: "H1" },
    { id: 3, x: 600, y: 150, capa: 1, capaMaxima: 1, etiqueta: "H2" },
    { id: 4, x: 400, y: 350, capa: 1, capaMaxima: 1, etiqueta: "H3" },
    { id: 5, x: 300, y: 100, capa: 1, capaMaxima: 1, etiqueta: "H4" },
    { id: 6, x: 500, y: 100, capa: 1, capaMaxima: 1, etiqueta: "H5" },

    // Capa 0 (L=0) - Todos los nodos con conexiones locales densas
    { id: 7, x: 150, y: 100, capa: 0, capaMaxima: 0, etiqueta: "N1" },
    { id: 8, x: 250, y: 80, capa: 0, capaMaxima: 0, etiqueta: "N2" },
    { id: 9, x: 350, y: 80, capa: 0, capaMaxima: 0, etiqueta: "N3" },
    { id: 10, x: 450, y: 80, capa: 0, capaMaxima: 0, etiqueta: "N4" },
    { id: 11, x: 550, y: 80, capa: 0, capaMaxima: 0, etiqueta: "N5" },
    { id: 12, x: 650, y: 100, capa: 0, capaMaxima: 0, etiqueta: "N6" },
    { id: 13, x: 100, y: 200, capa: 0, capaMaxima: 0, etiqueta: "N7" },
    { id: 14, x: 200, y: 220, capa: 0, capaMaxima: 0, etiqueta: "N8" },
    { id: 15, x: 300, y: 200, capa: 0, capaMaxima: 0, etiqueta: "N9" },
    { id: 16, x: 400, y: 220, capa: 0, capaMaxima: 0, etiqueta: "N10" },
    { id: 17, x: 500, y: 200, capa: 0, capaMaxima: 0, etiqueta: "N11" },
    { id: 18, x: 600, y: 220, capa: 0, capaMaxima: 0, etiqueta: "N12" },
    { id: 19, x: 700, y: 200, capa: 0, capaMaxima: 0, etiqueta: "N13" },
    { id: 20, x: 250, y: 320, capa: 0, capaMaxima: 0, etiqueta: "N14" },
    { id: 21, x: 350, y: 380, capa: 0, capaMaxima: 0, etiqueta: "N15" },
    { id: 22, x: 450, y: 380, capa: 0, capaMaxima: 0, etiqueta: "N16" },
    { id: 23, x: 550, y: 320, capa: 0, capaMaxima: 0, etiqueta: "N17" },
  ],
  aristas: [
    // Capa 2 - Conexiones largas desde el punto de entrada (según paper: conexiones de mayor escala)
    { desde: 1, hacia: 2, capa: 2 },
    { desde: 1, hacia: 3, capa: 2 },
    { desde: 1, hacia: 4, capa: 2 },

    // Capa 1 - Conexiones de escala media entre hubs
    { desde: 2, hacia: 3, capa: 1 },
    { desde: 2, hacia: 4, capa: 1 },
    { desde: 2, hacia: 5, capa: 1 },
    { desde: 3, hacia: 4, capa: 1 },
    { desde: 3, hacia: 6, capa: 1 },
    { desde: 4, hacia: 5, capa: 1 },
    { desde: 4, hacia: 6, capa: 1 },
    { desde: 5, hacia: 6, capa: 1 },
    { desde: 1, hacia: 5, capa: 1 },
    { desde: 1, hacia: 6, capa: 1 },

    // Capa 0 - Conexiones locales densas (aproximación del grafo de Delaunay)
    // Región superior
    { desde: 7, hacia: 8, capa: 0 },
    { desde: 8, hacia: 9, capa: 0 },
    { desde: 9, hacia: 10, capa: 0 },
    { desde: 10, hacia: 11, capa: 0 },
    { desde: 11, hacia: 12, capa: 0 },
    { desde: 7, hacia: 13, capa: 0 },
    { desde: 8, hacia: 14, capa: 0 },
    { desde: 9, hacia: 15, capa: 0 },
    { desde: 10, hacia: 16, capa: 0 },
    { desde: 11, hacia: 17, capa: 0 },
    { desde: 12, hacia: 18, capa: 0 },

    // Región media
    { desde: 13, hacia: 14, capa: 0 },
    { desde: 14, hacia: 15, capa: 0 },
    { desde: 15, hacia: 16, capa: 0 },
    { desde: 16, hacia: 17, capa: 0 },
    { desde: 17, hacia: 18, capa: 0 },
    { desde: 18, hacia: 19, capa: 0 },

    // Región inferior
    { desde: 14, hacia: 20, capa: 0 },
    { desde: 20, hacia: 21, capa: 0 },
    { desde: 21, hacia: 22, capa: 0 },
    { desde: 22, hacia: 23, capa: 0 },
    { desde: 17, hacia: 23, capa: 0 },

    // Conexiones verticales entre regiones
    { desde: 8, hacia: 15, capa: 0 },
    { desde: 15, hacia: 20, capa: 0 },
    { desde: 10, hacia: 17, capa: 0 },
    { desde: 16, hacia: 22, capa: 0 },

    // Conexiones diagonales para mantener conectividad
    { desde: 7, hacia: 14, capa: 0 },
    { desde: 9, hacia: 16, capa: 0 },
    { desde: 11, hacia: 18, capa: 0 },
    { desde: 15, hacia: 21, capa: 0 },
    { desde: 17, hacia: 22, capa: 0 },

    // Conexiones entre nodos de diferentes capas (proyecciones verticales)
    { desde: 2, hacia: 7, capa: 0 },
    { desde: 2, hacia: 8, capa: 0 },
    { desde: 2, hacia: 13, capa: 0 },
    { desde: 2, hacia: 14, capa: 0 },
    { desde: 3, hacia: 11, capa: 0 },
    { desde: 3, hacia: 12, capa: 0 },
    { desde: 3, hacia: 17, capa: 0 },
    { desde: 3, hacia: 18, capa: 0 },
    { desde: 4, hacia: 20, capa: 0 },
    { desde: 4, hacia: 21, capa: 0 },
    { desde: 4, hacia: 22, capa: 0 },
    { desde: 5, hacia: 8, capa: 0 },
    { desde: 5, hacia: 9, capa: 0 },
    { desde: 5, hacia: 15, capa: 0 },
    { desde: 6, hacia: 10, capa: 0 },
    { desde: 6, hacia: 11, capa: 0 },
    { desde: 6, hacia: 16, capa: 0 },
    { desde: 6, hacia: 17, capa: 0 },
  ],
}
