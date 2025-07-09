export interface Nodo {
  id: number
  x: number
  y: number
  capa: number
  capaMaxima: number
  etiqueta: string
  esEntrada?: boolean
}

export interface Arista {
  desde: number
  hacia: number
  capa: number
}

export interface GrafoHNSW {
  nombre: string
  descripcion: string
  nodos: Nodo[]
  aristas: Arista[]
  capas: number
  puntoEntrada: number
}

export interface EstadoBusqueda {
  nodoActual: Nodo
  candidatos: Nodo[]
  visitados: Nodo[]
  vecinosEncontrados: Nodo[]
  capa: number
  paso: number
  descripcion: string
  distancias: { [key: number]: number }
  ef: number
  k: number
}

export interface ResultadoBusqueda {
  nodo: Nodo
  distancia: number
  orden: number
}
