/***********************
 * Arcade – core state *
 ***********************/
// As requested: instantiate variables at the top.
let keepPlaying = false;
let askAgain = "";
let anotherGame = "";
let msg = "";
let input = "";
let num = 0;
let target = 0;
let question = "";
let choice = "";
let computer = "";
let replies = [];
let choices = ["bear", "ninja", "hunter"];

/***********************************
 * Utilities (prompts + page UI)   *
 ***********************************/
// Normalize y/n answers; returns 'y' or 'n' or '' (invalid/cancel)
function yn(ans) {
  if (ans === null) return "";                     // Cancel treated as invalid
  const v = ans.trim().toLowerCase();
  return v === "y" || v === "n" ? v : "";
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function showFarewell() {
  // Disable the game buttons and print farewell + reload button to HTML view
  document.querySelectorAll(".game-btn").forEach(b => b.disabled = true);
  const box = document.getElementById("farewell");
  box.innerHTML = `
    <p>Thanks for playing the Arcade. See you next time!</p>
    <button id="reloadBtn" class="btn" aria-label="Reload the Arcade">Reload Page</button>
  `;
  document.getElementById("reloadBtn").addEventListener("click", () => location.reload());
}

// Auto-run farewell if we arrived with ?farewell=... or #farewell
(function autoFarewell() {
  const params = new URLSearchParams(location.search);
  const hasFarewell = params.has("farewell") || location.hash.toLowerCase() === "#farewell";
  if (!hasFarewell) return;

  const run = () => showFarewell();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Clean the URL (preserve subfolder path on GitHub Pages)
  const clean = location.origin + location.pathname;
  history.replaceState(null, "", clean);
})();

/****************************************
 * Session manager (outside each game)  *
 ****************************************/
function launch(gameFn) {
  // PLAYING LOOP for a single selected game
  keepPlaying = true; // "Assume the player's answer is always yes (true)."
  while (keepPlaying) {
    gameFn(); // one Single Game session (one play-through)

    // Exact required message after each completed Single Game:
    askAgain = prompt("Would you like to keep playing this game? y/n");

    // Ternary operator to exit the loop
    keepPlaying = yn(askAgain) === "y" ? true : false;

    // If user typed something else, let them know and stop this game
    if (askAgain !== null && yn(askAgain) === "") {
      alert("Please answer with 'y' or 'n'. Ending this game session.");
      keepPlaying = false;
    }
  }

  // After the game loop ends, ask if they want a different game
  anotherGame = prompt("Would you like to pick another game to play?  y/n");

  if (yn(anotherGame) === "y") {
    alert("Great! Click another button to start a new game.");
    return; // View stays put with the three buttons
  }

  if (anotherGame !== null && yn(anotherGame) === "") {
    alert("Please answer with 'y' or 'n'. We'll end the arcade for now.");
  }
  showFarewell(); // n, cancel, or invalid → end Playing session
}

/**********************
 * Single-game logic  *
 **********************/

/*** 1) Guessing Game — Function Declaration ***/
function guessingGameSingle() {
  target = Math.floor(Math.random() * 10) + 1;
  input = prompt("Enter a whole number between 1 and 10:");

  if (input === null) { alert("Game cancelled."); return; }
  input = input.trim();
  if (input === "") { alert("No input provided."); return; }

  num = Number(input);
  if (!Number.isInteger(num) || num < 1 || num > 10) {
    alert("Invalid entry. Please enter a whole number between 1 and 10.");
    return;
  }

  msg = (num === target) ? "You win!" : "Not this time.";
  alert(`You guessed ${num}.\nThe number was ${target}.\n${msg}`);
}

/*** 2) Consult the Oracle (Magic 8 Ball) — Function Expression ***/
// No pre-prompt; first thing the player sees is the question prompt.
const consultOracleSingle = function () {
  const oracleReplies = [
    "Yes, definitely.",
    "Signs point to yes.",
    "It is certain.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Outlook not so good.",
    "Don't count on it.",
    "Very doubtful."
  ];

  // default target (no pre-game prompt)
  let targetWins = 3;
  let favor = 0;   // favorable omens
  let shadow = 0;  // unfavorable omens
  let round = 1;

  while (favor < targetWins && shadow < targetWins) {
    let q = prompt(`Round ${round} — Ask the Oracle a yes/no question:`);
    if (q === null) { alert("Match cancelled early."); break; }
    if (q.trim() === "") { alert("You must ask a question!"); continue; }

    const reply = oracleReplies[Math.floor(Math.random() * oracleReplies.length)];

    const isPositive = /^(yes|it is certain|signs point to yes)/i.test(reply);
    const isUnclear  = /(hazy|ask again)/i.test(reply);

    let note = "";
    if (isUnclear) {
      note = "The omens are unclear. No points awarded.";
    } else if (isPositive) {
      favor++; note = "Favorable omen (+1).";
    } else {
      shadow++; note = "Unfavorable omen (+1 to the shadows).";
    }

    alert(
      `🎱 ${reply}\n` +
      `${note}\n` +
      `Score — Favorable: ${favor} · Unfavorable: ${shadow} (first to ${targetWins})`
    );

    round++;
  }

  if (favor === shadow && favor < targetWins) {
    alert(`No result — match ended early.\nFinal — Favorable: ${favor} · Unfavorable: ${shadow}`);
  } else {
    alert(
      `${favor > shadow ? "✨ The Oracle favors you!" : "🌑 The omens are against you."}\n` +
      `Final — Favorable: ${favor} · Unfavorable: ${shadow}`
    );
  }
};

// Bear • Ninja • Hunter — single round (alerts-only, rubric-safe)
const bnhSingle = () => {
  let raw = prompt("Choose Bear, Ninja, or Hunter (B/N/H):");
  if (raw === null) { alert("Game cancelled."); return; }

  raw = raw.trim().toLowerCase();
  if (raw === "b") raw = "bear";
  else if (raw === "n") raw = "ninja";
  else if (raw === "h") raw = "hunter";

  if (!choices.includes(raw)) {
    alert("Invalid input. Type 'Bear', 'Ninja', or 'Hunter' (or B/N/H).");
    return;
  }

  computer = choices[Math.floor(Math.random() * choices.length)];

  let outcome = "";
  if (raw === computer) {
    outcome = "It's a tie.";
  } else if (
    (raw === "bear"   && computer === "ninja") ||
    (raw === "ninja"  && computer === "hunter") ||
    (raw === "hunter" && computer === "bear")
  ) {
    outcome = "You win!";
  } else {
    outcome = "Computer wins.";
  }

  alert(`You chose ${cap(raw)}.\nComputer chose ${cap(computer)}.\n${outcome}`);
};

/*************************************************
 * Buttons → use three different function *types* *
 *************************************************/
// The functions the buttons call are each a different type:

// Declaration
function playGuessingGame() { launch(guessingGameSingle); }

// Expression
const playOracle = function () { launch(consultOracleSingle); };

// Arrow
const playBNH = () => { launch(bnhSingle); };
