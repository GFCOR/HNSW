"use client"

import { useState, useEffect, useCallback } from "react"
import type { GrafoHNSW, Punto, PasoBusqueda } from "./types/hnsw"
import { BuscadorHNSW } from "./algorithms/busqueda-hnsw"
import { modeloSimple, modeloClusters } from "./data/modelos-grafo"
import { VisualizacionCapas } from "./components/visualizacion-capas"
import { ControlesBusqueda } from "./components/controles-busqueda"
import { ResultadosBusqueda } from "./components/resultados-busqueda"
import { ControlesAnimacion } from "./components/controles-animacion"

export default function AppBusquedaHNSW() {
  const [modeloActual, setModeloActual] = useState<"simple" | "clusters">("simple")
  const [grafo, setGrafo] = useState<GrafoHNSW>(modeloSimple)
  const [buscador, setBuscador] = useState<BuscadorHNSW>(new BuscadorHNSW(modeloSimple))
  const [pasosBusqueda, setPasosBusqueda] = useState<PasoBusqueda[]>([])
  const [pasoActual, setPasoActual] = useState<number>(0)
  const [puntoConsulta, setPuntoConsulta] = useState<Punto | null>(null)
  const [estaBuscando, setEstaBuscando] = useState<boolean>(false)
  const [estaReproduciendo, setEstaReproduciendo] = useState<boolean>(false)
  const [velocidadAnimacion, setVelocidadAnimacion] = useState<number>(1000)

  // Actualizar grafo cuando cambia el modelo
  useEffect(() => {
    const nuevoGrafo = modeloActual === "simple" ? modeloSimple : modeloClusters
    setGrafo(nuevoGrafo)
    setBuscador(new BuscadorHNSW(nuevoGrafo))
    setPasosBusqueda([])
    setPasoActual(0)
    setPuntoConsulta(null)
    setEstaBuscando(false)
    setEstaReproduciendo(false)
  }, [modeloActual])

  // Efecto de animación
  useEffect(() => {
    if (!estaReproduciendo || pasosBusqueda.length === 0) return

    const temporizador = setTimeout(() => {
      if (pasoActual < pasosBusqueda.length - 1) {
        setPasoActual((prev) => prev + 1)
      } else {
        setEstaReproduciendo(false)
      }
    }, velocidadAnimacion)

    return () => clearTimeout(temporizador)
  }, [estaReproduciendo, pasoActual, pasosBusqueda.length, velocidadAnimacion])

  const manejarCambioModelo = (modelo: "simple" | "clusters") => {
    setModeloActual(modelo)
  }

  const manejarBusqueda = useCallback(
    async (puntoCons: Punto, k: number, ef: number) => {
      setEstaBuscando(true)
      setPuntoConsulta(puntoCons)

      try {
        // Simular búsqueda asíncrona para mejor UX
        await new Promise((resolve) => setTimeout(resolve, 100))

        const pasos = buscador.buscarKNN(puntoCons, k, ef)
        setPasosBusqueda(pasos)
        setPasoActual(0)
        setEstaReproduciendo(false)
      } catch (error) {
        console.error("Error en la búsqueda:", error)
      } finally {
        setEstaBuscando(false)
      }
    },
    [buscador],
  )

  const manejarReproducir = () => setEstaReproduciendo(true)
  const manejarPausar = () => setEstaReproduciendo(false)
  const manejarDetener = () => {
    setEstaReproduciendo(false)
    setPasoActual(0)
  }

  const manejarSiguiente = () => {
    if (pasoActual < pasosBusqueda.length - 1) {
      setPasoActual((prev) => prev + 1)
    }
  }

  const manejarAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual((prev) => prev - 1)
    }
  }

  const obtenerCapaActual = (): number => {
    if (pasosBusqueda.length === 0 || pasoActual >= pasosBusqueda.length) {
      return 0
    }
    return pasosBusqueda[pasoActual].capa
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="text-center bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Visualizador de Búsqueda HNSW</h1>
          <p className="text-gray-600 text-lg">
            Demostración interactiva del algoritmo Hierarchical Navigable Small World
          </p>
          <div className="mt-4 flex justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IucNxFCOMzT1TyAVv4aHDbZdKIxKDQ.png"
              alt="Estructura HNSW"
              className="h-20 opacity-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Columna Izquierda - Controles */}
          <div className="xl:col-span-1 space-y-4">
            <ControlesBusqueda
              onBuscar={manejarBusqueda}
              onCambiarModelo={manejarCambioModelo}
              modeloActual={modeloActual}
              estaBuscando={estaBuscando}
            />

            <ControlesAnimacion
              estaReproduciendo={estaReproduciendo}
              pasoActual={pasoActual}
              totalPasos={pasosBusqueda.length}
              capaActual={obtenerCapaActual()}
              onReproducir={manejarReproducir}
              onPausar={manejarPausar}
              onDetener={manejarDetener}
              onCambioPaso={setPasoActual}
              onSiguiente={manejarSiguiente}
              onAnterior={manejarAnterior}
              velocidadAnimacion={velocidadAnimacion}
              onCambioVelocidad={setVelocidadAnimacion}
            />
          </div>

          {/* Columna Central - Visualización */}
          <div className="xl:col-span-2">
            <VisualizacionCapas
              grafo={grafo}
              pasosBusqueda={pasosBusqueda}
              pasoActual={pasoActual}
              puntoConsulta={puntoConsulta}
            />
          </div>

          {/* Columna Derecha - Resultados */}
          <div className="xl:col-span-1">
            <ResultadosBusqueda pasosBusqueda={pasosBusqueda} pasoActual={pasoActual} puntoConsulta={puntoConsulta} />
          </div>
        </div>

        {/* Información del Algoritmo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📚 Cómo Funciona el Algoritmo HNSW</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-3 text-gray-700">🔄 Proceso de Búsqueda:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>
                  <strong>Capa Superior:</strong> Comienza en el punto de entrada (rojo) de la capa más alta
                </li>
                <li>
                  <strong>Búsqueda Greedy:</strong> Encuentra el punto más cercano usando conexiones largas
                </li>
                <li>
                  <strong>Descender:</strong> Baja a la siguiente capa usando el punto encontrado
                </li>
                <li>
                  <strong>Repetir:</strong> Repite hasta llegar a la capa 0
                </li>
                <li>
                  <strong>Resultado:</strong> En la capa 0, encuentra los K vecinos más cercanos
                </li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-3 text-gray-700">⚙️ Parámetros Importantes:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <strong className="text-pink-600">Punto de Consulta (Q):</strong> Las coordenadas que estás buscando
                </li>
                <li>
                  <strong className="text-green-600">K:</strong> Número de vecinos más cercanos a encontrar
                </li>
                <li>
                  <strong className="text-blue-600">ef:</strong> Amplitud de búsqueda (mayor = más preciso)
                </li>
                <li>
                  <strong className="text-red-600">Punto de Entrada:</strong> Nodo inicial en la capa superior
                </li>
                <li>
                  <strong className="text-gray-600">Capas:</strong> Estructura jerárquica para búsqueda eficiente
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">💡 ¿Por qué es eficiente?</h4>
            <p className="text-sm text-blue-700">
              HNSW combina la estructura de capas jerárquicas con grafos de mundo pequeño navegable. Las capas
              superiores tienen pocas conexiones largas para "saltar" rápidamente por el espacio, mientras que las capas
              inferiores tienen más conexiones cortas para búsqueda precisa. Esto logra complejidad logarítmica O(log N)
              en lugar de lineal O(N).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
