cmake_minimum_required(VERSION 3.30)
project(HNSW)

set(CMAKE_CXX_STANDARD 20)

add_executable(HNSW HNSW.cpp
        main.cpp
        HNSW.h)
