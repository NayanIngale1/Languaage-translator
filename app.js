async function translateText() {
  try {
    let inputLan = document.getElementById("input-language").value;
    let outputLan = document.getElementById("output-language").value;

    let input = document.getElementById("input-text").value;

    let res = await fetch("https://libretranslate.de/translate", {
      method: "POST",

      body: JSON.stringify({
        q: input,
        source: `${inputLan}`,
        target: `${outputLan}`,
        formate: "text",
      }),

      headers: {
        //   accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    let data = await res.json();
    console.log("data:", data);

    let display = document.getElementById("result-text");

    if (
      data.error == "Invalid request: missing q parameter" ||
      data.translatedText == "" ||
      data.error == "Slowdown: 20 per 1 minute"
    ) {
      display.innerText = "Translating";
    } else {
      display.innerText = data.translatedText;
    }
  } catch (err) {
    console.log("err:", err);
  }
}

let timerId;
const debounce = (func, delay) => {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    translateText();
  }, delay);
};

document.getElementById("input-text").addEventListener("keyup", () => {
  debounce(translateText, 500);
});

let input = document.getElementById("input-text");
let here = document.getElementById("#start-btn");

window.speechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;
var recognition = new speechRecognition();
var content = "";
recognition.interimResult = true;

//recognition is starting
recognition.onstart = () => {
  input.innerText = "Listning...";
};

recognition.onspeechend = () => {
  input.innerText = "Please try again.";
  mic.style.color = "var(--blue)";
};

recognition.onerror = (err) => {
  console.log("err:", err);
  input.innerText = "Sorry , Try Again ..!";
  mic.style.color = "var(--blue)";
};

recognition.addEventListener("result", (e) => {
  // console.log('e:', e)
  var current = e.results[0];
  console.log("current:", current);

  var obj = [current[0]][0];

  var transcript = obj.transcript;
  // console.log('transcript:', transcript)

  // console.log('content:', content)

  input.value = transcript;

  // if(is)
  debounce(translateText, 100);
});

let mic = document.getElementById("mic-on");
document.getElementById("start-btn").addEventListener("click", (e) => {
  if (!input.length) {
    content = +"";
    input.innerText = "Listning..";
  }

  mic.style.color = "red";
  recognition.start();
});

let Id;
const stop = () => {
  if (Id) {
    clearTimeout(Id);
  }
  Id = setTimeout(() => {
    recognition.onspeechend();
  }, 1000);
};

document.getElementById("output-language").addEventListener("onchange", () => {
  debounce(translateText, 400);
});
