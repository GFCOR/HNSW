"use client"

import type React from "react"
import { useMemo } from "react"
import type { GrafoHNSW, Nodo, EstadoBusqueda } from "../types/hnsw"

interface VisualizadorGrafoProps {
  grafo: GrafoHNSW
  estadoActual: EstadoBusqueda | null
  puntoConsulta: Nodo | null
  capaVisible: number
}

export const VisualizadorGrafo: React.FC<VisualizadorGrafoProps> = ({
  grafo,
  estadoActual,
  puntoConsulta,
  capaVisible,
}) => {
  const obtenerColorNodo = (nodo: Nodo): string => {
    if (nodo.esEntrada) return "#dc2626" // Rojo - Punto de entrada

    if (estadoActual) {
      if (estadoActual.vecinosEncontrados.some((v) => v.id === nodo.id)) {
        return "#16a34a" // Verde - Vecinos encontrados
      }
      if (estadoActual.visitados.some((v) => v.id === nodo.id)) {
        return "#ea580c" // Naranja - Visitados
      }
      if (estadoActual.candidatos.some((c) => c.id === nodo.id)) {
        return "#2563eb" // Azul - Candidatos
      }
      if (estadoActual.nodoActual.id === nodo.id) {
        return "#7c3aed" // Púrpura - Nodo actual
      }
    }

    return nodo.capaMaxima >= capaVisible ? "#374151" : "#d1d5db"
  }

  const obtenerTamanoNodo = (nodo: Nodo): number => {
    if (nodo.esEntrada) return 12
    if (estadoActual?.nodoActual.id === nodo.id) return 10
    if (estadoActual?.vecinosEncontrados.some((v) => v.id === nodo.id)) return 9
    return nodo.capaMaxima >= capaVisible ? 8 : 5
  }

  const deberiasMostrarNodo = (nodo: Nodo): boolean => {
    return nodo.capaMaxima >= capaVisible
  }

  const deberiasMostrarArista = (arista: any): boolean => {
    return arista.capa === capaVisible
  }

  const aristasVisibles = useMemo(() => {
    return grafo.aristas.filter(deberiasMostrarArista)
  }, [grafo.aristas, capaVisible])

  const nodosVisibles = useMemo(() => {
    return grafo.nodos.filter(deberiasMostrarNodo)
  }, [grafo.nodos, capaVisible])

  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h3 className="text-xl font-bold">{grafo.nombre}</h3>
        <p className="text-blue-100 text-sm">{grafo.descripcion}</p>
        <div className="mt-2 flex items-center gap-4">
          <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">Capa {capaVisible}</span>
          {estadoActual && (
            <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Paso {estadoActual.paso}
            </span>
          )}
        </div>
      </div>

      {/* Área de visualización */}
      <div className="relative bg-gray-50" style={{ height: "500px" }}>
        <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute inset-0">
          {/* Renderizar aristas */}
          {aristasVisibles.map((arista, index) => {
            const nodoDesde = grafo.nodos.find((n) => n.id === arista.desde)
            const nodoHacia = grafo.nodos.find((n) => n.id === arista.hacia)

            if (!nodoDesde || !nodoHacia || !deberiasMostrarNodo(nodoDesde) || !deberiasMostrarNodo(nodoHacia)) {
              return null
            }

            return (
              <line
                key={`arista-${index}`}
                x1={nodoDesde.x}
                y1={nodoDesde.y}
                x2={nodoHacia.x}
                y2={nodoHacia.y}
                stroke="#6b7280"
                strokeWidth="2"
                opacity="0.6"
                className="transition-all duration-300"
              />
            )
          })}

          {/* Renderizar nodos */}
          {nodosVisibles.map((nodo) => (
            <g key={`nodo-${nodo.id}`} className="transition-all duration-300">
              <circle
                cx={nodo.x}
                cy={nodo.y}
                r={obtenerTamanoNodo(nodo)}
                fill={obtenerColorNodo(nodo)}
                stroke="#ffffff"
                strokeWidth="2"
                className="drop-shadow-sm"
              />
              <text
                x={nodo.x}
                y={nodo.y - obtenerTamanoNodo(nodo) - 8}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#374151"
                className="select-none"
              >
                {nodo.etiqueta}
              </text>
              {estadoActual?.distancias[nodo.id] && (
                <text
                  x={nodo.x}
                  y={nodo.y + obtenerTamanoNodo(nodo) + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                  className="select-none"
                >
                  d: {estadoActual.distancias[nodo.id].toFixed(1)}
                </text>
              )}
            </g>
          ))}

          {/* Renderizar punto de consulta */}
          {puntoConsulta && (
            <g className="transition-all duration-300">
              <circle
                cx={puntoConsulta.x}
                cy={puntoConsulta.y}
                r="10"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="3"
                className="drop-shadow-md"
              />
              <text
                x={puntoConsulta.x}
                y={puntoConsulta.y - 18}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#be185d"
                className="select-none"
              >
                Consulta
              </text>
            </g>
          )}
        </svg>

        {/* Leyenda */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Leyenda</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Punto de Entrada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span>Punto de Consulta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span>Vecinos Encontrados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <span>Nodos Visitados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>Candidatos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span>Nodo Actual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
