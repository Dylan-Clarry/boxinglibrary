// ====================
// imports
// ====================

// ====================
// models
// ====================
const Matches = require('../models/matches');

// ====================
// exports
// ====================

// load matches and serve onto index page
//for now queries will be placed into the export code blacks for now and will be updated as proper code later
exports.getAllMatches = (req, res, next) => {
	/*
	SELECT * FROM matches
	WHERE matches.userID = req.userID
	*/
};

// get one match entry
exports.getOneMatch = (req, res, next) => {
	/*
	SELECT * FROM matches
	WHERE matches.userID = req.userID AND where matches.matchID = req.matchID
	
	*/
};

// create match
exports.createMatch = (req, res, next) => {

	/*

Insert into matches(userID,Title, teamID1,teamID2,score1,score2,description,winner)
values(req.userID,req.title,req.teamID1,req.teamID2,req.score1,req.score2,req.description)

*/
	
};

// update Match
exports.updateMatch = (req, res, next) => {
	/*

Insert into matches(userID,Title, teamID1,teamID2,score1,score2,description,winner)
values(req.userID,req.title,req.teamID1,req.teamID2,req.score1,req.score2,req.description)

*/

};

// delete Match
exports.deleteMatch = (req, res, next) => {
/*
DELETE FROM matches WHERE matches.matchID = req.matchID
*/
};







