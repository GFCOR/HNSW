"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Layers, Grid, Search } from "lucide-react"
import type { GrafoHNSW, Nodo, EstadoBusqueda } from "../types/hnsw"

interface Visualizador3DCapasProps {
  grafo: GrafoHNSW
  estadoActual: EstadoBusqueda | null
  puntoConsulta: Nodo | null
  capaVisible?: number
}

export const Visualizador3DCapas: React.FC<Visualizador3DCapasProps> = ({ grafo, estadoActual, puntoConsulta }) => {
  const [vistaActual, setVistaActual] = useState<"general" | "individual">("general")
  const [capaSeleccionada, setCapaSeleccionada] = useState<number>(2)
  const [mostrarCoordenadas, setMostrarCoordenadas] = useState<boolean>(false)
  const [mostrarConexionesVerticales, setMostrarConexionesVerticales] = useState<boolean>(true)

  // Análisis del grafo
  const analisisGrafo = useMemo(() => {
    const nodosPorCapa = { 0: 0, 1: 0, 2: 0 }
    const aristasPorCapa = { 0: 0, 1: 0, 2: 0 }

    grafo.nodos.forEach((nodo) => {
      for (let capa = 0; capa <= nodo.capaMaxima; capa++) {
        nodosPorCapa[capa as keyof typeof nodosPorCapa]++
      }
    })

    grafo.aristas.forEach((arista) => {
      aristasPorCapa[arista.capa as keyof typeof aristasPorCapa]++
    })

    return { nodosPorCapa, aristasPorCapa }
  }, [grafo])

  const obtenerColorNodo = (nodo: Nodo, capa: number): string => {
    // Punto de entrada siempre rojo
    if (nodo.id === grafo.puntoEntrada) return "#dc2626"

    // Durante la búsqueda, mostrar estados específicos
    if (estadoActual && estadoActual.capa === capa) {
      // Nodo actual en púrpura brillante
      if (estadoActual.nodoActual.id === nodo.id) return "#8b5cf6"

      // Vecinos encontrados en verde brillante
      if (estadoActual.vecinosEncontrados.some((v) => v.id === nodo.id)) return "#10b981"

      // Nodos visitados en naranja
      if (estadoActual.visitados.some((v) => v.id === nodo.id)) return "#f59e0b"

      // Candidatos en azul
      if (estadoActual.candidatos.some((c) => c.id === nodo.id)) return "#3b82f6"
    }

    // Colores por defecto según la capa si el nodo existe en esa capa
    if (nodo.capaMaxima >= capa) {
      switch (capa) {
        case 2:
          return "#6366f1" // Índigo para capa 2
        case 1:
          return "#06b6d4" // Cian para capa 1
        case 0:
          return "#64748b" // Gris azulado para capa 0
        default:
          return "#374151"
      }
    }

    return "#e5e7eb" // Gris claro para nodos no visibles
  }

  const obtenerTamanoNodo = (nodo: Nodo): number => {
    if (nodo.id === grafo.puntoEntrada) return 12
    if (estadoActual?.nodoActual.id === nodo.id) return 11
    if (estadoActual?.vecinosEncontrados.some((v) => v.id === nodo.id)) return 10
    return 8
  }

  const deberiasMostrarNodo = (nodo: Nodo, capa: number): boolean => {
    return nodo.capaMaxima >= capa
  }

  const renderizarVistaGeneral = () => {
    const SVG_WIDTH = 1000
    const SVG_HEIGHT = 700
    const LAYER_HEIGHT = 180
    const LAYER_SPACING = 20
    const TOP_MARGIN = 60

    // Escalar coordenadas del grafo al espacio disponible
    const GRAPH_PADDING = 80
    const GRAPH_WIDTH = SVG_WIDTH - GRAPH_PADDING * 2
    const GRAPH_HEIGHT = LAYER_HEIGHT - 40

    const capaActiva = estadoActual?.capa ?? 2

    return (
      <div className="w-full h-[700px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          {/* Definiciones */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" />
            </pattern>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="3" dy="3" stdDeviation="4" floodOpacity="0.2" />
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Fondo con grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Renderizar capas de arriba hacia abajo */}
          {[2, 1, 0].map((capa) => {
            const yBase = TOP_MARGIN + (2 - capa) * (LAYER_HEIGHT + LAYER_SPACING)
            const esCapaActiva = capa === capaActiva
            const gradientId = `gradient-layer-${capa}`

            return (
              <g key={`layer-${capa}`}>
                {/* Gradiente para la capa */}
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={esCapaActiva ? "#dbeafe" : "#f8fafc"} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={esCapaActiva ? "#bfdbfe" : "#e2e8f0"} stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Sombra del plano */}
                <rect
                  x="22"
                  y={yBase + 3}
                  width={SVG_WIDTH - 40}
                  height={LAYER_HEIGHT}
                  fill="#000000"
                  opacity="0.1"
                  rx="12"
                />

                {/* Plano principal de la capa */}
                <rect
                  x="20"
                  y={yBase}
                  width={SVG_WIDTH - 40}
                  height={LAYER_HEIGHT}
                  fill={`url(#${gradientId})`}
                  stroke={esCapaActiva ? "#3b82f6" : "#cbd5e1"}
                  strokeWidth={esCapaActiva ? "3" : "2"}
                  rx="12"
                  filter="url(#shadow)"
                />

                {/* Etiqueta de la capa */}
                <rect
                  x="40"
                  y={yBase + 15}
                  width="100"
                  height="30"
                  fill={esCapaActiva ? "#3b82f6" : "#64748b"}
                  rx="8"
                />
                <text x="90" y={yBase + 35} fontSize="16" fontWeight="bold" fill="white" textAnchor="middle">
                  Layer {capa}
                </text>

                {/* Información de la capa */}
                <text
                  x="160"
                  y={yBase + 25}
                  fontSize="13"
                  fill={esCapaActiva ? "#1e40af" : "#475569"}
                  fontWeight="medium"
                >
                  {analisisGrafo.nodosPorCapa[capa as keyof typeof analisisGrafo.nodosPorCapa]} nodos
                </text>
                <text
                  x="160"
                  y={yBase + 40}
                  fontSize="13"
                  fill={esCapaActiva ? "#1e40af" : "#475569"}
                  fontWeight="medium"
                >
                  {analisisGrafo.aristasPorCapa[capa as keyof typeof analisisGrafo.aristasPorCapa]} conexiones
                </text>

                {/* Indicador de búsqueda activa */}
                {esCapaActiva && estadoActual && (
                  <g>
                    <rect x={SVG_WIDTH - 200} y={yBase + 15} width="150" height="30" fill="#10b981" rx="8" />
                    <text
                      x={SVG_WIDTH - 125}
                      y={yBase + 35}
                      fontSize="14"
                      fontWeight="bold"
                      fill="white"
                      textAnchor="middle"
                    >
                      🔍 BÚSQUEDA ACTIVA
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Conexiones verticales entre capas */}
          {mostrarConexionesVerticales &&
            grafo.nodos.map((nodo) => {
              if (nodo.capaMaxima < 1) return null

              const x = GRAPH_PADDING + (nodo.x / 700) * GRAPH_WIDTH
              const yTop = TOP_MARGIN + (2 - nodo.capaMaxima) * (LAYER_HEIGHT + LAYER_SPACING) + 60
              const yBottom = TOP_MARGIN + 2 * (LAYER_HEIGHT + LAYER_SPACING) + 60

              return (
                <line
                  key={`vertical-${nodo.id}`}
                  x1={x}
                  y1={yTop}
                  x2={x}
                  y2={yBottom}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  opacity="0.6"
                />
              )
            })}

          {/* Aristas por capa */}
          {grafo.aristas.map((arista, index) => {
            const nodoDesde = grafo.nodos.find((n) => n.id === arista.desde)
            const nodoHacia = grafo.nodos.find((n) => n.id === arista.hacia)
            if (!nodoDesde || !nodoHacia) return null

            const yOffset = TOP_MARGIN + (2 - arista.capa) * (LAYER_HEIGHT + LAYER_SPACING) + 60
            const x1 = GRAPH_PADDING + (nodoDesde.x / 700) * GRAPH_WIDTH
            const y1 = yOffset + (nodoDesde.y / 450) * GRAPH_HEIGHT
            const x2 = GRAPH_PADDING + (nodoHacia.x / 700) * GRAPH_WIDTH
            const y2 = yOffset + (nodoHacia.y / 450) * GRAPH_HEIGHT

            const esCapaActiva = arista.capa === capaActiva

            return (
              <line
                key={`edge-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={esCapaActiva ? "#374151" : "#9ca3af"}
                strokeWidth={esCapaActiva ? "2.5" : "1.5"}
                opacity={esCapaActiva ? "0.8" : "0.3"}
              />
            )
          })}

          {/* Nodos */}
          {grafo.nodos.map((nodo) => {
            const yOffset = TOP_MARGIN + (2 - nodo.capa) * (LAYER_HEIGHT + LAYER_SPACING) + 60
            const x = GRAPH_PADDING + (nodo.x / 700) * GRAPH_WIDTH
            const y = yOffset + (nodo.y / 450) * GRAPH_HEIGHT
            const radio = obtenerTamanoNodo(nodo)
            const color = obtenerColorNodo(nodo, nodo.capa)

            return (
              <g key={`node-${nodo.id}-${nodo.capa}`}>
                {/* Sombra del nodo */}
                <circle cx={x + 2} cy={y + 2} r={radio} fill="#000000" opacity="0.2" />

                {/* Nodo principal */}
                <circle
                  cx={x}
                  cy={y}
                  r={radio}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter={estadoActual?.nodoActual.id === nodo.id ? "url(#glow)" : "url(#shadow)"}
                />

                {/* Etiqueta del nodo */}
                <text x={x} y={y - radio - 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">
                  {nodo.etiqueta}
                </text>

                {/* Coordenadas si están habilitadas */}
                {mostrarCoordenadas && (
                  <text x={x} y={y + radio + 18} textAnchor="middle" fontSize="9" fill="#6b7280">
                    ({nodo.x}, {nodo.y})
                  </text>
                )}

                {/* Distancia durante la búsqueda */}
                {estadoActual?.distancias[nodo.id] && estadoActual.capa === nodo.capa && (
                  <text x={x + radio + 8} y={y - 5} fontSize="10" fill="#dc2626" fontWeight="bold">
                    d: {estadoActual.distancias[nodo.id].toFixed(1)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Punto de consulta */}
          {puntoConsulta && (
            <g>
              {/* Mostrar punto de consulta en todas las capas */}
              {[2, 1, 0].map((capa) => {
                const yOffset = TOP_MARGIN + (2 - capa) * (LAYER_HEIGHT + LAYER_SPACING) + 60
                const x = GRAPH_PADDING + (puntoConsulta.x / 700) * GRAPH_WIDTH
                const y = yOffset + (puntoConsulta.y / 450) * GRAPH_HEIGHT

                return (
                  <g key={`query-${capa}`}>
                    <circle cx={x + 2} cy={y + 2} r="14" fill="#000000" opacity="0.2" />
                    <circle cx={x} cy={y} r="14" fill="#ec4899" stroke="#ffffff" strokeWidth="3" filter="url(#glow)" />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">
                      Q
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Flecha indicando dirección de búsqueda */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
            </marker>
          </defs>

          <line
            x1={SVG_WIDTH - 50}
            y1={TOP_MARGIN + 20}
            x2={SVG_WIDTH - 50}
            y2={SVG_HEIGHT - 80}
            stroke="#dc2626"
            strokeWidth="4"
            markerEnd="url(#arrowhead)"
          />

          <text
            x={SVG_WIDTH - 45}
            y={SVG_HEIGHT / 2}
            fontSize="14"
            fill="#dc2626"
            fontWeight="bold"
            transform={`rotate(90, ${SVG_WIDTH - 45}, ${SVG_HEIGHT / 2})`}
          >
            DIRECCIÓN DE BÚSQUEDA
          </text>
        </svg>
      </div>
    )
  }

  const renderizarVistaIndividual = () => {
    const SVG_WIDTH = 1000
    const SVG_HEIGHT = 600
    const GRAPH_PADDING = 60
    const GRAPH_WIDTH = SVG_WIDTH - GRAPH_PADDING * 2
    const GRAPH_HEIGHT = SVG_HEIGHT - 120

    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <defs>
            <pattern id="grid-individual" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" />
            </pattern>
            <filter id="individual-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid-individual)" />

          {/* Encabezado de la capa */}
          <rect x="20" y="20" width="300" height="50" fill="#3b82f6" rx="12" />
          <text x="170" y="50" textAnchor="middle" fontSize="24" fontWeight="bold" fill="white">
            Layer {capaSeleccionada}
          </text>

          {/* Información de la capa */}
          <text x="340" y="35" fontSize="16" fill="#374151" fontWeight="medium">
            {analisisGrafo.nodosPorCapa[capaSeleccionada as keyof typeof analisisGrafo.nodosPorCapa]} nodos visibles
          </text>
          <text x="340" y="55" fontSize="16" fill="#374151" fontWeight="medium">
            {analisisGrafo.aristasPorCapa[capaSeleccionada as keyof typeof analisisGrafo.aristasPorCapa]} conexiones
          </text>

          {/* Estado de búsqueda */}
          {estadoActual && estadoActual.capa === capaSeleccionada && (
            <g>
              <rect x={SVG_WIDTH - 250} y="20" width="220" height="50" fill="#10b981" rx="12" />
              <text x={SVG_WIDTH - 140} y="50" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">
                🔍 BÚSQUEDA EN PROGRESO
              </text>
            </g>
          )}

          {/* Aristas de la capa seleccionada */}
          {grafo.aristas
            .filter((arista) => arista.capa === capaSeleccionada)
            .map((arista, index) => {
              const nodoDesde = grafo.nodos.find((n) => n.id === arista.desde)
              const nodoHacia = grafo.nodos.find((n) => n.id === arista.hacia)
              if (!nodoDesde || !nodoHacia) return null
              if (
                !deberiasMostrarNodo(nodoDesde, capaSeleccionada) ||
                !deberiasMostrarNodo(nodoHacia, capaSeleccionada)
              )
                return null

              const x1 = GRAPH_PADDING + (nodoDesde.x / 700) * GRAPH_WIDTH
              const y1 = 100 + (nodoDesde.y / 450) * GRAPH_HEIGHT
              const x2 = GRAPH_PADDING + (nodoHacia.x / 700) * GRAPH_WIDTH
              const y2 = 100 + (nodoHacia.y / 450) * GRAPH_HEIGHT

              return (
                <line
                  key={`edge-individual-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#374151"
                  strokeWidth="3"
                  opacity="0.7"
                />
              )
            })}

          {/* Nodos de la capa seleccionada */}
          {grafo.nodos
            .filter((nodo) => deberiasMostrarNodo(nodo, capaSeleccionada))
            .map((nodo) => {
              const x = GRAPH_PADDING + (nodo.x / 700) * GRAPH_WIDTH
              const y = 100 + (nodo.y / 450) * GRAPH_HEIGHT
              const radio = obtenerTamanoNodo(nodo) + 2
              const color = obtenerColorNodo(nodo, capaSeleccionada)

              return (
                <g key={`node-individual-${nodo.id}`}>
                  <circle cx={x + 2} cy={y + 2} r={radio} fill="#000000" opacity="0.2" />
                  <circle
                    cx={x}
                    cy={y}
                    r={radio}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="3"
                    filter={estadoActual?.nodoActual.id === nodo.id ? "url(#individual-glow)" : "none"}
                  />

                  <text x={x} y={y - radio - 12} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">
                    {nodo.etiqueta}
                  </text>

                  {mostrarCoordenadas && (
                    <text x={x} y={y + radio + 20} textAnchor="middle" fontSize="11" fill="#6b7280">
                      ({nodo.x}, {nodo.y})
                    </text>
                  )}

                  {estadoActual?.distancias[nodo.id] && estadoActual.capa === capaSeleccionada && (
                    <text x={x + radio + 10} y={y - 5} fontSize="12" fill="#dc2626" fontWeight="bold">
                      d: {estadoActual.distancias[nodo.id].toFixed(1)}
                    </text>
                  )}
                </g>
              )
            })}

          {/* Punto de consulta en vista individual */}
          {puntoConsulta && (
            <g>
              <circle
                cx={GRAPH_PADDING + (puntoConsulta.x / 700) * GRAPH_WIDTH + 2}
                cy={100 + (puntoConsulta.y / 450) * GRAPH_HEIGHT + 2}
                r="16"
                fill="#000000"
                opacity="0.2"
              />
              <circle
                cx={GRAPH_PADDING + (puntoConsulta.x / 700) * GRAPH_WIDTH}
                cy={100 + (puntoConsulta.y / 450) * GRAPH_HEIGHT}
                r="16"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="4"
                filter="url(#individual-glow)"
              />
              <text
                x={GRAPH_PADDING + (puntoConsulta.x / 700) * GRAPH_WIDTH}
                y={100 + (puntoConsulta.y / 450) * GRAPH_HEIGHT + 6}
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="white"
              >
                Q
              </text>
              {mostrarCoordenadas && (
                <text
                  x={GRAPH_PADDING + (puntoConsulta.x / 700) * GRAPH_WIDTH}
                  y={100 + (puntoConsulta.y / 450) * GRAPH_HEIGHT + 35}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#be185d"
                  fontWeight="bold"
                >
                  ({puntoConsulta.x}, {puntoConsulta.y})
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Visualización HNSW Interactiva
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={vistaActual === "general" ? "default" : "outline"}>
              {vistaActual === "general" ? "Vista General" : "Vista Individual"}
            </Badge>
            {estadoActual && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Search className="w-3 h-3 mr-1" />
                Paso {estadoActual.paso} - Capa {estadoActual.capa}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controles principales */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={vistaActual === "general" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActual("general")}
              className="flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              Vista General
            </Button>
            <Button
              variant={vistaActual === "individual" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActual("individual")}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Vista Individual
            </Button>
          </div>

          {vistaActual === "individual" && (
            <div className="flex gap-1">
              {[2, 1, 0].map((capa) => (
                <Button
                  key={capa}
                  variant={capaSeleccionada === capa ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCapaSeleccionada(capa)}
                >
                  Layer {capa}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMostrarCoordenadas(!mostrarCoordenadas)}
              className="flex items-center gap-1"
            >
              <Grid className="w-4 h-4" />
              {mostrarCoordenadas ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              Coords
            </Button>
            {vistaActual === "general" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarConexionesVerticales(!mostrarConexionesVerticales)}
              >
                Conexiones
              </Button>
            )}
          </div>
        </div>

        {/* Área de visualización */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          {vistaActual === "general" ? renderizarVistaGeneral() : renderizarVistaIndividual()}
        </div>

        {/* Leyenda mejorada */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm font-medium">Punto de Entrada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm font-medium">Punto de Consulta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm font-medium">Vecinos Encontrados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm font-medium">Nodo Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-sm font-medium">Nodos Visitados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
