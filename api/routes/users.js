// ====================
// imports
// ====================
const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const conn = require("../middleware/db");


var bcrypt = require('bcrypt');
const saltRounds = 10;


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

//////////
// GET
//////////

// get list of users
router.get('/users', (req,res,next)=>{
    let sql = "select * FROM users"
	console.log(conn);
	conn.query(sql,(err,result)=>{
		if(err) throw err;
		console.log(result);
		res.send(result);
	});

});

//////////
// POST
//////////

// login
router.post('/login',checkAuth, (req,res,next)=>{
    console.log(req.body.username);
    console.log(req.body.pass);
    let sql = "SELECT * FROM mydb.users  where username = ? and password = ?;";
    conn.query(sql,[req.body.username,req.body.pass],(err,result)=>{
        if(err) throw err;
        if(result.length == 0){
            res.send("wrong username or password")
        }else{
            console.log(result+" account exists: logging in");
            res.send(result);
            
        }
		
        
    });

});

// signup
router.post('/signup',  (req,res,next)=>{
    console.log(req.body.username);
    console.log(req.body.pass);
    
    
    

    let sql = "insert into users(username,password,email) values ?";
    

    //console.log(conn);
    
    const values = [[req.body.username,req.body.pass,req.body.email]];
	conn.query(sql,[values],(err,result)=>{
		if(err){
            if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062){
                console.log('username, pass and error must be unique');
                res.send('username, pass and error must be unique')
            }else{
                console.log('Other error in the query');
             }
        }
        console.log(result);
        res.send(result);
	});



    /*
	
	insert into userList(username,password,email)
	values(req.username,req.password,req.email)
	
	*/
    
    
});

// delete
router.delete('/delete',  (req,res,next)=>{
    console.log(req.body.userID);


    
    
    let sql = "delete from users where userID = ?;"
    conn.query(sql,[req.body.userID],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows == 0){
            console.log("that account you want to delete does not exist");
            res.send("that account you want to delete does not exist")
        }else if(result.affectedRows == 1){
            console.log(result+" account exists: logging in");
            res.send(result);
            
        }
		
        
    });
    
});

// ====================
// exports
// ====================
module.exports = router;
