$(document).ready(function(){
    console.log("hello kids!");
    //This method starts the timer
    var counter;
    var timer;
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
            var myNode = document.getElementById('outerDiv');
            myNode.innerHTML='';
  
            var newNode = document.createElement('div');
            newNode.innerHTML = "button1 clicked " + button1 + " times.";
            myNode.appendChild(newNode);
  
            var newNode2 = document.createElement('div2');
            newNode2.innerHTML = "button2 clicked " + button2 + " times.";
            myNode.appendChild(newNode2);
            myNode.appendChild(document.createElement("br"));
  
            var newNode3 = document.createElement('div3');
            newNode3.innerHTML = "button3 clicked " + button3 + " times.";
            myNode.appendChild(newNode3);
  
            myNode.setAttribute("align","center");
            button1 = 0;
            button2 = 0;
            button3 = 0;
            socket.emit('send button data', userAnswers);
            return;
          }
        clearInterval(counter);
        startTimer();

    }

    var images = ['http://i1.kym-cdn.com/photos/images/newsfeed/000/250/007/672.jpg',
    'http://i0.kym-cdn.com/photos/images/facebook/001/217/729/f9a.jpg',
    'https://www.askideas.com/media/41/All-These-Flavors-And-You-Choose-To-Be-Salty-Funny-Girl-Meme-Picture.jpg',
    'https://c1.staticflickr.com/3/2200/32909417816_b3e9de59b0_b.jpg',
    'https://i.imgur.com/WA7uzXF.jpg',
    'https://i.imgur.com/cYDnwFv.jpg']

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

        userAnswers.push(buttonData);
        console.log(userAnswers);

    });

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
})
