(function () {

    'use strict';

    // instance is in dimacs format
    const sat = function (instance, knownBest = null) {

        this.instance = instance;
        this.clauses = {};
        this.literals = {};
        this.knownBest = knownBest;

        this.init();

        let clique = this.solve();

        console.log(JSON.stringify(clique) + ' found');
        console.log('with size ' + clique.length);
        console.log('known best ' + (knownBest ? knownBest + ' (found is ' + clique.length / knownBest * 100 +'%)' : 'unknown'));
        
    };
    
    // initializes the clauses
    sat.prototype.init = function () {

        for (let i = 0; i < this.instance.length; i++)
            this.clauses[JSON.stringify(this.instance[i])] = true;

        this.instance = this.shuffle(this.instance);

        for (let i = 0; i < this.instance.length; i++)
            for (let j = 0; j < this.instance[i].length; j++)
                this.literals[this.instance[i][j]] = true;

    };

    // returns the clauses that the assignment would satisfy
    sat.prototype.getSatisfying = function(literal) {

        let set = new Set();

        for (let clause in this.clauses) {

            clause = JSON.parse(clause);

            for (let l = 0; l < clause.length; l++)
                if (literal == clause[l]) {
                    set.add(clause);
                    break;
                }

        }

        return set;

    };

    // solves the MINSAT problem with probabilistic greedy heuristic algorithm
    // gives 2-approximation
    // https://epubs.siam.org/doi/pdf/10.1137/S0895480191220836
    // returns the vertices in the found clique
    sat.prototype.solve = function() {

        for (let literal in this.literals) {

            let positive, negative;

            if (+literal > 0) {

                positive = +literal;
                negative = +literal * -1;

            } else {

                positive = +literal * -1;
                negative = +literal;

            }

            let x = this.getSatisfying(positive);
            let y = this.getSatisfying(negative);

            if (x.size === 0) continue;
            if (y.size === 0) continue;

            let probX = y.size / (y.size + x.size);
            let probY = 1 - probX;
            let randomX = Math.random(probX);
            let randomY = Math.random(probY);

            if (randomX > randomY) {

                for (let set of x) {

                    delete this.clauses[JSON.stringify(set)];

                }

            } else {

                for (let set of y) {

                    delete this.clauses[JSON.stringify(set)];

                }

            }

        }

        let clique = [];

        for (let clause in this.clauses) {

            clause = JSON.parse(clause);

            for (let i = 0; i < clause.length; i++)
                if (clause[i] < 0)
                    clique.push(-clause[i]);

        }

        return clique;

    }; 

    // shuffles an array for random ordering the literals
    sat.prototype.shuffle = function (a) {

        let counter = a.length;

        while (counter > 0) {

            let index = Math.floor(Math.random() * counter);

            counter--;

            let temp = a[counter];

            a[counter] = a[index];
            a[index] = temp;

        }

        return a;

    };

    if (module && module.exports)
        module.exports = sat;
    else
        window.sat = sat;

})();
