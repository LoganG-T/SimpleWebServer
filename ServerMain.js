var showFuncs = require('./ShowFunctions.js')

var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "logan",
  password: "",
  database:"show_list"
});

var url = require('url');
var http = require('http');
http.createServer(function (req, res) {
  //https://gist.github.com/kentbrew/763822
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/test_image'} );
    res.end();
    console.log('favicon requested');
    return;
  }

  var parsed_url = url.parse(req.url, true);
  var pathname = parsed_url.pathname;
  var search = parsed_url.search;
  console.log(pathname);
  console.log(req.url);

  if(pathname === '/listshows'){
    if(search != null){
      var data = parsed_url.query;
      var table_name = data.user;

      showFuncs.SelectAllData(table_name, res, pool);
    }else{
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('Incorrect url');
      res.end();
    }
  }
  else if(pathname === '/searchshows'){
    if(search != null){
      var data = parsed_url.query;
      var table_name = data.user;
      var given_search = data.lookfor;

      showFuncs.SelectSomeData(table_name, given_search, res, pool);
    }else{
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('Incorrect url');
      res.end();
    }
  }
  else if(pathname === '/addshow'){
    var data = parsed_url.query;

    showFuncs.InsertData(data, res, pool);
    //res.end(JSON.stringify(data));
    //res.end('{"success" : "Updated Successfully", "status" : 200}');
  }
  else if(pathname === '/removeshow'){
    var data = parsed_url.query;

    showFuncs.RemoveData(data, res, pool);
  }
  else if(pathname === '/'){
    var templateString = fs.readFileSync('ejsFiles/HomePage.ejs', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(ejs.render(templateString, {}));
  }
  else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Incorrect url');
    res.end();
  }

}).listen(8080);
