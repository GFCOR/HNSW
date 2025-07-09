"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EstadoBusqueda } from "../types/hnsw"

interface PanelInformacionProps {
  estadoActual: EstadoBusqueda | null
  puntoConsulta: { x: number; y: number } | null
}

export const PanelInformacion: React.FC<PanelInformacionProps> = ({ estadoActual, puntoConsulta }) => {
  if (!estadoActual || !puntoConsulta) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-600">📋</span>
            Información del Algoritmo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">🚀 Listo para comenzar</p>
            <p className="text-sm">
              Carga un modelo y configura los parámetros de búsqueda para iniciar la demostración
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Estado Actual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="text-blue-600">📋</span>
              Estado Actual
            </span>
            <Badge variant="outline">Paso {estadoActual.paso}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Descripción del paso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">{estadoActual.descripcion}</p>
          </div>

          {/* Información de la capa */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Capa Actual</h4>
              <p className="text-2xl font-bold text-gray-900">{estadoActual.capa}</p>
              <p className="text-xs text-gray-600">
                {estadoActual.capa === 2 && "Conexiones largas"}
                {estadoActual.capa === 1 && "Conexiones medianas"}
                {estadoActual.capa === 0 && "Conexiones locales"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Nodo Actual</h4>
              <p className="text-lg font-bold text-gray-900">{estadoActual.nodoActual.etiqueta}</p>
              <p className="text-xs text-gray-600">
                ({estadoActual.nodoActual.x}, {estadoActual.nodoActual.y})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-green-600">🎯</span>
            Vecinos Encontrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estadoActual.vecinosEncontrados.length > 0 ? (
            <div className="space-y-2">
              {estadoActual.vecinosEncontrados.map((vecino, index) => {
                const distancia = estadoActual.distancias[vecino.id] || 0
                return (
                  <div key={vecino.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-green-800">
                        #{index + 1} - {vecino.etiqueta}
                      </span>
                      <Badge variant="outline" className="text-green-700">
                        d: {distancia.toFixed(1)}
                      </Badge>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Coordenadas: ({vecino.x}, {vecino.y})
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No se han encontrado vecinos en este paso</p>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-orange-600">📊</span>
            Estadísticas del Paso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-orange-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-orange-600">{estadoActual.visitados.length}</p>
              <p className="text-xs text-orange-700">Visitados</p>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-blue-600">{estadoActual.candidatos.length}</p>
              <p className="text-xs text-blue-700">Candidatos</p>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{estadoActual.vecinosEncontrados.length}</p>
              <p className="text-xs text-green-700">Encontrados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
