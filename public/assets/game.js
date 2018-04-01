$(document).ready(function(){
    console.log("hello kids!");
    //This method starts the timer
    var counter;
    var timer;
    var finalScore;
    var myNode;
    var userAnswers = [];

    var i = -1;
    function startTimer() {
        timer = 10;
        $("#time").text(timer);
        counter = setInterval(countdown, 1000);
        //This method updates the timer
        function countdown() {
            if (timer > 0) {
                timer--;
                $("#time").text(timer)
            }
            else {
                var buttonData = {
                    userId: socket.id,
                    buttonClicked: 'none',
                    timeLeft: 0
                }
                userAnswers.push(buttonData);
                newMeme();
                return;
            }
        }
    }

    function getTimeLeft() {
        return timer;
    }

    //This method is called each time a new meme is presented
    function newMeme() {
        document.getElementById('memeImg').src = images[i >= images.length - 1 ? i = 0 : ++i];
        if(i===images.length-1){
            button1 = 0;
            button2 = 0;
            button3 = 0;
            socket.emit('send button data', userAnswers);
            return;
          }
        clearInterval(counter);
        startTimer();

    }

    var images = ['https://i.imgur.com/GCL80jc.jpg',
    'https://i.imgur.com/9KwIkwf.jpg',
    'https://i.imgur.com/TT3YO1V.jpg',
    'https://i.imgur.com/474V1bi.jpg',
    'https://i.imgur.com/JXzxQwO.jpg',
    'https://i.imgur.com/FpTIho5.png',
    'https://i.imgur.com/nVlwkrS.jpg',
    'https://i.imgur.com/Ld1waB1.png',
    'https://i.imgur.com/cG5tjVz.jpg',
    'https://i.imgur.com/P6Jl2bx.jpg']

    // preload
  /*  for (var j=images.length; j--;) {
        var img = new Image();
        img.src = images[j];
    }*/
    var button1 = 0;
    var button2 = 0;
    var button3 = 0;

    // socket io
    var socket = io('http://localhost:3001');
    
    function displayFinal() {
        document.getElementById('memeImg').src = 'https://i.imgur.com/EN7FZs6.png';
    }

    // event handler
    $('.myButton').click(function(){
        var buttonclicked = this.id;
        console.log(buttonclicked);
        console.log(buttonclicked=="myButton1");
        console.log(buttonclicked=="myButton2");
        console.log(buttonclicked=="myButton3");
        if(buttonclicked=="myButton1"){
          button1++;
        }
        else if(buttonclicked=="myButton2"){
          button2++;
        }
        else{
          button3++;
        }
        var timeLeft = getTimeLeft();
        newMeme();

        var buttonData = {
            userId: socket.id,
            buttonClicked: buttonclicked,
            timeLeft: timeLeft
        }

        if (userAnswers.length === 9) {
            console.log('inside disable');
            displayFinal();
            $(this).prop("disabled", true);
            clearInterval(counter);
        }
        else {
            userAnswers.push(buttonData);
            console.log(userAnswers);
        }

    });

/*
    $('.button1').click(function(){
      document.getElementById("reactionimg").src = "test/test.jpg"
      document.getElementById("reactionimg").setAttribute("style", "z-index: 1;")
      setTimeout(function(){  document.getElementById("reactionimg").setAttribute("style", "z-index: 0;")} ,1000);
    });
*/
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
        startTimer();
        $('#gameStartModal').modal('show')
    })

    socket.on('score', function(data) {
        finalScore = data;

        myNode = document.getElementById('outerDiv');
        myNode.innerHTML='';

        var nodeResults = document.createElement('div4');
        nodeResults.innerHTML = "u guys are " + finalScore + "% compatible! amazing! :) " + 
            "p.s. if u got less than 50% u need to find new friends lol";
        myNode.appendChild(nodeResults);

        /*
        var newNode = document.createElement('div');
        newNode.innerHTML = "? clicked " + button1 + " times.";
        myNode.appendChild(newNode);

        var newNode2 = document.createElement('div2');
        newNode2.innerHTML = "haha clicked " + button2 + " times.";
        myNode.appendChild(newNode2);
        myNode.appendChild(document.createElement("br"));

        var newNode3 = document.createElement('div3');
        newNode3.innerHTML = "yikes clicked " + button3 + " times.";
        myNode.appendChild(newNode3);
        myNode.appendChild(document.createElement("br"));
        */
        myNode.setAttribute("align","center");
            
    })
})
