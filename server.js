var express = require("express");
var app = express();
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.listen(3001, function(){console.log("hello server")});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})