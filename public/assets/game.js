$(document).ready(function(){
    console.log("hello kids!");
    //This method starts the timer
    var counter;
    function startTimer() {
        var timer = 10;
        $("#time").text(timer);
        counter = setInterval(countdown, 1000);
        //This method updates the timer
        function countdown() {
            timer--;
            if (timer >= 0) {
                $("#time").text(timer)
            }
            else {
                clearInterval(counter);
                return;
            }
        }
    }
    //This method is called each time a new meme is presented
    function newMeme() {
        clearInterval(counter);
        startTimer();
    }

    var images = ['http://i1.kym-cdn.com/photos/images/newsfeed/000/250/007/672.jpg',
    'http://i0.kym-cdn.com/photos/images/facebook/001/217/729/f9a.jpg',
    'https://www.askideas.com/media/41/All-These-Flavors-And-You-Choose-To-Be-Salty-Funny-Girl-Meme-Picture.jpg'],
    i = 1;

    // preload
    for (var j=images.length; j--;) {
        var img = new Image();
        img.src = images[j];
    }

    // event handler
    $('.myButton').click(function(){
        document.getElementById('memeImg').src = images[i >= images.length - 1 ? i = 0 : ++i];
        newMeme();
    });

    // socket io
    var socket = io('http://localhost:3001');
    socket.on('check meme game', function(data) {
        console.log(data);
        var index = data.map(function(user) {
            return user.userId;
        }).indexOf(socket.id);
        console.log(index);
        var userState = {
            userId: data[index].userId,
            response: data[index].response
        };
        if(!data[index].response) {
            var response = confirm('Ready?');
            userState= {
                userId: socket.id,
                response: response
            }
        }
        socket.emit('ready response', userState);
    })

    socket.on('start meme game', function() {
        alert('game started!');
    })
})
