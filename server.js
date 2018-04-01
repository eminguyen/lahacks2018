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
        "meme": "https://i.imgur.com/RUrykEc.png", "name": "sprinkle"
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
var score;

server.listen(process.env.PORT || 3001, function() {
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

function calculateScore(users) {
    printUsers();
    console.log('game over');
    var points = [
      {correct: 0, incorrect: 0},
      {correct: 5, incorrect: 5},
      {correct: 10, incorrect: 10},
      {correct: 15, incorrect: 15},
      {correct: 20, incorrect: 20},
      {correct: 25, incorrect: 25},
      {correct: 50, incorrect: 30},
      {correct: 75, incorrect: 40},
      {correct: 85, incorrect: 50},
      {correct: 100, incorrect: 0},
      {correct: 100, incorrect: 0}
    ];
    var totalScore = 0;
    var i;
    for(i = 0; i < users[0].answers.length; i++ )
    {
      var answer1 = users[0].answers[i];
      var answer2 = users[1].answers[i];
      var time = Math.min(answer1.timeLeft, answer2.timeLeft);
      if(answer1.buttonClicked === answer2.buttonClicked)
      {
          totalScore += points[time].correct;
      }
      else
      {
          totalScore += points[time].incorrect;
      }
    }
    //Takes the average score
    score = (totalScore / (users[0].answers.length * 100)) * 100;
    console.log("Total score: " + totalScore);
    console.log("Compatibility score: ", score);
}

function checkFinished(users) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].answers === undefined) {
            console.log("users answers are null");
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

    socket.on('send button data', function(data) {
        console.log(data);
        var index = users.map(function(user) {
            return user.userId;
        }).indexOf(data[0].userId);
        users[index].answers = data;
        if (checkFinished(users)) {
            calculateScore(users);
            io.sockets.emit('score', score);
        }

        console.log('index of user:', index);
    });
})
