// ====================
// imports
// ====================
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ====================
// models
// ====================
//const User = require('../models/user');

// ====================
// controllers
// ====================

// ====================
// exports
// ====================

// returns a list of users
exports.getUsersList = (req, res, next) => {

	let sql = "select * FROM userList"
	
	connection.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send('users retrieved')
	});
	

	/*
	select * FROM userList
	*/

};

// signup user
exports.signup = (req, res, next) => {
	
	
	/*
	
	insert into userList(username,password,email)
	values(req.username,req.password,req.email)
	
	*/
};

// login user
exports.login = (req, res, next) => {
	
/*
	
	insert into userList(username,password,email)
	values(req.username,req.password,req.email)
	
	*/


};

// delete user
exports.delete = (req, res, next) => {
	
	/*
	
	delete from userlist
	where userlsit.username = req.username
	
	*/
	
	
};
