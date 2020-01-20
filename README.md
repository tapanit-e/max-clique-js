# Approximation algorithm for MAX CLIQUE

### Usage
Test instances can be found in instances folder
```console
$ npm install fs
$ node main.js [--max=N] path/to/DIMACS/1.clq [path/to/DIMACS/2.clq ...]
```

### About
Reduces MAX CLIQUE instance to MAX DNF and then MIN SAT.
When the reduction in made, then uses Probabilistic greedy heuristic algorithm to solve then MIN SAT.
Reductions preserve the approximation ratio and [[1]](https://epubs.siam.org/doi/pdf/10.1137/S0895480191220836) proved that
Probabilistic greedy heuristic algorithm is 2-approximation algorithm.
Hence __this__ is also 2-approximation algorithm for MAX CLIQUE for large cliques
increasing the current best known approximation O(n(log log n)^2/(log n)^3).

Reduction can be found in parser.js, the implementation of the algorithm can be found in sat.js
