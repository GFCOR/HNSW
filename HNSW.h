#ifndef HNSW_H
#define HNSW_H

#pragma once
#include <vector>
#include <map>

// Estructura que representa un nodo en el grafo HNSW
struct Node {
    int id; // Identificador único del nodo
    std::vector<float> vec; // Vector de características (coordenadas)
    int level; // Nivel jerárquico del nodo en el grafo
    std::map<int, std::vector<Node*>> neighbors; // Vecinos por nivel
    Node(int id, float x, float y, int level); // Constructor del nodo
};

// Calcula la distancia entre dos vectores
float distance(const std::vector<float>& a, const std::vector<float>& b);

// Genera un nivel aleatorio para un nodo (por defecto lambda = 1.0)
int generate_random_level(float lambda = 1.0);

// Búsqueda voraz: busca el nodo más cercano al query en un nivel dado
Node* greedy_search(Node* entry, const std::vector<float>& query, int level);

// Conecta un nuevo nodo con sus vecinos en un nivel específico
void connect(Node* new_node, Node* entry, int level);

// Inserta un nodo en el grafo HNSW
void insert(Node*& entry_point, std::vector<Node*>& all_nodes, std::vector<float> vec, int id);

// Busca el nodo más cercano a un vector de consulta en el grafo
Node* search(Node* entry_point, const std::vector<float>& query);

#endif // HNSW_H
