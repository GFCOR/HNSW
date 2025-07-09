#include <iostream>
#include <vector>
#include "HNSW.h"

int main() {
    srand(time(nullptr));
    Node* entry_point = nullptr;
    std::vector<Node*> all_nodes;

    insert(entry_point, all_nodes, {1, 1}, 1);
    insert(entry_point, all_nodes, {2, 2}, 2);
    insert(entry_point, all_nodes, {0, 5}, 3);
    insert(entry_point, all_nodes, {5, 0}, 4);
    insert(entry_point, all_nodes, {1, 4}, 5);

    std::vector<float> query = {0, 3};
    Node* result = search(entry_point, query);

    std::cout << "El nodo mas cercano al query es: " << result->id << std::endl;
    return 0;
}