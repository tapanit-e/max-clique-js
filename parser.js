let fs = require('fs');
let sat = require('./sat.js');

let Parser = function() {

	var args = process.argv.slice(2);

	if (! args.length) {

		console.log('Usage:\nnode main.js [--max=N] path/to/dimacs1.clq path/to/dimacs2.clq ...');
		return;

	}

	let max = null;

	if (args[0].indexOf('--max=') > -1) {
		max = args[0].split('=')[1];
		args.shift();
	}
	

	for (let arg = 0; arg < args.length; arg++) {

		let path = args[arg];
		let edges = [];
		let data = fs.readFileSync(path, 'utf8');		

		console.log(path);
		
		data = data.split('\n');

		for (let i = 0; i < data.length; i++) {

			let pair = [];
		
			if (data[i].indexOf('c') !== -1)
				continue;

			if (data[i].indexOf('p') !== -1)
				continue;

			if (data[i].trim() === '')
				continue;

			if (data[i].trim() === '%')
				continue;

			let temp = data[i].split(' ');

			if (temp[0] && temp[0].trim() === 'e')
				temp.shift(); // edge

			for (let j = 0; j < temp.length; j++)
				pair.push(parseInt(temp[j].replace(/(\r\n\t|\n|\r\t)/gm, "")));

			edges.push(pair);
		}

		let nodes = new Set();

		for (let i = 0; i < edges.length; i++) {

			nodes.add(edges[i][0]);
			nodes.add(edges[i][1]);

		}
		/* reduction to MAX DNF and then to MIN SAT */
		let clauses = [];
		let adjancet = {};

		for (let node of nodes)
			adjancet[node] = [];


		for (let i = 0; i < edges.length; i++) {

			if (adjancet[edges[i][0]])
				adjancet[edges[i][0]].push(edges[i][1])
			if (adjancet[edges[i][1]])
				adjancet[edges[i][1]].push(edges[i][0]);

		}

		for (let adj in adjancet) {

			let set = new Set(adjancet[adj]);
			let clause = [-adj];

			for (let node of nodes) {

				if (! set.has(node) && node != adj) {
				
					clause.push(node);
				
				}
			}

			clauses.push(clause);

		}
		/* End of reduction */
		let startTime = new Date().getTime();

		new sat(clauses, max);
		
		let endTime = new Date().getTime();
		let total = endTime - startTime;

		console.log('Time taken ' + total);

	}

};

module.exports = Parser;
