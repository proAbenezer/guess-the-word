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
let score = 0;
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
  setTimeout(() => (message.innerHTML = ""), 5000);
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

  addBoxesBehavior(inputFieldElements);
}

function addBoxesBehavior(boxes) {
  let activeBox = null; // Track active box

  activeBox = boxes[0];
  activeBox.focus();
  activeBox.setAttribute("id", "active-input");
  boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
      if (activeBox) activeBox.removeAttribute("id");
      box.setAttribute("id", "active-input");
      box.focus();
      activeBox = box;
    });

    box.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && index < boxes.length - 1) {
        moveFocus(index + 1);
      }
    });

    box.addEventListener("keydown", (e) => {
      box.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
          e.preventDefault();

          if (box.value) {
            box.value = "";
          } else if (index > 0) {
            moveFocus(index - 1);
          }
        } else if (e.key === "ArrowLeft" && index > 0) {
          moveFocus(index - 1);
        } else if (e.key === "ArrowRight" && index < boxes.length - 1) {
          moveFocus(index + 1);
        }
      });
    });
  });
  function moveFocus(newIndex) {
    if (activeBox) activeBox.removeAttribute("id");
    setTimeout(() => boxes[newIndex].focus(), 10);
    boxes[newIndex].setAttribute("id", "active-input");
    activeBox = boxes[newIndex];
  }
}

function checkAnswer(boxes) {
  let userInput = "";

  //check if the boxes are all filled
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].value === null || boxes[i].value === "") {
      message.innerHTML =
        "Do I look like stupid to you? Fill it out, master. I know nothing!";
      message.style.color = "#9E9E9E";
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
      tries = 5;
      triesElement.innerHTML = "(5/5)";
      clearTryBoxes();
      score = 0;
      return restart();
    }
    message.innerHTML = "You’re incorrect, loser. What are you, a 4th grader?";
    message.style.color = "#D32F2F";
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
    message.innerHTML =
      "Well, you barely made it alive this time. Next time, I’ll kill you myself!";
    message.style.color = "#388E3C";
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

checkWordBtn.addEventListener("click", () => {
  checkAnswer(inputFieldContainer.querySelectorAll("input"));
});
restartBtn.addEventListener("click", restart);

generateRandomWord();
