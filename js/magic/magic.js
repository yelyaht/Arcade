// Panels + output
var startPanel   = document.getElementById("startPanel");
var resultsPanel = document.getElementById("resultsPanel");
var out          = document.getElementById("output");

function showStart()  { startPanel.classList.remove("hidden"); resultsPanel.classList.add("hidden"); }
function showResults(){ startPanel.classList.add("hidden");    resultsPanel.classList.remove("hidden"); }

// Magic 8 Ball replies
var oracleReplies = [
  "Yes, definitely.",
  "Signs point to yes.",
  "It is certain.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Outlook not so good.",
  "Don't count on it.",
  "Very doubtful."
];

// Non-tournament: just Q → A until user stops
function startSession() {
  showResults();

  var historyHTML = "";
  var qCount = 0;

  while (true) {
    var q = prompt("Ask the Oracle a yes/no question.\n(Type 'n' or 'no' to stop.)");
    if (q === null) { alert("Session ended."); break; }

    q = q.trim();
    if (q === "") { alert("You must ask a question!"); continue; }
    if (/^n(o)?$/i.test(q)) { break; }

    var reply = oracleReplies[Math.floor(Math.random() * oracleReplies.length)];
    alert("🎱 " + reply);

    qCount++;
    historyHTML += "<li>Q" + qCount + ": “" + q + "” → " + reply + "</li>";
  }

  out.innerHTML =
    "<h2>Session Summary</h2>" +
    "<p><strong>Questions asked:</strong> " + qCount + "</p>" +
    "<ol>" + (historyHTML || "<li><em>No questions asked.</em></li>") + "</ol>";
}

// Wire buttons
document.getElementById("playBtn").addEventListener("click", startSession);
document.getElementById("playAgainBtn").addEventListener("click", startSession);
document.getElementById("backBtn").addEventListener("click", showStart);

// Initial state
showStart();

// Auto-run farewell if we arrived with ?farewell or #farewell
(function runFarewellIfRequested() {
  // Robust: works for ?farewell, ?farewell=1, ?FAREWELL=true, etc.
  const qs = location.search.toLowerCase();
  const hasFarewellParam = /\bfarewell(=|&|$)/.test(qs);

  const hasFarewellHash = location.hash.toLowerCase() === "#farewell";

  if (hasFarewellParam || hasFarewellHash) {
    const go = () => showFarewell();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", go);
    } else {
      go();
    }

    // Clean the URL so the flag doesn’t stick around on reload
    const url = new URL(location.href);
    url.searchParams.delete("farewell");
    if (hasFarewellHash) url.hash = "";
    history.replaceState(null, "", url.pathname);
  }
})();
