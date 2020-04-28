
const mysql = require('mysql')
const conn = mysql.createPool({
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'bf69ec0a6976da',
    password: '556a07c1',
    database: 'heroku_587f81ca594c90c'
  })
  
  
/*  
conn.connect(function(err) {
    if (err) throw err;
    
    console.log('mysql connected')
    
});
*/
module.exports = conn;
