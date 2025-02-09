const inputFieldContainer = document.getElementById("input-field-container");
const inputFieldTemplate = document.getElementById("input-field-template");
const textBox = document.getElementById("text-box");
const randomWordBtn = document.getElementById("randomBtn");
const checkWordBtn = document.getElementById("checkBtn");
const restartBtn = document.getElementById("restart");
const message = document.getElementById("message");
const mistakesElement = document.getElementById("mistakes");
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
let tries = 0;
let mistakes = "";
let currentInputIndex = 0;
let userInput = "";
let wrongWords = [];

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
  // Generate and display scrambled word
  clearAll();

  const randomWordIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomWordIndex];
  const scrambledWord = scrambleWord(currentWord);
  createInputFields(scrambledWord.length);
  textBox.textContent = scrambledWord;
}

function createInputFields(length) {
  // Create number of input fields according to the number of letters
  inputFieldContainer.innerHTML = "";
  for (let i = 0; i < length; i++) {
    const inputFieldTemplateClone = inputFieldTemplate.content.cloneNode(true);
    inputFieldContainer.appendChild(inputFieldTemplateClone);
  }
  inputFieldContainer.children[0].setAttribute("id", "active-input");
  inputFieldContainer.children[0].placeholder = "_";
}

function handleInput(event) {
  console.log("even");
  message.innerHTML = "";

  const inputBoxes = inputFieldContainer.querySelectorAll("input");
  //handling user Input
  inputBoxes.forEach((box, index) => {
    box.addEventListener("input", (e) => {
      if (e.target.value && index < inputBoxes.length - 1) {
        inputBoxes[index + 1].focus();
        inputBoxes[index].removeAttribute("id");
        inputBoxes[index + 1].setAttribute("id", "active-input");
        inputBoxes[index + 1].placeholder = "_";
      }
    });
  });

  inputBoxes.forEach((box, index) => {
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) {
        e.target.value = "";
        inputBoxes[index - 1].focus();
        inputBoxes[index - 1].setAttribute("id", "active-input");
        inputBoxes[index].removeAttribute("id");
        inputBoxes[index].placeholder = "";
        if (index < inputBoxes.length - 1) {
          inputBoxes[index + 1].removeAttribute("id");
          inputBoxes[index + 1].placeholder = "";
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputBoxes[index - 1].focus();
        inputBoxes[index - 1].setAttribute("id", "active-input");
        inputBoxes[index].removeAttribute("id");

        if (!inputBoxes[index - 1].value) {
          inputBoxes[index - 1].placeholder = "_";
        }
        if (!inputBoxes[index].value) {
          inputBoxes[index].placeholder = "";
        }
        if (index < inputBoxes.length - 1) {
          inputBoxes[index + 1]?.removeAttribute("id");
        }
      } else if (e.key == "ArrowRight" && index < inputBoxes.length - 1) {
        inputBoxes[index + 1].focus();
        inputBoxes[index + 1].setAttribute("id", "active-input");
        inputBoxes[index].removeAttribute("id");
        console.log(inputBoxes[index].value);
        if (!inputBoxes[index + 1].value) {
          inputBoxes[index + 1].placeholder = "_";
        }
        if (!inputBoxes[index].value) {
          inputBoxes[index].placeholder = "";
        }
        if (index < inputBoxes.length - 1) {
          inputBoxes[index - 1]?.removeAttribute("id");
        }
      }
    });
  });

  if (event.key === "Enter") {
    checkAnswer(inputBoxes);
  }
}

function checkAnswer(boxes) {
  mistakes = [];
  mistakesElement.innerHTML = "";
  if (tries == 5) {
    message.innerHTML = "You lost you are such a loser, cray baby";
    message.style.color = "#6b7280";
    return;
  }
  userInput = "";
  for (let i = 0; i < boxes.length; i++) {
    if (!boxes[i].value || boxes[i].value == "") {
      message.innerHTML = "please fill out all the boxes";
      message.style.color = "#eab308";
      return;
    }
    userInput += boxes[i].value;
  }
  if (userInput.toLowerCase() !== currentWord.toLowerCase()) {
    message.innerHTML = "wrong answer!! is that all you got I'm sorry for you ";
    message.style.color = "#ef4444";
    const wrongLetter = [];
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] != currentWord[i]) {
        wrongLetter.push(userInput[i]);
      }
    }
    mistakes = "";
    mistakesElement.innerHTML = "";
    mistakes = wrongLetter.join(",");
    wrongLetter.splice(0, wrongLetter.length);

    mistakesElement.innerHTML = ` ${mistakes}`;
    tries += 1;
    triesElement.innerHTML = `(${tries}/5)`;
    fillTryBoxes();
  } else {
    message.innerHTML =
      "You won! you almost made it by chance you won't be making alive next time";
    message.style.color = "#7429C6";
  }
}
function fillTryBoxes() {
  for (let i = 0; i < tries; i++) {
    console.log(triesboxesElement[i]);
    triesboxesElement[i].style.backgroundColor = "#7429C6";
  }
}
function clearTryBoxes() {
  triesboxesElement.forEach((box) => {
    box.style.backgroundColor = "#4A5567";
  });
}
function restart() {
  clearAll();
  generateRandomWord();
}
function clearAll() {
  message.innerHTML = "";
  mistakesElement.innerHTML = "";
  currentInputIndex = 0;
  tries = 0;
  tries.innerHTML = "(0/5)";
  clearTryBoxes();
  userInput = "";
  mistakes = [];
  userInput = [];
}
window.addEventListener("keypress", handleInput);
randomWordBtn.addEventListener("click", () => {
  generateRandomWord();
  message.innerHTML = "yeah, maybe running away is you best option! pathetic ";
  message.style.color = "#F2F5F9";
});
checkWordBtn.addEventListener("click", () =>
  checkAnswer(inputFieldContainer.querySelectorAll("input"))
);
/* restartBtn.addEventListener("click", restart); */

// Initial load
generateRandomWord();
