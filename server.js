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

function checkStart(users) {
    for (var i = 0; i < users.length; i++) {
        if (!users[i].response) {
            return false;
        }
    }
    if (users.length === 2) {
        return true;
    }
    return false;
}

io.on('connection', function(socket) {
    function startGame() {
        io.emit('start meme game', 'everyone');
    }
    socket.join('meme game', function() {
        users.push({
            userId: socket.id,
            room: 'meme game',
            response: false
        });
        printUsers();
        if (users.length === 2) {
            score = {
                total : 0
            }
            io.sockets.emit('check meme game', users);
        }
    })

    socket.on('ready response', function(data) {
        console.log(data);
        var index = users.map(function(user) {
            return user.userId;
        }).indexOf(data.userId);
        console.log('index of user:', index);
        users[index].response = data.response;
        var check = checkStart(users);
        if (check) {
            startGame();
        }
        printUsers();
    })

    socket.on('disconnect', function() {
        var index = users.map(function(user) {
            return user.userId;
        }).indexOf(socket.id);
        console.log("User disconnected:", socket.id);
        users.splice(index,1);
        if (users.length === 0) {
            console.log('All users disconnected!');
            return;
        }
        printUsers();
    })
})
