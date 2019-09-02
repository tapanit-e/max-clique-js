# Approximation algorithm for MAX-Clique

### Usage
```console
$ npm install fs
$ node main.js path/to/DIMACS/1.clq path/to/DIMACS/2.clq ...
$ > % (size of the found (max) clique in comparison to |V|)
$ > x (the actual size of the found clique)
$ > Time taken in millis 
```

### About
Reduces max-clique instance to 2MAX SAT (weighted) and solves the generated CNF
