
const mysql = require('mysql')
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb'
  })
  
  
  
  conn.connect(function(err) {
      if (err) throw err;
      
      console.log('mysql connected')
      
  });
  module.exports = conn;
