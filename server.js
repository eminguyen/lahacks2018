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
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "sprinkle"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "sprinkle"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "barf"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "luv"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "random"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "barf"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "luv"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "barf"
      },
      {
        "meme": "http://energyandgold.com/wp-content/uploads/2018/01/Crypto-Market-Crash-365x365.jpg", "name": "random"
      },
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

server.listen(3001, function() {
    console.log('hello server');
})

function printUsers() {
    console.log('Number of users: ' + users.length);
    console.log(users);
}

io.on('connection', function(socket) {
    socket.join('meme game', function() {
        var rooms = Object.keys(socket.rooms);
        users.push(rooms);
        printUsers();
        if (users.length === 2) {
            score = {
                total : 0
            }
            io.emit('start meme game', 'everyone');
        }
    })

    socket.on('disconnect', function() {
        var i = users.indexOf(socket);
        users.splice(i,1);
        if (users.length === 0) {
            console.log('All users disconnected!');
            return;
        }
        printUsers();
    })
})
