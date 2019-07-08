var holes = document.querySelectorAll(".hole");
var scoreBoard = document.querySelector(".score");
var moles = document.querySelectorAll(".mole");
var endGame = document.getElementById("endGame");
var gameTime = 60000;
var lastHole;
var timeUp = false;
var score = 0;
var intervalID;

//МОЛОТОК
var block = document.getElementById("game");
block.addEventListener("mousemove", getClickPosition, false);
block.addEventListener("mousedown", molotBom, false);
block.addEventListener("mouseup", molotUp, false);
function molotBom(e) {
  e.preventDefault();
  requestAnimationFrame(function () {
    var picture = document.getElementById("thing");
    picture.classList.add("molotdown");
    picture.classList.toggle("molotup");
  })
}
function molotUp(e) {
  e.preventDefault();
  requestAnimationFrame(function () {
    var picture = document.getElementById("thing");
    picture.classList.add("molotup");
    picture.classList.toggle("molotdown");
  })
}


function getClickPosition(e) { //слушатель события движения мыши
  var picture = document.getElementById("thing");
  var parentPosition = getPosition(e.currentTarget);
  var xPosition = e.pageX - parentPosition.x + (picture.clientWidth / 2) / 2;
  var yPosition = e.pageY - parentPosition.y - (picture.clientHeight / 2) * 1.5;
  requestAnimationFrame(getPosition);
  (xPosition <= 0) ? picture.style.left = 0 + "px" : (xPosition >= block.offsetWidth - picture.offsetWidth) ? picture.style.left = (block.offsetWidth - picture.offsetWidth) + "px" : picture.style.left = xPosition + "px";
  (yPosition <= 0) ? picture.style.top = 0 + "px" : (yPosition >= block.offsetHeight - picture.offsetHeight) ? picture.style.top = (block.offsetHeight - picture.offsetHeight) + "px" : picture.style.top = yPosition + "px";
}

function getPosition(element) { //расчёт позиции элемента
  var xPos = 0;
  var yPos = 0;
  while (element) {
    if (element.tagName == "game") {
      var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = element.scrollTop || document.documentElement.scrollTop;
      xPos += (element.offsetLeft - xScroll + element.clientLeft);
      yPos += (element.offsetTop - yScroll + element.clientTop);
    }
    else {
      xPos += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPos += (element.offsetTop - element.scrollTop + element.clientTop);
    }
    element = element.offsetParent;
  }
  return {x: xPos, y: yPos};
}
//END

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  var idx = Math.floor(Math.random() * holes.length);
  var hole = holes[idx];
  if (hole === lastHole) {
    console.log("Ah nah thats the same one bud");
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  var time = randomTime(2000, 2000);
  var mole = randomHole(moles);
  mole.classList.add("up");
  setTimeout(function () {
    mole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function getTimeGame() {
  var gameStartTime = new Date();
  var interval = 1000;
  intervalID = setInterval(function () {
    endGame.textContent = Math.round((gameTime - (Date.now() - gameStartTime)) / 1000);
    console.log(Math.round((gameTime - (Date.now() - gameStartTime)) / 1000));
  }, interval);
}

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  getTimeGame();
  setTimeout(function () {
    timeUp = true;
    clearInterval(intervalID);
  }, gameTime)

}

function bonk(e) {
  //if(!e.isTrusted) return; // Проверка на нажатие пользователя. ЗАЧЕМ???
  score++;
  this.classList.remove("up");
  scoreBoard.textContent = score;

}

moles.forEach(function (mole) {
      mole.addEventListener("click", bonk)
    }
);


var gameList = document.getElementById("gameList");
var gameRulesList = document.getElementById("gameRulesList");
var gameEesultsList = document.getElementById("gameEesultsList");

var gameDiv = document.getElementById("gameDiv");
var gameRules = document.getElementById("gameRules");
var gameResults = document.getElementById("gameResults");

window.onhashchange = switchToStateFromURLHash;

function switchToStateFromURLHash() {
  var URLHash = window.location.hash;
  var stateJSON = decodeURIComponent(URLHash.substr(1));
  if (stateJSON != "")
    SPAState = JSON.parse(stateJSON);
  else
    SPAState = {pagename: 'gamePage'};

  var pageHTML = "";
  switch (SPAState.pagename) {
    case 'gameDiv':
      gameDiv.style.display = 'block';
      gameRules.style.display = 'none';
      gameResults.style.display = 'none';
      break;

    case 'gameRules':
      gameDiv.style.display = 'none';
      gameRules.style.display = 'block';
      gameResults.style.display = 'none';
      break;

    case 'gameResults':
      gameDiv.style.display = 'none';
      gameRules.style.display = 'none';
      gameResults.style.display = 'block';
      restoreInfo();
      break;
  }
}

function switchToState(newState) {
  location.hash = encodeURIComponent(JSON.stringify(newState));
}

gameList.onclick = function (EO) {
  switchToState({pagename: 'gameDiv'});
  EO.preventDefault();
}

gameRulesList.onclick = function (EO) {
  switchToState({pagename: 'gameRules'});
  EO.preventDefault();
}

gameResultsList.onclick = function (EO) {
  switchToState({pagename: 'gameResults'});
  EO.preventDefault();
}

switchToStateFromURLHash();