import type { GrafoHNSW, Nodo, EstadoBusqueda } from "../types/hnsw"

export function calcularDistanciaEuclidiana(nodo1: Nodo, nodo2: Nodo): number {
  const dx = nodo1.x - nodo2.x
  const dy = nodo1.y - nodo2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export class AlgoritmoHNSW {
  private grafo: GrafoHNSW

  constructor(grafo: GrafoHNSW) {
    this.grafo = grafo
  }

  // Implementación exacta del Algoritmo 5: K-NN-SEARCH del paper
  public buscarVecinosCercanos(puntoConsulta: Nodo, k: number, ef: number): EstadoBusqueda[] {
    const estados: EstadoBusqueda[] = []
    let paso = 1

    // Obtener punto de entrada (línea 2 del algoritmo)
    const puntoEntrada = this.grafo.nodos.find((n) => n.id === this.grafo.puntoEntrada)!
    let capaActual = this.grafo.capas - 1 // L = nivel del punto de entrada
    let ep = puntoEntrada

    // Líneas 4-6: Búsqueda desde la capa superior hasta la capa 1
    while (capaActual > 0) {
      const resultado = this.buscarEnCapa(puntoConsulta, [ep], 1, capaActual) // ef=1 para capas superiores
      ep = resultado.cercanos[0] || ep

      const distancias: { [key: number]: number } = {}
      resultado.visitados.forEach((nodo) => {
        distancias[nodo.id] = calcularDistanciaEuclidiana(puntoConsulta, nodo)
      })

      estados.push({
        nodoActual: ep,
        candidatos: resultado.candidatos,
        visitados: resultado.visitados,
        vecinosEncontrados: resultado.cercanos,
        capa: capaActual,
        paso: paso++,
        descripcion: `Capa ${capaActual}: Búsqueda greedy con ef=1. Encontrado mínimo local: "${ep.etiqueta}" en coordenadas (${ep.x}, ${ep.y}). Distancia al punto de consulta: ${calcularDistanciaEuclidiana(puntoConsulta, ep).toFixed(2)}`,
        distancias,
        ef: 1,
        k,
      })

      capaActual--
    }

    // Línea 7: Búsqueda final en la capa 0 con parámetro ef
    const resultadoFinal = this.buscarEnCapa(puntoConsulta, [ep], ef, 0)
    const kCercanos = this.seleccionarKCercanos(puntoConsulta, resultadoFinal.cercanos, k)

    const distanciasFinal: { [key: number]: number } = {}
    resultadoFinal.visitados.forEach((nodo) => {
      distanciasFinal[nodo.id] = calcularDistanciaEuclidiana(puntoConsulta, nodo)
    })

    estados.push({
      nodoActual: ep,
      candidatos: resultadoFinal.candidatos,
      visitados: resultadoFinal.visitados,
      vecinosEncontrados: kCercanos,
      capa: 0,
      paso: paso++,
      descripcion: `Capa 0: Búsqueda final con ef=${ef}. Encontrados ${k} vecinos más cercanos. Punto de entrada para esta capa: "${ep.etiqueta}" (${ep.x}, ${ep.y})`,
      distancias: distanciasFinal,
      ef,
      k,
    })

    return estados
  }

  // Implementación exacta del Algoritmo 2: SEARCH-LAYER del paper
  private buscarEnCapa(
    consulta: Nodo,
    puntosEntrada: Nodo[],
    ef: number,
    capa: number,
  ): { cercanos: Nodo[]; candidatos: Nodo[]; visitados: Nodo[] } {
    const visitados = new Set<number>() // v ← ep
    const candidatos: Nodo[] = [...puntosEntrada] // C ← ep
    const w: Nodo[] = [...puntosEntrada] // W ← ep
    const todosCandidatos: Nodo[] = []
    const todosVisitados: Nodo[] = []

    // Marcar puntos de entrada como visitados
    puntosEntrada.forEach((ep) => {
      visitados.add(ep.id)
      todosVisitados.push(ep)
    })

    // Líneas 4-17: Bucle principal del algoritmo SEARCH-LAYER
    while (candidatos.length > 0) {
      // Línea 5: extraer el elemento más cercano de C a q
      const c = this.extraerMasCercano(consulta, candidatos)
      todosCandidatos.push(c)

      // Línea 6: obtener el elemento más lejano de W a q
      const f = this.obtenerMasLejano(consulta, w)

      // Línea 7-8: condición de parada
      if (calcularDistanciaEuclidiana(consulta, c) > calcularDistanciaEuclidiana(consulta, f)) {
        break // todos los elementos en W están evaluados
      }

      // Línea 9: examinar vecinos de c en la capa lc
      const vecinos = this.obtenerVecinos(c, capa)

      for (const vecino of vecinos) {
        // Línea 10-17: procesar cada vecino
        if (!visitados.has(vecino.id)) {
          visitados.add(vecino.id)
          todosVisitados.push(vecino)

          const distVecino = calcularDistanciaEuclidiana(consulta, vecino)
          const distLejano = calcularDistanciaEuclidiana(consulta, f)

          // Línea 13: condición para agregar a candidatos
          if (distVecino < distLejano || w.length < ef) {
            candidatos.push(vecino)
            w.push(vecino)

            // Línea 16-17: mantener solo ef elementos en W
            if (w.length > ef) {
              this.extraerMasLejano(consulta, w)
            }
          }
        }
      }
    }

    return {
      cercanos: w,
      candidatos: todosCandidatos,
      visitados: todosVisitados,
    }
  }

  private obtenerVecinos(nodo: Nodo, capa: number): Nodo[] {
    const vecinos: Nodo[] = []
    const aristasRelevantes = this.grafo.aristas.filter(
      (arista) => arista.capa === capa && (arista.desde === nodo.id || arista.hacia === nodo.id),
    )

    for (const arista of aristasRelevantes) {
      const idVecino = arista.desde === nodo.id ? arista.hacia : arista.desde
      const vecino = this.grafo.nodos.find((n) => n.id === idVecino)
      if (vecino && vecino.capaMaxima >= capa) {
        vecinos.push(vecino)
      }
    }

    return vecinos
  }

  private extraerMasCercano(consulta: Nodo, nodos: Nodo[]): Nodo {
    let indiceMasCercano = 0
    let distanciaMinima = calcularDistanciaEuclidiana(consulta, nodos[0])

    for (let i = 1; i < nodos.length; i++) {
      const distancia = calcularDistanciaEuclidiana(consulta, nodos[i])
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia
        indiceMasCercano = i
      }
    }

    return nodos.splice(indiceMasCercano, 1)[0]
  }

  private obtenerMasLejano(consulta: Nodo, nodos: Nodo[]): Nodo {
    let masLejano = nodos[0]
    let distanciaMaxima = calcularDistanciaEuclidiana(consulta, nodos[0])

    for (let i = 1; i < nodos.length; i++) {
      const distancia = calcularDistanciaEuclidiana(consulta, nodos[i])
      if (distancia > distanciaMaxima) {
        distanciaMaxima = distancia
        masLejano = nodos[i]
      }
    }

    return masLejano
  }

  private extraerMasLejano(consulta: Nodo, nodos: Nodo[]): Nodo {
    let indiceMasLejano = 0
    let distanciaMaxima = calcularDistanciaEuclidiana(consulta, nodos[0])

    for (let i = 1; i < nodos.length; i++) {
      const distancia = calcularDistanciaEuclidiana(consulta, nodos[i])
      if (distancia > distanciaMaxima) {
        distanciaMaxima = distancia
        indiceMasLejano = i
      }
    }

    return nodos.splice(indiceMasLejano, 1)[0]
  }

  private seleccionarKCercanos(consulta: Nodo, nodos: Nodo[], k: number): Nodo[] {
    return nodos
      .map((nodo) => ({
        nodo,
        distancia: calcularDistanciaEuclidiana(consulta, nodo),
      }))
      .sort((a, b) => a.distancia - b.distancia)
      .slice(0, k)
      .map((item) => item.nodo)
  }
}
