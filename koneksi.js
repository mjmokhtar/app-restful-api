var mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_restful_api'
})

connection.connect(function(error){
    if(!!error){
      console.log(error);
    }else{
      console.log('Connection MySQL Succuessfully!');
    }
  })
 
 module.exports = connection; 