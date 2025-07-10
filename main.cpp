#include <iostream>
#include <vector>
#include "HNSW.h"

// La Función principal del programa
int main() {
    srand(time(nullptr)); // Se inicializa la semilla para números aleatorios

    Node* entry_point = nullptr; // Puntero al nodo de entrada del grafo HNSW
    std::vector<Node*> all_nodes; // Vector para almacenar todos los nodos creados

    // Inserta varios nodos en el grafo HNSW con sus coordenadas y un id
    insert(entry_point, all_nodes, {1, 1}, 1);
    insert(entry_point, all_nodes, {2, 2}, 2);
    insert(entry_point, all_nodes, {0, 5}, 3);
    insert(entry_point, all_nodes, {5, 0}, 4);
    insert(entry_point, all_nodes, {1, 4}, 5);

    // Define el vector de consulta para buscar el nodo más cercano
    std::vector<float> query = {0, 3};
    Node* result = search(entry_point, query); // Busca el nodo más cercano al query

    // Imprime el id del nodo más cercano encontrado
    std::cout << "El nodo mas cercano al query es: " << result->id << std::endl;
    return 0;
}
