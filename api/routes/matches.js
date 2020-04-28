// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const conn = require("../middleware/db");
// ====================
// controller
// ====================
const matchesController = require('../controllers/matchesController');

// ====================
// requests
// ====================

//////////
// GET
//////////

// get all matches
router.get('/matches', (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "SELECT matchID, userID,description,score1,score2,teamID1,teamID2,t.name as teamID1_Name,t1.name as teamID2_Name, matchURL FROM matches m JOIN teams t ON t.teamID  = m.teamID1 JOIN teams t1 ON t1.teamID = m.teamID2"
		
		console.log(conn);
		conn.query(sql,(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result)
			
		});
		connection.release();
	});

});
//get match by matchID
router.get('/matches/match/:matchID', (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "SELECT matchID, userID,description,score1,score2,teamID1,teamID2,t.name as teamID1_Name,t1.name as teamID2_Name, matchURL FROM matches m JOIN teams t ON t.teamID  = m.teamID1 JOIN teams t1 ON t1.teamID = m.teamID2 where matchID = ?"
		
		console.log(conn);
		conn.query(sql,[req.params.matchID],(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result)
			
		});
		connection.release();
	});

});
// get all matches belonging to a user
router.get('/matches/:userID', (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "SELECT matchID, userID,description,score1,score2,teamID1,teamID2,t.name as teamID1_Name,t1.name as teamID2_Name, matchURL FROM matches m JOIN teams t ON t.teamID  = m.teamID1 JOIN teams t1 ON t1.teamID = m.teamID2 WHERE userID = ?"
		console.log(conn);
		conn.query(sql,req.params.userID,(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result);
			
		});
		connection.release();
	});
});

//  get one Match while the current user is logged in
router.get('/matches/:userID/:matchID',  (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "SELECT matchID, userID,description,score1,score2,teamID1,teamID2,t.name as teamID1_Name,t1.name as teamID2_Name, matchURL FROM matches m JOIN teams t ON t.teamID  = m.teamID1 JOIN teams t1 ON t1.teamID = m.teamID2 WHERE userID = ? and matchID = ?"
		//console.log(conn);
		conn.query(sql,[req.params.userID,req.params.matchID],(err,result)=>{
			if(err) throw err;
			console.log(result);
			res.send(result);
			 
		});
		connection.release();
	});
});
//selects all matches that are apart of a teamID and belong to the user
router.get('/matches/:userID/teams/:teamID',  (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "SELECT * FROM matches WHERE userID = ? and (teamID1 = ? or teamID2 = ?)"
		console.log(conn);
		conn.query(sql,[req.params.userID,req.params.teamID,req.params.teamID],(err,result)=>{
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

// create new match
router.post('/matches/:userID/create', checkAuth,  (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "INSERT INTO matches (userID,description,score1,score2,teamID1,teamID2, matchURL) VALUES ?"
		const values = [[req.params.userID,req.body.description,req.body.score1,req.body.score2,req.body.teamID1,req.body.teamID2,req.body.matchURL]]
		conn.query(sql,[values],(err,result)=>{
			if(err) throw err;
			console.log(result);
			
			res.json(result);
			 
		});
		connection.release();
	});

});

// update existing match at
//requires a matchID to choose which match to edit
//able to only edit one match at a time
router.post('/matches/:userID/update/:matchID',checkAuth,  (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "UPDATE matches SET ?? = ? WHERE  userID = ? and matchID = ?";
		conn.query(sql,[req.body.columnToChange,req.body.replacement,req.params.userID,req.params.matchID],(err,result)=>{
			if(err) throw err;
			console.log(result);
			
			res.send(result);
			 
		});
	connection.release();
	});


});

// delete 
//by matchID
router.post('/matches/:userID/delete/:matchID',checkAuth, (req,res,next)=>{
	conn.getConnection(function(err, connection) {
		if (err) throw err; // not connected!
		let sql = "DELETE FROM matches WHERE  userID = ? and matchID = ?";
		conn.query(sql,[req.params.userID,req.params.matchID],(err,result)=>{
			
			if(err) throw err;
			if(result.affectedRows == 0){
				console.log("match does not exist");
				res.send(result)
			}else if(result.affectedRows == 1){
				console.log("match deleted");
				res.send(result);
				
			}
			 
		});
		connection.release();
	});
});

// ====================
// exports
// ====================
module.exports = router;














