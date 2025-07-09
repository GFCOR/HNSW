# HNSW

**Integrantes:**  
- Federico Iribar  
- Gianfranco Cordero  
- José Huamaní  
- David Salaverry  

---

## Descripción general

- Implementación desde cero de la estructura de datos **HNSW (Hierarchical Navigable Small World)** en C++.
- Permite búsqueda eficiente de vecinos más cercanos (Nearest Neighbor Search) en espacios de alta dimensión.
- Aplicaciones en inteligencia artificial, recuperación de información y sistemas de recomendación.

---

## ¿Qué es HNSW?

- Estructura de grafo jerárquico para búsquedas aproximadas de los puntos más cercanos a un vector de consulta.
- Optimiza velocidad y precisión mediante organización multinivel.
- Reduce drásticamente el número de comparaciones frente a métodos tradicionales.

---

## ¿Cómo funciona?

- **Estructura jerárquica:**  
  - Nodos distribuidos en varios niveles.
  - Niveles superiores permiten saltos largos; inferiores refinan la búsqueda localmente.
- **Inserción:**  
  - Cada nuevo nodo se conecta a sus vecinos más cercanos en cada nivel.
  - Utiliza búsqueda greedy para encontrar los puntos de entrada óptimos.
- **Búsqueda:**  
  - La consulta inicia en el nivel más alto y desciende.
  - Siempre se elige el vecino más prometedor hasta llegar al nivel base.

---

## Complejidad temporal

- **Búsqueda:**  
  - Complejidad sublogarítmica en la práctica, típicamente \(O(\log N)\).
  - Mucho más eficiente que una búsqueda lineal.
- **Inserción:**  
  - Complejidad similar a la de búsqueda.
  - Solo se exploran los vecinos más relevantes en cada nivel.

---

## Implementación

- Desarrollada íntegramente en C++ usando solo librerías estándar.
- Algoritmos propios para gestión de nodos, niveles y conexiones.
- Código modularizado en:
  - `HNSW.h` (cabecera)
  - `HNSW.cpp` (implementación)
  - `main.cpp` (ejemplo de uso y pruebas)

---

## Frontend 

- Link: https://hnsw-algoritmo.vercel.app/

---

## Ejemplo de uso

```cpp
#include <iostream>
#include <vector>
#include "HNSW.h"

int main() {
    srand(time(nullptr));
    std::vector<Node*> all_nodes;
    Node* entry_point = nullptr;

    insert(entry_point, all_nodes, {1, 1}, 1);
    insert(entry_point, all_nodes, {2, 2}, 2);
    insert(entry_point, all_nodes, {0, 5}, 3);
    insert(entry_point, all_nodes, {5, 0}, 4);
    insert(entry_point, all_nodes, {1, 4}, 5);

    std::vector<float> query = {0, 3};
    Node* result = search(entry_point, query);

    std::cout << "El nodo más cercano al query es: " << result->id << std::endl;
    return 0;
}
