#ifndef HNSW_H
#define HNSW_H

#pragma once
#include <vector>
#include <map>

struct Node {
    int id;
    std::vector<float> vec;
    int level;
    std::map<int, std::vector<Node*>> neighbors;
    Node(int id, float x, float y, int level);
};

float distance(const std::vector<float>& a, const std::vector<float>& b);
int generate_random_level(float lambda = 1.0);
Node* greedy_search(Node* entry, const std::vector<float>& query, int level);
void connect(Node* new_node, Node* entry, int level);
void insert(Node*& entry_point, std::vector<Node*>& all_nodes, std::vector<float> vec, int id);
Node* search(Node* entry_point, const std::vector<float>& query);

#endif HNSW_H
