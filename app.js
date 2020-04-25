// ====================
// imports
// ====================
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql')
// variables
const app = express();

// ====================
// database connection
// ====================


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mydb'
})



connection.connect(function(err) {
    if (err) throw err;
});
module.exports = connection;

// use normal promise

// morgan logging tool (middleware)
app.use(morgan('dev'));
app.use('/static', express.static('static'));

// app.use(express.static(path.join(process.env.PWD, 'static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add headers to avoid CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers',
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if(req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods',
			"GET, PUT, POST, PATCH, DELETE",
		);
		return res.status(200).json({});
	}
	next();
});

// ====================
// routes
// ====================
const matchesRoute = require('./api/routes/matches');
const usersRoute = require('./api/routes/users');


// Routes which handle requests
app.use('/matches', matchesRoute);
app.use('/users', usersRoute);

// error handling
app.use((req, res, next) => {
	const error = new Error("404 not found.");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		}
	});
});

// ====================
// exports
// ====================
module.exports = app;

