//sets up express server
var express = require("express");
//constructs the server
var app = express();
//detect working directory
var path = require("path");

//finds public
app.use(express.static(path.join(__dirname, "public")));

//runs server on port 3001 
app.listen(3001, function(){console.log("hello server")});

//landing page?? like an airplane --> serves up html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/meme', function(req, res) {
    res.send("meme");
})