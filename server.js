
//mysql://
//bf69ec0a6976da
//:
//556a07c1
//@
//us-cdbr-iron-east-01.cleardb.net
///heroku_587f81ca594c90c?reconnect=true
// ====================
// imports
// ====================
const http = require('http');
const app = require('./app');

// port number
const port = process.env.PORT;

//start server
const server = http.createServer(app);
server.listen(port);
console.log("listening on port " + port);



