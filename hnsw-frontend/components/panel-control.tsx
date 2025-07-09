"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react'
import type { Nodo } from "../types/hnsw"

interface PanelControlProps {
  onIniciarBusqueda: (puntoConsulta: Nodo, k: number, ef: number) => void
  onCargarModelo: () => void
  estaEjecutando: boolean
  onReproducir: () => void
  onPausar: () => void
  onReiniciar: () => void
  onSiguiente: () => void
  onAnterior: () => void
  pasoActual: number
  totalPasos: number
  velocidad: number
  onCambiarVelocidad: (velocidad: number) => void
}

export const PanelControl: React.FC<PanelControlProps> = ({
  onIniciarBusqueda,
  onCargarModelo,
  estaEjecutando,
  onReproducir,
  onPausar,
  onReiniciar,
  onSiguiente,
  onAnterior,
  pasoActual,
  totalPasos,
  velocidad,
  onCambiarVelocidad,
}) => {
  const [consultaX, setConsultaX] = useState<number>(320)
  const [consultaY, setConsultaY] = useState<number>(280)
  const [k, setK] = useState<number>(3)
  const [ef, setEf] = useState<number>(3)

  const manejarIniciarBusqueda = () => {
    const puntoConsulta: Nodo = {
      id: -1,
      x: consultaX,
      y: consultaY,
      capa: 0,
      capaMaxima: 0,
      etiqueta: "q",
    }
    onIniciarBusqueda(puntoConsulta, k, ef)
  }

  return (
    <div className="space-y-6">
      {/* Carga del Modelo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            Modelo HNSW
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onCargarModelo} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Cargar Modelo Jerárquico
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Estructura de 3 capas según especificaciones del paper Malkov & Yashunin
          </p>
        </CardContent>
      </Card>

      {/* Parámetros de Búsqueda según el Paper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-green-600">🎯</span>
            Parámetros del Algoritmo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Punto de Consulta q */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Punto de Consulta <code className="bg-gray-100 px-1 rounded">q</code> (Coordenadas Euclidianas)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">x-coordinate</label>
                <Input
                  type="number"
                  value={consultaX}
                  onChange={(e) => setConsultaX(Number(e.target.value))}
                  min="50"
                  max="750"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">y-coordinate</label>
                <Input
                  type="number"
                  value={consultaY}
                  onChange={(e) => setConsultaY(Number(e.target.value))}
                  min="50"
                  max="450"
                  className="mt-1"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Coordenadas del elemento de consulta en el espacio métrico euclidiano
            </p>
          </div>

          {/* Parámetro K */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Parámetro <code className="bg-gray-100 px-1 rounded">K</code> (Vecinos más cercanos):{" "}
              <Badge variant="outline">{k}</Badge>
            </label>
            <Slider value={[k]} onValueChange={(value) => setK(value[0])} min={1} max={5} step={1} className="w-full" />
            <p className="text-xs text-gray-500">
              Número de vecinos más cercanos a retornar (línea 8 del Algoritmo 5)
            </p>
          </div>

          {/* Parámetro ef */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Parámetro <code className="bg-gray-100 px-1 rounded">ef</code> (Tamaño de lista dinámica):{" "}
              <Badge variant="outline">{ef}</Badge>
            </label>
            <Slider
              value={[ef]}
              onValueChange={(value) => setEf(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Tamaño de la lista dinámica de candidatos (línea 7 del Algoritmo 5). Capas superiores usan ef=1
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Configuración Actual:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Punto de consulta q: ({consultaX}, {consultaY})</div>
              <div>• K-NN search con K = {k}</div>
              <div>• ef = {ef} para capa 0, ef = 1 para capas superiores</div>
              <div>• Distancia: Euclidiana L₂</div>
            </div>
          </div>

          <Button
            onClick={manejarIniciarBusqueda}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
            disabled={estaEjecutando}
          >
            🔍 Ejecutar Algoritmo K-NN-SEARCH
          </Button>
        </CardContent>
      </Card>

      {/* Controles de Animación */}
      {totalPasos > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-purple-600">🎬</span>
              Control de Ejecución
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Controles de reproducción */}
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={onAnterior} disabled={pasoActual === 0}>
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={estaEjecutando ? onPausar : onReproducir}>
                {estaEjecutando ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>

              <Button variant="outline" size="sm" onClick={onReiniciar}>
                <RotateCcw className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={onSiguiente} disabled={pasoActual === totalPasos - 1}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Progreso del algoritmo */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Paso {pasoActual + 1} de {totalPasos}
                </span>
                <span>{Math.round(((pasoActual + 1) / totalPasos) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}
                />
              </div>
            </div>

            {/* Control de velocidad */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Velocidad de Ejecución</label>
              <Slider
                value={[velocidad]}
                onValueChange={(value) => onCambiarVelocidad(value[0])}
                min={500}
                max={3000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Rápida (500ms)</span>
                <span>Lenta (3000ms)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Paper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-amber-600">📚</span>
            Referencia del Paper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-600 space-y-2">
            <div>
              <strong>Algoritmo 5:</strong> K-NN-SEARCH(hnsw, q, K, ef)
            </div>
            <div>
              <strong>Algoritmo 2:</strong> SEARCH-LAYER(q, ep, ef, lc)
            </div>
            <div>
              <strong>Complejidad:</strong> O(log N) para datos de baja dimensión
            </div>
            <div>
              <strong>Autores:</strong> Yu. A. Malkov, D. A. Yashunin
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
