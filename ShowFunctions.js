var mysql = require('mysql');

var fs = require('fs');
var ejs = require('ejs');

module.exports = {
  SelectAllData:  (table_name, res, pool) => {
    var sql = "SELECT * FROM " + table_name;

    pool.query(sql, function(err, results, fields){
      if(err){
       //throw err;
       var templateString = fs.readFileSync('ejsFiles/BasicError.ejs', 'utf-8');
       res.writeHead(200, {'Content-Type': 'text/html'});
       var x = [{"name":"Invalid username."}];

       res.end(ejs.render(templateString, {errorReason:x}));
       return;
     }
      var templateString = fs.readFileSync('ejsFiles/ShowList.ejs', 'utf-8');
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(ejs.render(templateString, {recordedShows:results}));
    });
  },
  SelectSomeData:  (table_name, like_data, res, pool) => {
    var sql = "SELECT * FROM " + table_name + " WHERE name LIKE '%" + like_data + "%'";
    console.log("SELECT FROM");

    pool.query(sql, function(err, results, fields){
      if(err){
       //throw err;
       var templateString = fs.readFileSync('ejsFiles/BasicError.ejs', 'utf-8');
       res.writeHead(200, {'Content-Type': 'text/html'});
       var x = [{"name":"Invalid username."}];

       res.end(ejs.render(templateString, {errorReason:x}));
       return;
     }
      //console.log(JSON.stringify(results));
      res.end(JSON.stringify(results));
    });
  },
  InsertData: (given_info, res, pool) => {
    var sql = "INSERT INTO " + given_info.user + " (name, season, rating, addedAt) VALUES ('" + given_info.show + "', " + given_info.season + ", " + given_info.rating + ", NOW())";

    pool.query(sql, function(err, results, fields){
      if(err){
       //throw err;
       var templateString = fs.readFileSync('ejsFiles/BasicError.ejs', 'utf-8');
       res.writeHead(200, {'Content-Type': 'text/html'});
       var x = [{"name":"Invalid data."}];
       res.end(ejs.render(templateString, {errorReason:x}));
       return;
     }else{
        console.log("Data inserted correctly!");
        given_info.id = results['insertId'];
        res.end(JSON.stringify(given_info));
      }
    });
  },
  RemoveData: (given_info, res, pool) => {

    console.log("REMOVING DATA");

    var sql = "DELETE FROM " + given_info.user + " WHERE id = " + given_info.id;

    pool.query(sql, function(err, results, fields){
      if(err){
       throw err;
       var templateString = fs.readFileSync('ejsFiles/BasicError.ejs', 'utf-8');
       res.writeHead(200, {'Content-Type': 'text/html'});
       var x = [{"name":"Invalid data."}];
       res.end(ejs.render(templateString, {errorReason:x}));
       return;
     }else{
        console.log("Data removed correctly!");
        res.end(JSON.stringify(given_info));
      }
    });
  },

};
