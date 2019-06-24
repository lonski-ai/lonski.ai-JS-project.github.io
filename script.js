var holes = document.querySelectorAll(".hole");
var pointBoard = document.querySelector(".score");
var moles = document.querySelectorAll(".mole");

var timeUp = false;
var score = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  var idx = Math.floor(Math.random() * holes.length);
  var hole = holes[idx];
  return hole;
}

function peep() {
  var time = randomTime(10000, 1000);
  var mole = randomHole(moles);
  mole.classList.add("up");
  setTimeout(function() {
    mole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  pointBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  var timerId =setTimeout(function(){
    timeUp = true
  }, 10000)
}

function hit(e) {
  score++;
  this.classList.remove("up");
  pointBoard.textContent = score;
  clearTimeout(timerId);
}

moles.forEach(function(mole) {
      mole.addEventListener("click", hit)
    }
);
