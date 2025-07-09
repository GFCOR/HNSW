"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import type { Punto } from "../types/hnsw"

interface ControlesBusquedaProps {
  onBuscar: (puntoConsulta: Punto, k: number, ef: number) => void
  onCambiarModelo: (modelo: "simple" | "clusters") => void
  modeloActual: "simple" | "clusters"
  estaBuscando: boolean
}

export const ControlesBusqueda: React.FC<ControlesBusquedaProps> = ({
  onBuscar,
  onCambiarModelo,
  modeloActual,
  estaBuscando,
}) => {
  const [consultaX, setConsultaX] = useState<number>(150)
  const [consultaY, setConsultaY] = useState<number>(100)
  const [k, setK] = useState<number>(3)
  const [ef, setEf] = useState<number>(3)

  const manejarBusqueda = () => {
    const puntoConsulta: Punto = {
      id: -1,
      x: consultaX,
      y: consultaY,
      capa: 0,
      capaMaxima: 0,
    }
    onBuscar(puntoConsulta, k, ef)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Controles de Búsqueda HNSW
          <Badge variant="outline">Algoritmo del Paper</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selección de Modelo */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Modelo de Grafo:</label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant={modeloActual === "simple" ? "default" : "outline"}
              onClick={() => onCambiarModelo("simple")}
              disabled={estaBuscando}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Modelo Simple</div>
                <div className="text-xs opacity-70">Grafo básico para aprender</div>
              </div>
            </Button>
            <Button
              variant={modeloActual === "clusters" ? "default" : "outline"}
              onClick={() => onCambiarModelo("clusters")}
              disabled={estaBuscando}
              className="justify-start"
            >
              <div className="text-left">
                <div className="font-medium">Modelo con Clusters</div>
                <div className="text-xs opacity-70">Datos agrupados en clusters</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Punto de Consulta */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Punto de Consulta <span className="text-pink-600">(Q)</span>:
          </label>
          <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <p className="text-xs text-pink-700 mb-3">
              <strong>¿Qué es?</strong> El punto que estás buscando. El algoritmo encontrará los puntos más cercanos a
              estas coordenadas.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Coordenada X: <span className="text-pink-600">{consultaX}</span>
                </label>
                <Input
                  type="number"
                  value={consultaX}
                  onChange={(e) => setConsultaX(Number(e.target.value))}
                  min="0"
                  max="400"
                  disabled={estaBuscando}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Coordenada Y: <span className="text-pink-600">{consultaY}</span>
                </label>
                <Input
                  type="number"
                  value={consultaY}
                  onChange={(e) => setConsultaY(Number(e.target.value))}
                  min="0"
                  max="250"
                  disabled={estaBuscando}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parámetros de Búsqueda */}
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              K (Vecinos a encontrar): <span className="text-green-600 font-bold">{k}</span>
            </label>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 mb-2">
                <strong>¿Qué es K?</strong> Cuántos puntos más cercanos quieres encontrar. Por ejemplo, si K=3,
                encontrará los 3 puntos más cercanos.
              </p>
              <Slider
                value={[k]}
                onValueChange={(value) => setK(value[0])}
                min={1}
                max={5}
                step={1}
                disabled={estaBuscando}
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              ef (Amplitud de búsqueda): <span className="text-blue-600 font-bold">{ef}</span>
            </label>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 mb-2">
                <strong>¿Qué es ef?</strong> Controla qué tan amplia es la búsqueda. Valores más altos = más precisión
                pero más lento.
              </p>
              <Slider
                value={[ef]}
                onValueChange={(value) => setEf(value[0])}
                min={1}
                max={8}
                step={1}
                disabled={estaBuscando}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Botón de Búsqueda */}
        <Button onClick={manejarBusqueda} disabled={estaBuscando} className="w-full" size="lg">
          {estaBuscando ? "Buscando..." : "🔍 Iniciar Búsqueda"}
        </Button>

        {/* Información del Algoritmo */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-800 mb-2">💡 Cómo funciona:</h4>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>Comienza en el punto de entrada (rojo) en la capa superior</li>
            <li>Busca el punto más cercano en esa capa</li>
            <li>Baja a la siguiente capa y repite</li>
            <li>En la capa 0, encuentra los K vecinos más cercanos</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
