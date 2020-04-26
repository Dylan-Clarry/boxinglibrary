// ====================
// imports
// ====================


const express = require('express');
const router = express.Router();
//const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const conn = require("../middleware/db");
const jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');
const saltRounds = 10;


const bodyParser = require("body-parser");
var stok = require('../../nodemon.json')
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
//test



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
/*
// login
router.post('/login',checkAuth, (req,res,next)=>{
    console.log(req.body.username);
    console.log(req.body.pass);

    bcrypt.compare(req.body.password, hash, function(err, res) {
        // res == true
    });

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
*/
//================================================================================================================================================================================================
//================================================================================================================================================================================================

// login
router.post('/login', (req,res,next)=>{
    console.log(req.body.username);
    console.log(req.body.pass);
    const pass = req.body.pass
    const username = req.body.username
    const user = {name: username}
    let sql = "SELECT username,password FROM users  where username = ?";
    conn.query(sql,[username],(err,result)=>{
        
        
        if(err){
            console.log("error")
            
        }else if(!err){
            if(result.length >0){
                
                bcrypt.compare(pass, result[0].password, function(err, match){
                    if (match){
                        console.log("password match, logging in");
                        const accessToken = jwt.sign(user,stok.env.JWT_KEY);
                        res.json({accessToken: accessToken,msg: "logged in"})
                    }else{
                        
                        console.log("pass does not match");
                        res.send("pass does not match");
                    }
                });
            }else{
                res.send("wrong username, please correct or sign up");
            }
        }

        

        
		
        
    });
    
    
    
});


//================================================================================================================================================================================================
//================================================================================================================================================================================================

// signup
router.post('/signup',  (req,res,next)=>{


    bcrypt.hash(req.body.pass, bcrypt.genSaltSync(12), function(err, hash) {

        req.body.pass = hash;
        console.log(req.body.pass);

        let sql = "insert into users(username,password,email) values ?";
        const values = [[req.body.username,req.body.pass,req.body.email]];
        conn.query(sql,[values],(err,result)=>{
            console.log(result);
            if(err){
                if(err.code == 'ER_DUP_ENTRY' || err.errno == 1062){
                    console.log('username, pass and error must be unique');
                    res.send('username, pass and error must be unique')
                }else{
                    throw err;
                }
            }
            console.log(result);
            res.send(result);
	    });
    });
//================================================================================================================================================================================================
//================================================================================================================================================================================================
    
    
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

function authenticate(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token,process.stok.env.JWT_KEY,(err,user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    });








}
// ====================
// exports
// ====================
module.exports = router;
