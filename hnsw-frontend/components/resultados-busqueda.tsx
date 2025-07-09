"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PasoBusqueda } from "../types/hnsw"

interface ResultadosBusquedaProps {
  pasosBusqueda: PasoBusqueda[]
  pasoActual: number
  puntoConsulta: { x: number; y: number } | null
}

export const ResultadosBusqueda: React.FC<ResultadosBusquedaProps> = ({ pasosBusqueda, pasoActual, puntoConsulta }) => {
  const pasoActualBusqueda = pasosBusqueda[pasoActual]

  if (!pasoActualBusqueda || !puntoConsulta) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Resultados de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            👆 Configura los parámetros y haz clic en "Iniciar Búsqueda" para ver los resultados
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Resultados - Paso {pasoActual + 1}</span>
          <Badge variant="outline">Capa {pasoActualBusqueda.capa}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Descripción del paso actual */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">{pasoActualBusqueda.descripcion}</p>
        </div>

        {/* Información del punto actual */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Punto Actual:</h4>
            <p className="text-lg font-bold text-gray-900">
              {pasoActualBusqueda.puntoActual.etiqueta || `Punto ${pasoActualBusqueda.puntoActual.id}`}
            </p>
            <p className="text-xs text-gray-600">
              ({pasoActualBusqueda.puntoActual.x}, {pasoActualBusqueda.puntoActual.y})
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Capa Actual:</h4>
            <p className="text-lg font-bold text-gray-900">{pasoActualBusqueda.capa}</p>
            <p className="text-xs text-gray-600">
              {pasoActualBusqueda.capa === 2 && "Capa superior - conexiones largas"}
              {pasoActualBusqueda.capa === 1 && "Capa media - conexiones medianas"}
              {pasoActualBusqueda.capa === 0 && "Capa base - todas las conexiones"}
            </p>
          </div>
        </div>

        {/* Vecinos más cercanos encontrados */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Vecinos Más Cercanos Encontrados:
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {pasoActualBusqueda.vecinosCercanos.length > 0 ? (
              pasoActualBusqueda.vecinosCercanos.map((resultado, index) => (
                <div key={resultado.punto.id} className="bg-green-50 p-2 rounded border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-800">
                      #{index + 1} - {resultado.punto.etiqueta || `Punto ${resultado.punto.id}`}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Distancia: {resultado.distancia.toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-xs text-green-600">
                    Coordenadas: ({resultado.punto.x}, {resultado.punto.y})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Ningún vecino encontrado en este paso</p>
            )}
          </div>
        </div>

        {/* Estadísticas del paso */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
            <div className="text-lg font-bold text-orange-600">{pasoActualBusqueda.visitados.length}</div>
            <div className="text-xs text-orange-700">Puntos Visitados</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{pasoActualBusqueda.candidatos.length}</div>
            <div className="text-xs text-blue-700">Candidatos</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
            <div className="text-lg font-bold text-green-600">{pasoActualBusqueda.vecinosCercanos.length}</div>
            <div className="text-xs text-green-700">Vecinos Encontrados</div>
          </div>
        </div>

        {/* Mensaje final */}
        {pasoActual === pasosBusqueda.length - 1 && (
          <div className="bg-green-100 p-4 rounded-lg border border-green-300">
            <h4 className="text-sm font-medium text-green-800 mb-1">🎉 ¡Búsqueda Completada!</h4>
            <p className="text-sm text-green-700">
              Se encontraron {pasoActualBusqueda.vecinosCercanos.length} vecinos más cercanos al punto de consulta (
              {puntoConsulta.x}, {puntoConsulta.y}).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
