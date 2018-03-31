$(document).ready(function(){
    console.log("hello kids!");
    //This method starts the timer
    function startTimer() {
        var timer = 10;
        $("#time").text(timer);
        var counter = setInterval(countdown, 1000);
        //This method updates the timer 
        function countdown() {
            timer--;
            if (timer >= 0) {
                $("#time").text(timer);
            }
            else {
                clearInterval(counter);
                newMeme();
                return;
            }
        }
    }
    //This method is called each time a new meme is presented
    function newMeme() {
        startTimer();
        
    }
    newMeme();


    

})



