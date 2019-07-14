'use strict'
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const endGame = document.querySelector(".endGame");
const block = document.getElementById("game");
const picture = document.getElementById("thing");
const gameList = document.getElementById("gameList");
const gameRulesList = document.getElementById("gameRulesList");
const gameResultsList = document.getElementById("gameResultsList");
const gameDiv = document.getElementById("gameDiv");
const gameRules = document.getElementById("gameRules");
const gameResults = document.getElementById("gameResults");
const gameTime = 60000;
let lastHole;
let timeUp = false;
let score = 0;
let intervalID;
const stringName = 'Lonski_projectJs';
let UpdatePassword;
const MyStorage = new TAJAXStorage();

block.addEventListener("mousemove", getClickPosition, false);
block.addEventListener("mousedown", molotBom, false);
block.addEventListener("mouseup", molotUp, false);

/**
 * Функции обработки нажатия и поднятия кнопки мыши
 * @param e
 */

function molotBom(e) {
  const audio = new Audio();
  audio.src = './audio/2.mp3';
  audio.autoplay = true;
  e.preventDefault();
  requestAnimationFrame(function () {
    picture.classList.add("molotdown");
    picture.classList.toggle("molotup");
  })
}
function molotUp(e) {
  e.preventDefault();
  requestAnimationFrame(function () {
    picture.classList.add("molotup");
    picture.classList.toggle("molotdown");
  })
}
/**
 * Обработка движения картинки молотка за курсором
 * @param e
 */
function getClickPosition(e) {
  const parentPosition = getPosition(e.currentTarget);
  let xPosition = e.pageX - parentPosition.x + (picture.clientWidth / 2) / 2;
  let yPosition = e.pageY - parentPosition.y - (picture.clientHeight / 2) * 1.5;
  requestAnimationFrame(getPosition);
  (xPosition <= 0) ? picture.style.left = 0 + "px" : (xPosition >= block.offsetWidth - picture.offsetWidth) ? picture.style.left = (block.offsetWidth - picture.offsetWidth) + "px" : picture.style.left = xPosition + "px";
  (yPosition <= 0) ? picture.style.top = 0 + "px" : (yPosition >= block.offsetHeight - picture.offsetHeight) ? picture.style.top = (block.offsetHeight - picture.offsetHeight) + "px" : picture.style.top = yPosition + "px";
}

function getPosition(element) {
  let xPos = 0;
  let yPos = 0;
  while (element) {
    if (element.tagName == "game") {
      let xScroll = element.scrollLeft || document.documentElement.scrollLeft;
      let yScroll = element.scrollTop || document.documentElement.scrollTop;
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

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

/**
 * Функция выбора случайного крота
 * @param holes
 * @returns {*}
 */

function randomMole(moles) {
  const idx = Math.floor(Math.random() * moles.length);
  const hole = moles[idx];
  if (hole === lastHole) {
    return randomMole(moles);
  }
  lastHole = hole;
  return hole;
}

/**
 * Функция поднятия и опускания крота
 */

function peep() {
  const time = randomTime(500, 2000);
  const mole = randomMole(moles);
  mole.classList.add("up");
  setTimeout(function () {
    mole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

/**
 * Функция расчета времени до конца игры
 */

function getTimeGame() {
  const gameStartTime = new Date();
  const interval = 1000;
  intervalID = setInterval(function () {
    endGame.textContent = Math.round((gameTime - (Date.now() - gameStartTime)) / 1000);

  }, interval);
}

/**
 * Функция запуска игры.
 * Устанавливает 0 счет, запускат аудио и таймер, по истечению которого записывается имя и результат.
 */

function startGame() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  peep();
  getTimeGame();
  const audio = new Audio();
  audio.src = './audio/1.mp3';
  audio.autoplay = true;
  setTimeout(function () {
    timeUp = true;
    clearInterval(intervalID);
    do {
      var name = prompt("Имя?");
    } while (name == null || name == "");

    MyStorage.AddValue(name, score);
  }, gameTime)
}

function bang(e) {
  score++;
  this.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach(function (mole) {
  mole.addEventListener("click", bang);
  mole.addEventListener("targetTouches", bang)
    }
);

window.onhashchange = switchToStateFromURLHash;

let SPAState = {};

/**
 * SPA
 */
function switchToStateFromURLHash() {
  const URLHash = window.location.hash;
  const stateJSON = decodeURIComponent(URLHash.substr(1));
  if (stateJSON != "")
    SPAState = JSON.parse(stateJSON);
  else
    SPAState = {pagename: 'gamePage'};
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
      createRecordTable(gameResults, MyStorage.myHash);
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

function TAJAXStorage() {
  const self = this;
  self.myHash = [];
  $.ajax("https://fe.it-academy.by/AjaxStringStorage2.php",
      {type: "POST", dataType: "json", data: {f: "READ", n: stringName}, success: ajaxDBStartReady, error: errorHandler}
  );

  function errorHandler(statusStr, errorStr) {
    alert(statusStr + ' ' + errorStr);
  }

  function ajaxDBStartReady(ResultH) {
    if (ResultH.error != undefined) {
      alert(ResultH.error);
    }
    else if (ResultH.result != '') {
      self.myHash = JSON.parse(ResultH.result);
    }
    else {
      $.ajax("https://fe.it-academy.by/AjaxStringStorage2.php",
          {type: "POST", dataType: "json", data: {f: "INSERT", n: stringName, v: JSON.stringify(self.myHash)}}
      );
    }
  }

  this.AddValue = function (name, score) {
    const user = {"name": name, "score": score};
    self.myHash.push(user);
    sendInfo(self.myHash);
  }

  function sendInfo(hash) {
    UpdatePassword = Math.random();
    $.ajax("https://fe.it-academy.by/AjaxStringStorage2.php",
        {type: 'POST', dataType: "json", data: {f: 'LOCKGET', n: stringName, p: UpdatePassword}, cache: false, success: lockGetReady, error: errorHandler}
    );
  }

  function lockGetReady(data) {
    $.ajax("https://fe.it-academy.by/AjaxStringStorage2.php",
        {type: 'POST', dataType: "json", data: {f: 'UPDATE', n: stringName, v: JSON.stringify(self.myHash), p: UpdatePassword}, cache: false}
    );
  }
}

/**
 * Функция создания таблицы разультатов
 * @param field
 * @param data
 */

function createRecordTable(field, data) {
  data.sort(compareScore);
  let pageHTML = '';
  pageHTML += '<table class = "tableResult" border=1><thead>' + '<td>' + '№' + '</td>' + '<td>' + 'ИМЯ' + '</td>' + '<td>' + 'СЧЕТ' + '</td>' + '</thead><tbody>';
  for (let i = 0; i < data.length; i++) {
    pageHTML += '<tr>';
    pageHTML += '<td>' + (i + 1) + '</td>' + '<td>' + data[i].name + '</td>' + '<td>' + data[i].score + '</td>';
    pageHTML += '</tr>';
  }
  pageHTML += '</tbody></table>';
  field.innerHTML = pageHTML;
  paintingTable();
}

function compareScore(a, b) {
  return b.score - a.score;
}

/**
 * Раскрска четных строк таблицы разультатов
 */
function paintingTable() {
  $('.tableResult tr:nth-child(even)').css('background', 'lightgray');
}

