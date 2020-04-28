// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const conn = require("../middleware/db");



const bodyParser = require("body-parser");

// ====================
// controller
// ====================
//const usersController = require('../controllers/usersController');

// ====================
// models
// ====================

// ====================
// requests
// ====================

//this route is essentially used as a helper to turn teamID's into team names


//////////
// GET
//////////

// get list of teams
router.get('/teams', (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "select * FROM teams"
		console.log(conn);
		conn.query(sql,(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result);
			
		});
		connection.release();
	});
});

//get single team by teamID
//can be used for getting the team Name given the teamID
router.get('/teams/:teamID', (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "select * FROM teams WHERE teamID = ?"
		console.log(conn);
		conn.query(sql,[req.params.teamID],(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result);
			
		});
		connection.release();
	});
});
//////////
// POST
//////////


// ====================
// exports
// ====================
module.exports = router;
