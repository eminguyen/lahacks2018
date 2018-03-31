//sets up express server
var express = require("express");
//constructs the server
var app = express();

//detect working directory
var path = require("path");

//finds public
app.use(express.static(path.join(__dirname, "public")));

//landing page?? like an airplane --> serves up html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/meme', function(req, res) {
    res.send("meme");
})

//socket io configuration
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000, function() {
    console.log('hello server');
})

io.on('connection', function(socket) {
    socket.join('meme game', function() {
        var rooms = Object.keys(socket.rooms);
        console.log(rooms);
    })
})