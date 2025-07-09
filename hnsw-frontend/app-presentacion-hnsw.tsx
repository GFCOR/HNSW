"use client"

import { useState, useEffect, useCallback } from "react"
import type { GrafoHNSW, Nodo, EstadoBusqueda } from "./types/hnsw"
import { AlgoritmoHNSW } from "./utils/algoritmo-hnsw"
import { modeloClasico } from "./data/modelo-grafo"
import { Visualizador3DCapas } from "./components/visualizador-3d-capas"
import { PanelControl } from "./components/panel-control"
import { PanelInformacionDetallada } from "./components/panel-informacion-detallada"

export default function AppPresentacionHNSW() {
  const [grafo, setGrafo] = useState<GrafoHNSW | null>(null)
  const [algoritmo, setAlgoritmo] = useState<AlgoritmoHNSW | null>(null)
  const [estadosBusqueda, setEstadosBusqueda] = useState<EstadoBusqueda[]>([])
  const [pasoActual, setPasoActual] = useState<number>(0)
  const [puntoConsulta, setPuntoConsulta] = useState<Nodo | null>(null)
  const [estaEjecutando, setEstaEjecutando] = useState<boolean>(false)
  const [velocidadAnimacion, setVelocidadAnimacion] = useState<number>(2000)

  // Efecto para la animación automática
  useEffect(() => {
    if (!estaEjecutando || estadosBusqueda.length === 0) return

    const temporizador = setTimeout(() => {
      if (pasoActual < estadosBusqueda.length - 1) {
        setPasoActual((prev) => prev + 1)
      } else {
        setEstaEjecutando(false)
      }
    }, velocidadAnimacion)

    return () => clearTimeout(temporizador)
  }, [estaEjecutando, pasoActual, estadosBusqueda.length, velocidadAnimacion])

  const cargarModelo = useCallback(() => {
    setGrafo(modeloClasico)
    setAlgoritmo(new AlgoritmoHNSW(modeloClasico))
    setEstadosBusqueda([])
    setPasoActual(0)
    setPuntoConsulta(null)
    setEstaEjecutando(false)
  }, [])

  const iniciarBusqueda = useCallback(
    (puntoConsulta: Nodo, k: number, ef: number) => {
      if (!algoritmo) return

      setPuntoConsulta(puntoConsulta)
      const estados = algoritmo.buscarVecinosCercanos(puntoConsulta, k, ef)
      setEstadosBusqueda(estados)
      setPasoActual(0)
      setEstaEjecutando(false)
    },
    [algoritmo],
  )

  const reproducir = () => setEstaEjecutando(true)
  const pausar = () => setEstaEjecutando(false)
  const reiniciar = () => {
    setEstaEjecutando(false)
    setPasoActual(0)
  }

  const siguiente = () => {
    if (pasoActual < estadosBusqueda.length - 1) {
      setPasoActual((prev) => prev + 1)
    }
  }

  const anterior = () => {
    if (pasoActual > 0) {
      setPasoActual((prev) => prev - 1)
    }
  }

  const estadoActual = estadosBusqueda[pasoActual] || null
  const capaVisible = estadoActual?.capa ?? 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Encabezado de Presentación */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Algoritmo de Búsqueda HNSW</h1>
            <p className="text-xl text-gray-600 mb-4">Hierarchical Navigable Small World - Demostración Interactiva</p>
            <div className="flex justify-center items-center gap-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXAzONSRZmAZaTuE12jss9hr9wslrw.png"
                alt="Estructura HNSW"
                className="h-16 opacity-80"
              />
              <div className="text-left">
                <p className="text-sm text-gray-500">Basado en el paper de Yu. A. Malkov y D. A. Yashunin</p>
                <p className="text-sm text-gray-500">"Efficient and robust approximate nearest neighbor search"</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Control - Izquierda */}
          <div className="lg:col-span-1">
            <PanelControl
              onIniciarBusqueda={iniciarBusqueda}
              onCargarModelo={cargarModelo}
              estaEjecutando={estaEjecutando}
              onReproducir={reproducir}
              onPausar={pausar}
              onReiniciar={reiniciar}
              onSiguiente={siguiente}
              onAnterior={anterior}
              pasoActual={pasoActual}
              totalPasos={estadosBusqueda.length}
              velocidad={velocidadAnimacion}
              onCambiarVelocidad={setVelocidadAnimacion}
            />
          </div>

          {/* Visualizador Principal - Centro */}
          <div className="lg:col-span-2">
            {grafo ? (
              <Visualizador3DCapas
                grafo={grafo}
                estadoActual={estadoActual}
                puntoConsulta={puntoConsulta}
                capaVisible={capaVisible}
              />
            ) : (
              <div className="w-full h-[500px] bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Carga un Modelo</h3>
                  <p className="text-sm">Haz clic en "Cargar Modelo Clásico HNSW" para comenzar la demostración</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel de Información - Derecha */}
          <div className="lg:col-span-1">
            <PanelInformacionDetallada estadoActual={estadoActual} puntoConsulta={puntoConsulta} />
          </div>
        </div>

        {/* Información del Algoritmo */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fundamentos del Algoritmo HNSW</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">🔄 Proceso de Búsqueda</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </span>
                  <span>
                    <strong>Inicio en Capa Superior:</strong> Comienza en el punto de entrada de la capa más alta
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </span>
                  <span>
                    <strong>Búsqueda Greedy:</strong> Encuentra el nodo más cercano usando conexiones largas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </span>
                  <span>
                    <strong>Descenso de Capa:</strong> Baja a la siguiente capa con el nodo encontrado
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                    4
                  </span>
                  <span>
                    <strong>Búsqueda Final:</strong> En la capa 0, encuentra los K vecinos más cercanos
                  </span>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">⚙️ Parámetros Clave</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <strong className="text-green-800">K (Vecinos):</strong>
                  <p className="text-green-700 mt-1">Número de vecinos más cercanos a encontrar</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <strong className="text-blue-800">ef (Amplitud):</strong>
                  <p className="text-blue-700 mt-1">Controla la amplitud de búsqueda y precisión</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <strong className="text-purple-800">Capas:</strong>
                  <p className="text-purple-700 mt-1">Estructura jerárquica para búsqueda eficiente</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">💡 Ventajas del Algoritmo HNSW</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              HNSW combina la eficiencia de las estructuras jerárquicas con la navegabilidad de los grafos de mundo
              pequeño. Las capas superiores permiten "saltos" largos para localización rápida, mientras que las capas
              inferiores proporcionan búsqueda precisa local. Esto resulta en una complejidad logarítmica O(log N) en
              lugar de lineal O(N).
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
