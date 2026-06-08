import { words } from "./words.js";

const word = document.getElementById('gword');
const textbox = document.getElementById('tbox');
const timer = document.getElementById('time');
const statContainer = document.querySelector('.stat-container');
const totalStat = document.getElementById('total-stat');
const rightStat = document.getElementById('right-stat');
const accuracyStat = document.getElementById('accuracy-stat');
const replayButton = document.getElementById('replay');

const DURATION = 60;
let min = DURATION;
let timerEnabled = false;

const len = words.length;
const wordCache = [];
const score = { right: 0, wrong: 0 };

function nextWord() {
  const rand = Math.floor(Math.random() * len);
  if(wordCache.includes(words[rand])) nextWord();
  word.textContent = words[rand];
  wordCache.push(words[rand]);
}

function wordListener() {
  nextWord();
  textbox.value = '';
  textbox.focus();
  textbox.addEventListener('input', checkWord);
}

function startTimer() {
  const downTimer = setInterval(() => {
    min--;
    timer.textContent = `00:${min.toString().padStart(2, '0')}`;
    if(min == 0) {
       clearInterval(downTimer);
       textbox.removeEventListener('input',checkWord);
       showStatPanel();
    }
  },1000)
}

function checkWord() {
  const gword = word.textContent;
  const typed = textbox.value;

  if(!timerEnabled) startTimer();
  timerEnabled = true;

  if(gword.length === typed.length) {
    gword == typed ? score.right++ : score.wrong++;

    setTimeout(() => {
      textbox.value = '';
      nextWord();
      },100);
  }
}

function showStatPanel() {
  const total = score.right + score.wrong;
  const right = score.right;
  const accuracy = (right == 0) ? 0 : (right / total) * 100;

  totalStat.textContent = `Total: ${total}`;
  rightStat.textContent = `Right: ${right}`;
  accuracyStat.textContent = `Accuracy: ${accuracy.toPrecision(4)}%`;

  score.right = 0;
  score.wrong = 0;

  statContainer.classList.add('active');

  replayButton.addEventListener('click', activateReplay);
}

function activateReplay() {
  replayButton.removeEventListener('click', activateReplay);
  statContainer.classList.remove('active');
  min = DURATION;
  timer.textContent = `00:${min.toString().padStart(2, '0')}`;
  timerEnabled = false;
  wordListener();
}

wordListener();