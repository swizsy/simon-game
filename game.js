var wrongSound = new Audio("sounds/wrong.mp3");

function Button(color, audio) {
    this.color = color;
    this.button = $("#" + color)[0];
    this.audio = audio;
}

var greenButton = new Button("green", new Audio("sounds/green.mp3"));
var redButton = new Button("red", new Audio("sounds/red.mp3"));
var yellowButton = new Button("yellow", new Audio("sounds/yellow.mp3"));
var blueButton = new Button("blue", new Audio("sounds/blue.mp3"));

var buttons = [greenButton, redButton, yellowButton, blueButton];
var sequence = [];

var sequenceIndex = 0;
var gameIterationTimeout;
var started = false;

$(document).on("keydown", startGame);
$("#level-title").on("click", startGame);

function startGame() {
    if (started) {
        return;
    }
    started = true;
    $(document).off();
    $("#level-title").off();
    registerButtons();
    performGameIteration();
}

function performGameIteration() {
    sequenceIndex = 0;
    getRandomColor();
    $("#level-title").text("Level " + sequence.length);
}

function evaluate(color) {
    if (color === sequence[sequenceIndex]) {
        if (sequenceIndex + 1 < sequence.length) {
            sequenceIndex++;
            return;
        } else {
            gameIterationTimeout = setTimeout(() => {
                performGameIteration();
            }, 2000);
            return;
        }
    } else {
        setGameOver();
    }
}

function clickButton(button, playerClick = false) {
    if (!button.audio.isPaused) {
        button.audio.pause();
        button.audio.currentTime = 0;
    }
    button.audio.play();
    displayButtonPress(button.button);

    if (playerClick) {
        evaluate(button.color);
    }
}

function setGameOver() {
    clearTimeout(gameIterationTimeout);
    deregisterButtons();
    started = false;
    sequence = [];
    wrongSound.play();
    $("body").addClass("game-over");
    setTimeout(() => {
        $("body").removeClass("game-over");
    }, 200);
    $("#level-title").text("Game Over, Press Any Key to Restart");
    $(document).on("keydown", startGame);
    $("#level-title").on("click", startGame);
}

function registerButtons() {
    greenButton.button.addEventListener("click", greenButtonClick);
    redButton.button.addEventListener("click", redButtonClick);
    yellowButton.button.addEventListener("click", yellowButtonClick);
    blueButton.button.addEventListener("click", blueButtonClick);
}

function greenButtonClick() {
    clickButton(greenButton, true);
}

function redButtonClick() {
    clickButton(redButton, true);
}

function yellowButtonClick() {
    clickButton(yellowButton, true);
}

function blueButtonClick() {
    clickButton(blueButton, true);
}

function deregisterButtons() {
    greenButton.button.removeEventListener("click", greenButtonClick);
    redButton.button.removeEventListener("click", redButtonClick);
    yellowButton.button.removeEventListener("click", yellowButtonClick);
    blueButton.button.removeEventListener("click", blueButtonClick);
}

function displayButtonPress(button) {
    $(button).addClass("pressed");
    setTimeout(function() {
        $(button).removeClass("pressed");
    }, 100);
}

function getRandomColor() {
    var random = Math.floor(Math.random() * 4);
    switch (random) {
        case 0:
            sequence.push("green");
            clickButton(greenButton);
            break;
        case 1:
            sequence.push("red");
            clickButton(redButton);
            break;
        case 2:
            sequence.push("yellow");
            clickButton(yellowButton);
            break;
        case 3:
            sequence.push("blue");
            clickButton(blueButton);
            break;
        default:
            console.log("Invalid value: " + random);
    }
}
