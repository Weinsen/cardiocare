module.exports = function(app) {

	var express = require('express');
	var path = require('path');
	var bodyParser = require('body-parser');
	var cors = require('cors');
	var sqlite3 = require('sqlite3').verbose();

	const PORT = 3000;

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(bodyParser.json());
	app.use(cors());

	app.listen( PORT, function() {
		console.log('Listening on port ' + PORT);
	});

	app.get('/getUsers', function(req, res) {
		//res.status(200).send("Olar");
		res.json({'users':[
			{name: 'Abel', id: 1},
			{name: 'Babel', id: 2},
			{name: 'Cain', id: 3},
			{name: 'Denis', id: 4},
			{name: 'Eliane', id: 5},
			{name: 'Fernanda', id: 6},
			{name: 'George', id: 7},
			{name: 'Hilário', id: 8},
			{name: 'Igor', id: 9},
			{name: 'Jaqueline', id: 10},
			{name: 'Kátia', id: 11},
			{name: 'Leandro', id: 12}
		]});
	});

	app.get('/getUser/:id', function(req, res) {
		res.json({'user':
			{
				name: req.params.id,
				photo: 'aaa',
				graph: {
					labels: ['Jan', 'Fev', 'Mar'],
					data: [1, 2, 3]
				}
			}
		});
	});

	app.get('/getImage/:id', function(req, res) {
		console.log('public/' + req.params.id + '.jpg');
		var file = path.join(__dirname, 'public/' + req.params.id);
		var s = fs.createReadStream(file);
	    s.on('open', function () {
	        res.set('Content-Type', 'image/jpg');
	        s.pipe(res);
	    });
	    s.on('error', function () {
	        res.set('Content-Type', 'text/plain');
	        res.status(404).end('Not found');
	    });
	});

}