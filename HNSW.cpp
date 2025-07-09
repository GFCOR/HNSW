#include <iostream>
#include <vector>
#include <cmath>
#include <queue>
#include <unordered_set>
#include <random>
#include <map>

using namespace std;

const int MAX_LEVEL = 3;   // Para limitar niveles
const int M = 3;           // Vecinos por nodo
const int EF = 4;          // Vecinos a explorar durante búsqueda

// Nodo con vecinos por nivel
struct Node {
    int id;
    vector<float> vec;
    int level;
    map<int, vector<Node*>> neighbors; // neighbors[level] = lista de vecinos

    Node(int id, float x, float y, int level) : id(id), vec{x, y}, level(level) {}
};

// Distancia euclidiana
float distance(const vector<float>& a, const vector<float>& b) {
    float dx = a[0] - b[0];
    float dy = a[1] - b[1];
    return sqrt(dx * dx + dy * dy);
}

// Generador de nivel con distribución geométrica
int generate_random_level(float lambda = 1.0) {
    float r = static_cast<float>(rand()) / RAND_MAX;
    return min(MAX_LEVEL - 1, static_cast<int>(-log(r) * lambda));
}

// Búsqueda greedy para encontrar punto de entrada cercano
Node* greedy_search(Node* entry, const vector<float>& query, int level) {
    Node* current = entry;
    float best_distance = distance(current->vec, query);
    bool changed;

    do {
        changed = false;
        for (Node* neighbor : current->neighbors[level]) {
            float d = distance(neighbor->vec, query);
            if (d < best_distance) {
                best_distance = d;
                current = neighbor;
                changed = true;
            }
        }
    } while (changed);

    return current;
}

// Conexión del nuevo nodo con M vecinos más cercanos
void connect(Node* new_node, Node* entry, int level) {
    using DistNode = pair<float, Node*>;
    auto cmp = [](DistNode a, DistNode b) { return a.first < b.first; };
    priority_queue<DistNode, vector<DistNode>, decltype(cmp)> top_candidates(cmp);

    queue<Node*> to_visit;
    unordered_set<Node*> visited;

    to_visit.push(entry);
    visited.insert(entry);

    while (!to_visit.empty()) {
        Node* current = to_visit.front(); to_visit.pop();
        float d = distance(current->vec, new_node->vec);
        top_candidates.push({d, current});
        if (top_candidates.size() > EF)
            top_candidates.pop();

        for (Node* neighbor : current->neighbors[level]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                to_visit.push(neighbor);
            }
        }
    }

    // Conexión bidireccional
    while (!top_candidates.empty() && new_node->neighbors[level].size() < M) {
        Node* neighbor = top_candidates.top().second;
        top_candidates.pop();
        new_node->neighbors[level].push_back(neighbor);
        neighbor->neighbors[level].push_back(new_node);
        cout << "Conectado nodo " << new_node->id << " con nodo " << neighbor->id << " en nivel " << level << endl;
    }
}

// Inserción de nuevo nodo al índice
void insert(Node*& entry_point, vector<Node*>& all_nodes, vector<float> vec, int id) {
    int level = generate_random_level();
    Node* new_node = new Node(id, vec[0], vec[1], level);

    if (!entry_point) {
        entry_point = new_node;
        all_nodes.push_back(new_node);
        return;
    }

    Node* curr = entry_point;
    for (int l = entry_point->level; l > level; --l) {
        curr = greedy_search(curr, vec, l);
    }

    for (int l = min(level, entry_point->level); l >= 0; --l) {
        Node* ep = greedy_search(curr, vec, l);
        connect(new_node, ep, l);
    }

    if (level > entry_point->level) {
        entry_point = new_node;
    }
    all_nodes.push_back(new_node);
}

// Búsqueda final en nivel 0 con "ef"
Node* search(Node* entry_point, const vector<float>& query) {
    Node* curr = entry_point;
    for (int l = entry_point->level; l > 0; --l) {
        curr = greedy_search(curr, query, l);
    }

    return greedy_search(curr, query, 0);
}

int main() {
    srand(time(nullptr));
    Node* entry_point = nullptr;
    vector<Node*> all_nodes;

    insert(entry_point, all_nodes, {1, 1}, 1);
    insert(entry_point, all_nodes, {2, 2}, 2);
    insert(entry_point, all_nodes, {0, 5}, 3);
    insert(entry_point, all_nodes, {5, 0}, 4);
    insert(entry_point, all_nodes, {1, 4}, 5);

    vector<float> query = {0, 3};
    Node* result = search(entry_point, query);

    cout << "El nodo mas cercano al query es: " << result->id << endl; return 0;
}