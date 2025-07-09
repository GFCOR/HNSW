import type { GrafoHNSW, Punto, PasoBusqueda } from "../types/hnsw"
import { distanciaEuclidiana, encontrarVecinosCercanos } from "../utils/distancia"

export class BuscadorHNSW {
  private grafo: GrafoHNSW

  constructor(grafo: GrafoHNSW) {
    this.grafo = grafo
  }

  // Algoritmo 5: Búsqueda K-NN del paper
  public buscarKNN(consulta: Punto, k: number, ef = 1): PasoBusqueda[] {
    const pasos: PasoBusqueda[] = []
    const puntoEntrada = this.grafo.puntos.find((p) => p.id === this.grafo.puntoEntrada)!
    let capaActual = this.grafo.capas - 1
    let ep = puntoEntrada

    // Búsqueda desde la capa superior hasta la capa 1
    while (capaActual > 0) {
      const resultadoCapa = this.buscarEnCapa(consulta, [ep], 1, capaActual)
      ep = resultadoCapa.cercanos[0]

      pasos.push({
        puntoActual: ep,
        candidatos: resultadoCapa.candidatos,
        visitados: resultadoCapa.visitados,
        capa: capaActual,
        vecinosCercanos: resultadoCapa.cercanos.map((p) => ({
          punto: p,
          distancia: distanciaEuclidiana(consulta, p),
          visitado: true,
        })),
        descripcion: `Capa ${capaActual}: Búsqueda greedy para encontrar el punto más cercano. Se encontró el punto ${ep.id} como mínimo local.`,
      })

      capaActual--
    }

    // Búsqueda en la capa 0 con parámetro ef
    const resultadoFinal = this.buscarEnCapa(consulta, [ep], ef, 0)
    const kCercanos = encontrarVecinosCercanos(consulta, resultadoFinal.cercanos, k)

    pasos.push({
      puntoActual: ep,
      candidatos: resultadoFinal.candidatos,
      visitados: resultadoFinal.visitados,
      capa: 0,
      vecinosCercanos: kCercanos.map((p) => ({
        punto: p,
        distancia: distanciaEuclidiana(consulta, p),
        visitado: true,
      })),
      descripcion: `Capa 0: Búsqueda final con ef=${ef}. Se encontraron los ${k} vecinos más cercanos al punto de consulta.`,
    })

    return pasos
  }

  // Algoritmo 2: SEARCH-LAYER del paper
  private buscarEnCapa(
    consulta: Punto,
    puntosEntrada: Punto[],
    ef: number,
    capa: number,
  ): { cercanos: Punto[]; candidatos: Punto[]; visitados: Punto[] } {
    const visitados = new Set<number>()
    const candidatos: Punto[] = [...puntosEntrada]
    const w: Punto[] = [...puntosEntrada]
    const todosCandidatos: Punto[] = []
    const todosVisitados: Punto[] = []

    puntosEntrada.forEach((ep) => {
      visitados.add(ep.id)
      todosVisitados.push(ep)
    })

    while (candidatos.length > 0) {
      // Extraer el elemento más cercano de candidatos a la consulta
      let indiceCercano = 0
      let distanciaCercana = distanciaEuclidiana(consulta, candidatos[0])

      for (let i = 1; i < candidatos.length; i++) {
        const dist = distanciaEuclidiana(consulta, candidatos[i])
        if (dist < distanciaCercana) {
          distanciaCercana = dist
          indiceCercano = i
        }
      }

      const c = candidatos.splice(indiceCercano, 1)[0]
      todosCandidatos.push(c)

      // Obtener el elemento más lejano de w a la consulta
      const masLejanoEnW = w.reduce((lejano, punto) => {
        const dist = distanciaEuclidiana(consulta, punto)
        const distanciaLejana = distanciaEuclidiana(consulta, lejano)
        return dist > distanciaLejana ? punto : lejano
      })

      const distanciaLejana = distanciaEuclidiana(consulta, masLejanoEnW)

      if (distanciaCercana > distanciaLejana) {
        break // Todos los elementos en w están evaluados
      }

      // Obtener vecinos de c en la capa actual
      const vecinos = this.obtenerVecinos(c, capa)

      for (const vecino of vecinos) {
        if (!visitados.has(vecino.id)) {
          visitados.add(vecino.id)
          todosVisitados.push(vecino)

          const distanciaVecino = distanciaEuclidiana(consulta, vecino)
          const distanciaActualLejana = distanciaEuclidiana(consulta, masLejanoEnW)

          if (distanciaVecino < distanciaActualLejana || w.length < ef) {
            candidatos.push(vecino)
            w.push(vecino)

            if (w.length > ef) {
              // Remover el elemento más lejano de w
              let indiceLejano = 0
              let distanciaMax = distanciaEuclidiana(consulta, w[0])

              for (let i = 1; i < w.length; i++) {
                const dist = distanciaEuclidiana(consulta, w[i])
                if (dist > distanciaMax) {
                  distanciaMax = dist
                  indiceLejano = i
                }
              }

              w.splice(indiceLejano, 1)
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

  private obtenerVecinos(punto: Punto, capa: number): Punto[] {
    const vecinos: Punto[] = []
    const aristas = this.grafo.aristas.filter(
      (arista) => arista.capa === capa && (arista.desde === punto.id || arista.hacia === punto.id),
    )

    for (const arista of aristas) {
      const idVecino = arista.desde === punto.id ? arista.hacia : arista.desde
      const vecino = this.grafo.puntos.find((p) => p.id === idVecino)
      if (vecino && vecino.capa >= capa) {
        vecinos.push(vecino)
      }
    }

    return vecinos
  }
}
