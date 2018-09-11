/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var modal = $("#win-modal");

var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

function showAllCards() {
    var index = 0;
    $.each($(".card "), function(){
      $(this).toggleClass("open");
       $(this).toggleClass("show");
               
      index++;
    });
};

function closeAllCards() {
  var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    
    resetTimer();
};

function updateCards() {
    deck = shuffle(deck);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    
    resetTimer();
};

//game level
var hard = 15;
var medium = 20;



var open = [];
var matched = 0;
var moveCounter = 0;
var numStars = 3;
var timer = {
    seconds: 0,
    minutes: 0,
    clearTime: -1
};

var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }

     var formatSec = "0";
    if (timer.seconds < 10) {
        formatSec += timer.seconds
    } else {
        formatSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formatSec;
    $(".timer").text(time);
};
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};


function showModal() {
    modal.css("display", "block");
};

//update stars
function removeStar() {
    $(".fa-star").last().attr("class", "fa fa-star-o");
    numStars--;
    $(".num-stars").text(String(numStars));
};

// restore 3 stars 
function resetStars() {
    $(".fa-star-o").attr("class", "fa fa-star");
    numStars = 3;
    $(".num-stars").text(String(numStars));
};

// updating number of moves
function updateMoveCounter() {
    $(".moves").text(moveCounter);

    if (moveCounter === hard || moveCounter === medium) {
        removeStar();
    }
};

//check valid move
function isValid(card) {
    return !(card.hasClass("open") || card.hasClass("match"));
};

//check matched opened cards
function checkMatch() {
    if (open[0].children().attr("class")===open[1].children().attr("class")) {
        return true;
    } else {
        return false;
    }
};

// win condition
function hasWon() {
    if (matched === 16) {
        return true;
    } else {
        return false;
    }
};

//Check maching 
var setMatch = function() {
    open.forEach(function(card) {
        card.addClass("match");
    });
    open = [];
    matched += 2;

    if (hasWon()) {
        clearInterval(timer.clearTime);
        showModal();
    }
};

// reset opened cards 
var resetOpen = function() {
    open.forEach(function(card) {
        card.toggleClass("open");
        card.toggleClass("show");
    });
    open = [];
};

// Sets selected card to the open and shown state
function openCard(card) {
    if (!card.hasClass("open")) {
        card.addClass("open");
        card.addClass("show");
        open.push(card);
    }
};

/*
 * Event callback functions
 */

// reset game
var resetGame = function() {
    open = [];
    matched = 0;
    moveCounter = 0;
    resetTimer();
    updateMoveCounter();
    $(".card").attr("class", "card");
    updateCards();
    resetStars();
};

//game logic
var onClick = function() {
    if (isValid( $(this) )) {

        if (open.length === 0) {
            openCard( $(this) );

        } else if (open.length === 1) {
            openCard( $(this) );
            moveCounter++;
            updateMoveCounter();

            if (checkMatch()) {
                setTimeout(setMatch, 300);

            } else {
                setTimeout(resetOpen, 700);

            }
        }
    }
};

// resets game state 
var playAgain = function() {
    resetGame();
    modal.css("display", "none");
};

//Game states initialization
$(".card").click(onClick);
$(".restart").click(resetGame);
$(".play-again").click(playAgain);




// Randomize game board

$(updateCards);

