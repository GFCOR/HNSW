# HNSW
Integrantes: Federico Iribar, Gianfranco Cordero, José Huamaní, David Salaverry


Descripción general
Este proyecto implementa desde cero la estructura de datos HNSW (Hierarchical Navigable Small World) en C++. HNSW es una estructura avanzada para la búsqueda eficiente de vecinos más cercanos (Nearest Neighbor Search) en espacios de alta dimensión, ampliamente utilizada en aplicaciones de inteligencia artificial, recuperación de información y sistemas de recomendación.


¿Qué es HNSW?
HNSW es una estructura de grafo jerárquico que permite realizar búsquedas aproximadas de los puntos más cercanos a un vector de consulta, optimizando tanto la velocidad como la precisión. Su diseño aprovecha la organización en múltiples niveles para reducir drásticamente el número de comparaciones necesarias frente a métodos tradicionales.
¿Cómo funciona?
Estructura jerárquica: Los nodos se distribuyen en varios niveles. Los niveles superiores permiten saltos largos en el grafo, mientras que los inferiores refinan la búsqueda localmente.
Inserción: Al agregar un nuevo nodo, este se conecta a sus vecinos más cercanos en cada nivel, utilizando una búsqueda greedy para encontrar los puntos de entrada óptimos.
Búsqueda: La consulta comienza en el nivel más alto y desciende, utilizando siempre el vecino más prometedor hasta llegar al nivel base, donde se obtiene el resultado final.
Complejidad temporal
Búsqueda: En la práctica, la búsqueda tiene una complejidad sublogarítmica, típicamente (O(\log N)), lo que la hace mucho más eficiente que una búsqueda lineal.
Inserción: La inserción de nuevos elementos también es eficiente, con una complejidad similar a la de búsqueda, ya que solo se exploran los vecinos más relevantes en cada nivel.
Implementación
La estructura fue desarrollada íntegramente en C++, empleando únicamente librerías estándar.
Se diseñaron algoritmos propios para la gestión de nodos, niveles y conexiones, garantizando eficiencia y claridad en el código.
El código está modularizado en archivos de cabecera (HNSW.h), implementación (HNSW.cpp) y pruebas/ejemplo de uso (main.cpp).
