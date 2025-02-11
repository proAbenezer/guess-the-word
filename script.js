const inputFieldContainer = document.getElementById("input-field-container");
const inputFieldTemplate = document.getElementById("input-field-template");
const randomWordElement = document.getElementById("randomWord");
const checkWordBtn = document.getElementById("checkBtn");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");
const highScoreElement = document.getElementById("highScore");
const triesboxesElement = document.querySelectorAll("#tries-box > div ");
const triesElement = document.getElementById("tries");

let words = ["example", "javascript", "coding", "challenge"];
fetch("./words.json")
  .then((response) => response.json())
  .then((data) => {
    if (data.words && Array.isArray(data.words)) {
      words = data.words;
    }
  })
  .catch((error) => {
    console.error("Failed to load words.json. Using fallback words.", error);
  });

let currentWord = "";
let tries = 5;
let highScore = 0;
let mistakesIndexes = [];
triesElement.innerHTML = `(${tries}/5)`;
function scrambleWord(word) {
  if (typeof word != "string" || word.length == 0) {
    return "";
  }
  // Scramble and return the scrambled word
  let wordsArray = word.split("");
  for (let i = wordsArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [wordsArray[i], wordsArray[j]] = [wordsArray[j], wordsArray[i]]; // Swap elements
  }
  return wordsArray.join("");
}

function generateRandomWord() {
  setTimeout(() => (message.innerHTML = ""), 2000);
  // Generate and display scrambled word
  const randomWordIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomWordIndex];
  const scrambledWord = scrambleWord(currentWord);
  createInputFields(scrambledWord.length);
  randomWordElement.textContent = scrambledWord;
}

function createInputFields(length) {
  // Create number of input fields according to the number of letters
  inputFieldContainer.innerHTML = "";
  for (let i = 0; i < length; i++) {
    const inputFieldTemplateClone = inputFieldTemplate.content.cloneNode(true);
    inputFieldContainer.appendChild(inputFieldTemplateClone);
  }
  const inputFieldElements = inputFieldContainer.querySelectorAll("input");
  inputFieldContainer[0].focus();
  inputFieldElements[0].setAttribute("id", "active-input");
  addBoxesBahvior(inputFieldElements);
}

function addBoxesBahvior(boxes) {
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      boxes.forEach((box, index) => {
        box.removeAttribute("id");
      });
      box.setAttribute("id", "active-input");
      box.focus();
    });
    box.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && index < boxes.length - 1) {
        box.removeAttribute("id");
        boxes[index + 1].setAttribute("id", "active-input");
        boxes[index + 1].focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && index > 0) {
        boxes[index - 1].focus();
        boxes[index - 1].setAttribute("id", "active-input");
        box.removeAttribute("id");
        e.target.value = "";
      } else if (e.key === "Backspace" && index === 0) {
        e.target.value = "";
      }

      if (e.key === "ArrowLeft" && index > 0) {
        box.removeAttribute("id");
        boxes[index - 1].focus();
        boxes[index - 1].setAttribute("id", "active-input");
      }

      if (e.key === "ArrowRight" && index < boxes.length - 1) {
        box.removeAttribute("id");
        boxes[index + 1].setAttribute("id", "active-input");
        boxes[index + 1].focus();
      }
    });
  });
}
function handleInput(event) {}

function checkAnswer(boxes) {
  let userInput = "";
  let score = 0;

  //check if the boxes are all filled
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].value === null || boxes[i].value === "") {
      tries--;
      message.innerHTML = "please fill out all of the words";
      message.style.color = "yellow";
      return;
    }
  }

  tries--;
  //Build user input
  boxes.forEach((box) => (userInput += box.value.toLowerCase()));

  triesboxesElement[tries].style.backgroundColor = "#4A5567";
  triesElement.innerHTML = `(${tries}/5)`;
  //check answer
  if (userInput !== currentWord) {
    if (tries === 0) {
      return restart();
    }
    message.innerHTML = "wrong answer try again";
    message.style.color = "red";
    for (let i = 0; i < currentWord.length; i++) {
      if (currentWord[i] !== userInput[i]) {
        boxes[i].classList.add("wrongAnswer");
      }
    }
  } else {
    score++;
    highScore = highScore >= score ? highScore : score;
    highScoreElement.innerHTML = highScore;
    triesElement.innerHTML = "(5/5)";
    message.innerHTML = "You won";
    message.style.color = "green";
    generateRandomWord();
  }
}

function restart() {
  clearAll();
  generateRandomWord();
}
function clearAll() {
  tries.innerHTML = "(5/5)";
  message.innerHTML = "";
  tries = 5;
  clearTryBoxes();
  mistakesIndexes = [];
  triesboxesElement.forEach((box) => (box.style.backgroundColor = "#7429C6"));
}
function clearTryBoxes() {
  triesboxesElement.forEach((box) => {
    box.classList.remove("bg-steelGray");
    box.classList.add("bg-deepViolet");
  });
}
window.addEventListener("keypress", handleInput);

checkWordBtn.addEventListener("click", () => {
  checkAnswer(inputFieldContainer.querySelectorAll("input"));
});
restartBtn.addEventListener("click", restart);

generateRandomWord();
