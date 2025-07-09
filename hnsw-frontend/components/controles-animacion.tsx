"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react"

interface ControlesAnimacionProps {
  estaReproduciendo: boolean
  pasoActual: number
  totalPasos: number
  capaActual: number
  onReproducir: () => void
  onPausar: () => void
  onDetener: () => void
  onCambioPaso: (paso: number) => void
  onSiguiente: () => void
  onAnterior: () => void
  velocidadAnimacion: number
  onCambioVelocidad: (velocidad: number) => void
}

export const ControlesAnimacion: React.FC<ControlesAnimacionProps> = ({
  estaReproduciendo,
  pasoActual,
  totalPasos,
  capaActual,
  onReproducir,
  onPausar,
  onDetener,
  onCambioPaso,
  onSiguiente,
  onAnterior,
  velocidadAnimacion,
  onCambioVelocidad,
}) => {
  if (totalPasos === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">🎬 Controles de Animación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles de Reproducción */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onAnterior} disabled={pasoActual === 0} title="Paso Anterior">
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={estaReproduciendo ? onPausar : onReproducir}
            title={estaReproduciendo ? "Pausar" : "Reproducir"}
          >
            {estaReproduciendo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={onDetener} title="Reiniciar">
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSiguiente}
            disabled={pasoActual === totalPasos - 1}
            title="Siguiente Paso"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicador de Progreso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Paso: {pasoActual + 1} / {totalPasos}
            </label>
            <div className="text-sm text-blue-600 font-medium">Capa {capaActual}</div>
          </div>
          <Slider
            value={[pasoActual]}
            onValueChange={(value) => onCambioPaso(value[0])}
            min={0}
            max={totalPasos - 1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Control de Velocidad */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Velocidad: {velocidadAnimacion === 500 && "Rápida"}
            {velocidadAnimacion === 1000 && "Normal"}
            {velocidadAnimacion === 1500 && "Lenta"}
            {velocidadAnimacion === 2000 && "Muy Lenta"}
          </label>
          <Slider
            value={[velocidadAnimacion]}
            onValueChange={(value) => onCambioVelocidad(value[0])}
            min={500}
            max={2000}
            step={500}
            className="w-full"
          />
        </div>

        {/* Información del Estado */}
        <div className="bg-gray-50 p-3 rounded-lg border text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-700">Estado:</span>
              <span className="ml-2 text-gray-600">{estaReproduciendo ? "🔄 Reproduciendo" : "⏸️ Pausado"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Progreso:</span>
              <span className="ml-2 text-gray-600">{Math.round(((pasoActual + 1) / totalPasos) * 100)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
