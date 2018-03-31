//sets up express server
var express = require("express");
//constructs the server
var app = express();

//detect working directory
var path = require("path");

//add meme scraping
//var scrape = require("./scrape.js");

// function getScrapeList() {
//   return scrape.list;
// }

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//finds public
app.use(express.static(path.join(__dirname, "public")));

//landing page?? like an airplane --> serves up html
app.get('/', function(req, res) {
    var data = [
      {
        "meme": "http://i0.kym-cdn.com/photos/images/facebook/001/217/729/f9a.jpg"
      },
      {
        "meme": "http://i0.kym-cdn.com/photos/images/facebook/001/217/729/f9a.jpg"
      }
    ]
    var hbsObject = {
      data: data
    };
    res.render("index", hbsObject);
    //res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/meme', function(req, res) {
    res.send("meme");
})

//socket io configuration
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];

server.listen(3000, function() {
    console.log('hello server');
})

io.on('connection', function(socket) {
    socket.join('meme game', function() {
        var rooms = Object.keys(socket.rooms);
        users.push(rooms);
        console.log(users);
    })
})
