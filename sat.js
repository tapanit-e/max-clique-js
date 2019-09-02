(function () {

    'use strict';

    // instance is in dimacs format
    const sat = function (instance) {

        this.instance = instance;
        this.positive = new Set();
        this.negative = new Set();
        this.assignments = {};

        this.init();

        let satisfied = this.solve();

        console.log((satisfied * 100) + '%');

        let clique = [];

        for (let assign in this.assignments) {
            if (this.assignments[assign] === true)
                clique.push(assign);
        }

        console.log(clique.length);

    };

    // divides the clauses that can be satisfied with positive literals
    // and with negative literals
    sat.prototype.init = function () {

        for (let i = 0; i < this.instance.length; i++) {

            if (this.instance[i].length === 1)
                this.positive.add(this.instance[i]);
            else   
                this.negative.add(this.instance[i]);

        }

        for (let i = 0; i < this.instance.length; i++)
            for (let j = 0; j < this.instance[i].length; j++) {

                let literal = null;

                if (this.instance[i][j] < 0)
                    literal = -this.instance[i][j];
                else   
                    literal = this.instance[i][j];

                    this.assignments[literal] = false;
            
            }

    };

    sat.prototype.solve = function() {

        let iter = 0;
        let current = this.percentage();
        let prevCurrent = 0;
        let exclude = new Set();

        do {

            prevCurrent = current;

            let setArray = Array.from(this.positive);
            setArray = this.shuffle(setArray);
            this.positive = new Set(setArray);


            
            for (let positive of this.positive) {

                

                    this.assignments[positive[0]] = true;

                    let percent = this.percentage();

                    if (this.doesSatisfy()) {

                        current = percent;

                        this.positive.delete(positive);

                    }  else {

                        this.assignments[positive[0]] = false;

                    }

            }
            
            iter++;

        } while (current !== prevCurrent);

        return current;

    };

    sat.prototype.doesSatisfy = function () {

        for (let negative of this.negative) {
            if (this.assignments[-negative[0]] === true && this.assignments[-negative[1]] === true)
                return false;
        }

        return true;

    };

    sat.prototype.leastNegative = function(excluded) {

        let map = {};

        for (let negative of this.negative) {

            if (excluded.has(negative[0]) || excluded.has(negative[1])) continue;

            if (map[negative[0]])
                map[negative[0]]++;
            else
                map[negative[0]] = 1;

            if (map[negative[1]])
                map[negative[1]]++;
            else
                map[negative[1]] = 1;

        }

        let max = -Infinity;
        let ret = null;

        for (let key in map) {

            if (map[key] > max) {

                max = map[key];
                ret = key;

            }

        }

        return ret;

    };

    sat.prototype.percentage = function() {

        let satisfied = 0;
        let total = 0;

        for (let positive of this.positive) {

            if (this.assignments[positive[0]] === true) {
                satisfied++;
            }

            total++;

        }

        return satisfied / total;

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
