// Panels + output
var startPanel   = document.getElementById("startPanel");
var resultsPanel = document.getElementById("resultsPanel");
var out          = document.getElementById("output");

function showStart()  { startPanel.classList.remove("hidden"); resultsPanel.classList.add("hidden"); }
function showResults(){ startPanel.classList.add("hidden");    resultsPanel.classList.remove("hidden"); }

// Non-tournament guessing session: keep guessing until correct (or stop)
function startSession() {
  showResults();

  var secret = Math.floor(Math.random() * 10) + 1; // 1..10
  var historyHTML = "";
  var guessCount = 0;

  while (true) {
    var input = prompt(
      guessCount === 0
        ? "I'm thinking of a number between 1 and 10.\nWhat's your guess? (type 'n' or 'no' to stop)"
        : "Guess again (1–10). Type 'n' or 'no' to stop."
    );
    if (input === null) { alert("Session ended."); break; }

    input = input.trim().toLowerCase();
    if (input === "") { alert("Please enter a number between 1 and 10."); continue; }
    if (/^n(o)?$/.test(input)) { break; }

    var guess = Number(input);
    if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
      alert("Please enter a whole number between 1 and 10.");
      continue;
    }

    guessCount++;

    if (guess === secret) {
      alert("Correct! 🎉");
      historyHTML += "<li class='win'>Guess " + guessCount + ": " + guess + " → Correct!</li>";
      break;
    }

    if (guess < secret) {
      alert("Too low.");
      historyHTML += "<li class='draw'>Guess " + guessCount + ": " + guess + " → Too low.</li>";
    } else {
      alert("Too high.");
      historyHTML += "<li class='draw'>Guess " + guessCount + ": " + guess + " → Too high.</li>";
    }
  }

  out.innerHTML =
    "<h2>Session Summary</h2>" +
    "<p><strong>Secret number:</strong> " + secret + "</p>" +
    "<p><strong>Total guesses:</strong> " + guessCount + "</p>" +
    "<ol>" + (historyHTML || "<li><em>No valid guesses.</em></li>") + "</ol>";
}

// Wire buttons
document.getElementById("playBtn").addEventListener("click", startSession);
document.getElementById("playAgainBtn").addEventListener("click", startSession);
document.getElementById("backBtn").addEventListener("click", showStart);

// Initial state
showStart();
