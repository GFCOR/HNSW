"use client"

import type React from "react"
import type { GrafoHNSW, Punto, PasoBusqueda } from "../types/hnsw"

interface VisualizacionCapasProps {
  grafo: GrafoHNSW
  pasosBusqueda: PasoBusqueda[]
  pasoActual: number
  puntoConsulta: Punto | null
}

export const VisualizacionCapas: React.FC<VisualizacionCapasProps> = ({
  grafo,
  pasosBusqueda,
  pasoActual,
  puntoConsulta,
}) => {
  const obtenerColorPunto = (punto: Punto, capa: number): string => {
    if (punto.id === grafo.puntoEntrada) return "#e74c3c" // Punto de entrada - rojo

    const pasoActualBusqueda = pasosBusqueda[pasoActual]
    if (pasoActualBusqueda && pasoActualBusqueda.capa === capa) {
      if (pasoActualBusqueda.vecinosCercanos.some((vn) => vn.punto.id === punto.id)) {
        return "#27ae60" // Vecinos encontrados - verde
      }
      if (pasoActualBusqueda.visitados.some((v) => v.id === punto.id)) {
        return "#f39c12" // Visitados - naranja
      }
      if (pasoActualBusqueda.candidatos.some((c) => c.id === punto.id)) {
        return "#3498db" // Candidatos - azul
      }
    }

    return punto.capaMaxima >= capa ? "#2c3e50" : "#bdc3c7"
  }

  const obtenerRadioPunto = (punto: Punto, capa: number): number => {
    if (punto.id === grafo.puntoEntrada) return 8
    return punto.capaMaxima >= capa ? 6 : 4
  }

  const deberiasMostrarArista = (arista: any, capa: number): boolean => {
    return arista.capa === capa
  }

  const deberiasMostrarPunto = (punto: Punto, capa: number): boolean => {
    return punto.capaMaxima >= capa
  }

  const alturaCapas = [300, 200, 100] // Alturas para las capas 0, 1, 2

  return (
    <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Visualización por Capas - {grafo.nombre}</h3>
        <p className="text-sm text-gray-600">{grafo.descripcion}</p>
      </div>

      <div className="relative" style={{ height: "500px" }}>
        <svg width="100%" height="100%" viewBox="0 0 500 500">
          {/* Renderizar cada capa */}
          {[2, 1, 0].map((capa) => {
            const yOffset = alturaCapas[capa]
            const esCapaActiva = pasosBusqueda[pasoActual]?.capa === capa

            return (
              <g key={`capa-${capa}`}>
                {/* Fondo de la capa */}
                <rect
                  x="50"
                  y={yOffset - 20}
                  width="400"
                  height="120"
                  fill={esCapaActiva ? "#ecf0f1" : "#f8f9fa"}
                  stroke={esCapaActiva ? "#3498db" : "#dee2e6"}
                  strokeWidth={esCapaActiva ? "2" : "1"}
                  rx="8"
                  opacity="0.3"
                />

                {/* Etiqueta de la capa */}
                <text
                  x="60"
                  y={yOffset - 5}
                  fontSize="14"
                  fontWeight="bold"
                  fill={esCapaActiva ? "#2980b9" : "#6c757d"}
                >
                  Capa {capa}
                </text>

                {/* Renderizar aristas de esta capa */}
                {grafo.aristas
                  .filter((arista) => deberiasMostrarArista(arista, capa))
                  .map((arista, index) => {
                    const puntoDesde = grafo.puntos.find((p) => p.id === arista.desde)
                    const puntoHacia = grafo.puntos.find((p) => p.id === arista.hacia)

                    if (
                      !puntoDesde ||
                      !puntoHacia ||
                      !deberiasMostrarPunto(puntoDesde, capa) ||
                      !deberiasMostrarPunto(puntoHacia, capa)
                    ) {
                      return null
                    }

                    return (
                      <line
                        key={`arista-${capa}-${index}`}
                        x1={puntoDesde.x + 50}
                        y1={puntoDesde.y + yOffset}
                        x2={puntoHacia.x + 50}
                        y2={puntoHacia.y + yOffset}
                        stroke="#7f8c8d"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )
                  })}

                {/* Renderizar puntos de esta capa */}
                {grafo.puntos
                  .filter((punto) => deberiasMostrarPunto(punto, capa))
                  .map((punto) => (
                    <g key={`punto-${capa}-${punto.id}`}>
                      <circle
                        cx={punto.x + 50}
                        cy={punto.y + yOffset}
                        r={obtenerRadioPunto(punto, capa)}
                        fill={obtenerColorPunto(punto, capa)}
                        stroke="#2c3e50"
                        strokeWidth="1.5"
                      />
                      <text
                        x={punto.x + 50}
                        y={punto.y + yOffset - 12}
                        fontSize="10"
                        textAnchor="middle"
                        fill="#2c3e50"
                        fontWeight="bold"
                      >
                        {punto.etiqueta || punto.id}
                      </text>
                    </g>
                  ))}
              </g>
            )
          })}

          {/* Renderizar punto de consulta en todas las capas */}
          {puntoConsulta &&
            [2, 1, 0].map((capa) => {
              const yOffset = alturaCapas[capa]
              return (
                <g key={`consulta-${capa}`}>
                  <circle
                    cx={puntoConsulta.x + 50}
                    cy={puntoConsulta.y + yOffset}
                    r="8"
                    fill="#e91e63"
                    stroke="#ad1457"
                    strokeWidth="2"
                  />
                  <text
                    x={puntoConsulta.x + 50}
                    y={puntoConsulta.y + yOffset - 12}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#ad1457"
                    fontWeight="bold"
                  >
                    Q
                  </text>
                </g>
              )
            })}

          {/* Flecha indicando dirección de búsqueda */}
          <defs>
            <marker
              id="flecha"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#e74c3c" />
            </marker>
          </defs>

          <line x1="470" y1="120" x2="470" y2="380" stroke="#e74c3c" strokeWidth="3" markerEnd="url(#flecha)" />

          <text x="475" y="250" fontSize="12" fill="#e74c3c" fontWeight="bold" transform="rotate(90, 475, 250)">
            Dirección de Búsqueda
          </text>
        </svg>
      </div>

      {/* Leyenda */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Punto de Entrada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
            <span>Punto de Consulta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Vecinos Encontrados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>Puntos Visitados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Candidatos</span>
          </div>
        </div>
      </div>
    </div>
  )
}
