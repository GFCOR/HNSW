"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calculator, Target, Route, Database } from "lucide-react"
import type { EstadoBusqueda } from "../types/hnsw"
import { calcularDistanciaEuclidiana } from "../utils/algoritmo-hnsw"

interface PanelInformacionDetalladaProps {
  estadoActual: EstadoBusqueda | null
  puntoConsulta: { x: number; y: number } | null
}

export const PanelInformacionDetallada: React.FC<PanelInformacionDetalladaProps> = ({
  estadoActual,
  puntoConsulta,
}) => {
  if (!estadoActual || !puntoConsulta) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Estado del Algoritmo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🚀</div>
              <p className="text-lg font-medium mb-2">Listo para Ejecutar</p>
              <p className="text-sm">
                Carga un modelo y configura los parámetros para iniciar la demostración del algoritmo HNSW
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">💡 Información del Algoritmo</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>
              <strong>Complejidad:</strong> O(log N) esperada
            </div>
            <div>
              <strong>Tipo:</strong> Búsqueda aproximada
            </div>
            <div>
              <strong>Estructura:</strong> Grafo multicapa
            </div>
            <div>
              <strong>Métrica:</strong> Distancia Euclidiana
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progreso = (estadoActual.paso / 10) * 100 // Estimación del progreso

  return (
    <div className="space-y-4">
      {/* Estado Actual del Algoritmo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Estado Actual
            </span>
            <Badge variant="outline" className="text-xs">
              Paso {estadoActual.paso}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Descripción del paso */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium leading-relaxed">{estadoActual.descripcion}</p>
          </div>

          {/* Información de la capa y nodo actual */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{estadoActual.capa}</div>
              <div className="text-xs text-purple-700 font-medium">Capa Actual</div>
              <div className="text-xs text-purple-600 mt-1">
                {estadoActual.capa === 2 && "Conexiones largas"}
                {estadoActual.capa === 1 && "Conexiones medias"}
                {estadoActual.capa === 0 && "Conexiones locales"}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">{estadoActual.nodoActual.etiqueta}</div>
              <div className="text-xs text-green-700 font-medium">Nodo Actual</div>
              <div className="text-xs text-green-600 mt-1">
                ({estadoActual.nodoActual.x}, {estadoActual.nodoActual.y})
              </div>
            </div>
          </div>

          {/* Parámetros del algoritmo */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Parámetros Activos:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">K:</span> {estadoActual.k}
              </div>
              <div>
                <span className="font-medium">ef:</span> {estadoActual.ef}
              </div>
              <div>
                <span className="font-medium">Consulta:</span> ({puntoConsulta.x}, {puntoConsulta.y})
              </div>
              <div>
                <span className="font-medium">Métrica:</span> Euclidiana
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vecinos Encontrados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-green-600" />
            Vecinos Más Cercanos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {estadoActual.vecinosEncontrados.length > 0 ? (
            <div className="space-y-2">
              {estadoActual.vecinosEncontrados.map((vecino, index) => {
                const distancia =
                  estadoActual.distancias[vecino.id] ||
                  calcularDistanciaEuclidiana({ x: puntoConsulta.x, y: puntoConsulta.y } as any, vecino)

                return (
                  <div key={vecino.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-green-800">
                        #{index + 1} - {vecino.etiqueta}
                      </span>
                      <Badge variant="outline" className="text-green-700 text-xs">
                        d = {distancia.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>
                        Coordenadas: ({vecino.x}, {vecino.y})
                      </div>
                      <div>Capa máxima: {vecino.capaMaxima}</div>
                      <div>
                        Cálculo: √[(({puntoConsulta.x}-{vecino.x})² + ({puntoConsulta.y}-{vecino.y})²)] ={" "}
                        {distancia.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-sm">No se han encontrado vecinos en este paso</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas Detalladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-orange-600" />
            Estadísticas del Paso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métricas principales */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center bg-orange-50 rounded-lg p-2">
              <div className="text-xl font-bold text-orange-600">{estadoActual.visitados.length}</div>
              <div className="text-xs text-orange-700">Visitados</div>
            </div>
            <div className="text-center bg-blue-50 rounded-lg p-2">
              <div className="text-xl font-bold text-blue-600">{estadoActual.candidatos.length}</div>
              <div className="text-xs text-blue-700">Candidatos</div>
            </div>
            <div className="text-center bg-green-50 rounded-lg p-2">
              <div className="text-xl font-bold text-green-600">{estadoActual.vecinosEncontrados.length}</div>
              <div className="text-xs text-green-700">Encontrados</div>
            </div>
          </div>

          <Separator />

          {/* Detalles de las estructuras de datos */}
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-1">Lista de Candidatos (C):</h5>
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                {estadoActual.candidatos.length > 0
                  ? estadoActual.candidatos.map((c) => c.etiqueta).join(", ")
                  : "Vacía"}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-1">Nodos Visitados (v):</h5>
              <div className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
                {estadoActual.visitados.length > 0
                  ? estadoActual.visitados.map((v) => v.etiqueta).join(", ")
                  : "Ninguno"}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-1">Lista Dinámica (W):</h5>
              <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                {estadoActual.vecinosEncontrados.length > 0
                  ? estadoActual.vecinosEncontrados.map((w) => w.etiqueta).join(", ")
                  : "Vacía"}
              </div>
            </div>
          </div>

          {/* Progreso estimado */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progreso Estimado:</span>
              <span>{Math.round(progreso)}%</span>
            </div>
            <Progress value={progreso} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Información Contextual */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">🎯 Contexto del Algoritmo</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Fase Actual:</strong> {estadoActual.capa > 0 ? "Búsqueda Greedy" : "Búsqueda Final"}
          </div>
          <div>
            <strong>Objetivo:</strong>{" "}
            {estadoActual.capa > 0 ? "Encontrar mínimo local" : `Encontrar ${estadoActual.k} vecinos más cercanos`}
          </div>
          <div>
            <strong>Estrategia:</strong>{" "}
            {estadoActual.capa > 0 ? "ef=1 (greedy puro)" : `ef=${estadoActual.ef} (búsqueda amplia)`}
          </div>
          <div>
            <strong>Siguiente:</strong> {estadoActual.capa > 0 ? "Descender a capa inferior" : "Finalizar algoritmo"}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
