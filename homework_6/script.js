const allDigitBtn = document.querySelectorAll(".digit");
const allSigns = document.querySelectorAll(".sign");
const result = document.querySelector(".result");
const expression = document.querySelector(".expression");
const equal = document.querySelector(".equal__sign");
const resetBtn = document.querySelector(".reset__btn");

const signArray = ["-", "=", "+", "/", "*", "enter"];

let signFlag = false; // знак флага, говорящий о том, что дальше может быть только 2е число или сброс
let operation = "";
let firstNumber = "";
let secondNumber = "";
let lockKeyboard = false; // блокируем клавиатуру после знака равно

// считываем клавиатуру
document.addEventListener("keyup", (e) => {
  const pressed = e.key.toLowerCase();
  if (!lockKeyboard) {
    if (pressed >= 0 && pressed <= 9) {
      runAnimationHover(pressed);
      if (checkLength()) {
        result.innerText += pressed;
      }
    } else {
      if (signArray.includes(pressed) || signFlag) {
        findOperation(pressed);
      }
    }
  }
  if (pressed == "c" || pressed == "с") {
    reset();
  }
});

// печатаем значения в поле ввода
allDigitBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (checkLength()) {
      result.innerText += btn.textContent;
    }
  });
});

// проверка на введённые цифры или знаки операции
allSigns.forEach((sign) => {
  sign.addEventListener("click", () => {
    checkNumbers(sign.textContent);
  });
});

// считаем выражение
equal.addEventListener("click", () => {
  if (emptyText()) {
    calculate();
  }
});

// сброс на default значения
resetBtn.addEventListener("click", () => {
  reset();
});

// считаем по кнопкам клавиатуры
function findOperation(e) {
  if (e == "=" || e == "enter") {
    if (firstNumber && emptyText()) {
      calculate();
      lockKeyboard = true;
    }
  } else {
    checkNumbers(e);
  }
}

// печатаем значения в поле выражения, с проверкой на то, что выбран знак операции
function checkNumbers(sign) {
  if (emptyText()) {
    if (!signFlag) {
      operation = sign;
      firstNumber = +result.textContent;
      expression.innerText += ` ${firstNumber} ${operation}`;
      result.textContent = "";
      signFlag = true;
      toggleSign(true);
    }
  }
}

// отключаем возможность повторного выбора знака операции
function toggleSign(flag) {
  allSigns.forEach((sign) => {
    sign.disabled = flag;
  });
}

// проверка на введённые цифры в поле ввода
function emptyText() {
  return result.textContent.length;
}

function checkLength() {
  const length = emptyText();
  return length < 7;
}

// считаем выражение
function calculate() {
  expression.innerText += ` ${result.textContent}`;
  toggleDigit(true);
  const secondNumber = +result.textContent;

  switch (operation) {
    case "x":
    case "*":
      const resultMult = (+firstNumber * secondNumber).toString();
      if (resultMult.split("").length > 7) {
        result.style.fontSize = "4rem";
        result.innerText = resultMult;
      }
      break;
    case "-":
      result.innerText = firstNumber - secondNumber;
      break;
    case "+":
      result.innerText = firstNumber + secondNumber;
      break;
    case "/":
      if (secondNumber == 0) {
        result.innerText = "Ошибка";
      } else {
        result.innerText = parseFloat((+firstNumber / secondNumber).toFixed(5));
      }
    default:
      return;
  }
}

function runAnimationHover(e) {
  allDigitBtn[allDigitBtn[e].dataset.index].classList.toggle("active");
  setTimeout(() => {
    allDigitBtn.forEach((btn) => btn.classList.remove("active"));
  }, 150);
}
// disabled на цифры
function toggleDigit(flag) {
  allDigitBtn.forEach((btn) => {
    btn.disabled = flag;
  });
  equal.disabled = flag;
}
// сбрасываем поля, значения, активируем кнопки на default
function reset() {
  toggleDigit(false);
  toggleSign(false);
  firstNumber = "";
  secondNumber = "";
  operation = "";
  result.textContent = "";
  expression.textContent = "";
  signFlag = false;
  lockKeyboard = false;
  result.style.fontSize = "7rem";
}
