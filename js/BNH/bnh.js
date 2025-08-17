    var startPanel = document.getElementById("startPanel");
    var resultsPanel = document.getElementById("resultsPanel");
    var out = document.getElementById("output");

    function showStart() {
      startPanel.classList.remove("hidden");
      resultsPanel.classList.add("hidden");
    }
    function showResults() {
      startPanel.classList.add("hidden");
      resultsPanel.classList.remove("hidden");
    }

    function startMatch() {
      showResults();

      var targetInput = prompt("Play to how many wins? (e.g., 3)", "3");
      if (targetInput === null) {
        out.innerHTML = "<p>Match canceled before starting.</p>";
        return;
      }

      var target = parseInt(targetInput, 10);
      if (isNaN(target) || target < 1) {
        alert("Invalid number. Using 1.");
        target = 1;
      }

      var moves = ["BEAR", "NINJA", "HUNTER"];
      var pScore = 0, cScore = 0, round = 1;
      var historyHTML = "";

      while (pScore < target && cScore < target) {
        var entry = prompt("Round " + round + " — choose Bear, Ninja, or Hunter (B/N/H). Cancel to stop.", "");
        if (entry === null) {
          alert("You canceled. Ending match early.");
          break;
        }

        entry = entry.trim().toUpperCase();
        if (entry === "B") entry = "BEAR";
        else if (entry === "N") entry = "NINJA";
        else if (entry === "H") entry = "HUNTER";

        if (entry !== "BEAR" && entry !== "NINJA" && entry !== "HUNTER") {
          alert("Please enter B, N, or H (or the full word).");
          continue;
        }

        var comp = moves[Math.floor(Math.random() * 3)];
        var resultText = "";
        if (entry === comp) {
          resultText = "Draw";
        } else if (
          (entry === "BEAR" && comp === "HUNTER") ||
          (entry === "HUNTER" && comp === "NINJA") ||
          (entry === "NINJA" && comp === "BEAR")
        ) {
          pScore++; resultText = "You win the round";
        } else {
          cScore++; resultText = "Computer wins the round";
        }

        var line = "Round " + round + ": You = " + entry +
                   " | Computer = " + comp + " → " + resultText +
                   " (Score " + pScore + "–" + cScore + ")";

        alert(line);

        var cssClass = resultText.indexOf("You win") >= 0 ? "win"
                    : resultText.indexOf("Computer") >= 0 ? "lose" : "draw";
        historyHTML += "<li class='" + cssClass + "'>" + line + "</li>";

        round++;
      }

      var winnerText = (pScore === cScore)
        ? "No winner — match ended early."
        : (pScore > cScore ? "🏆 You win the match!" : "🤖 Computer wins the match!");

      alert("Final: " + pScore + "–" + cScore + ". " + winnerText);

      var summaryHTML =
        "<h2>Match Summary</h2>" +
        "<p>Target: " + target + "</p>" +
        "<p><strong>Final Score:</strong> " + pScore + "–" + cScore + "</p>" +
        "<p><strong>Result:</strong> " + winnerText + "</p>" +
        "<ol>" + historyHTML + "</ol>";

      out.innerHTML = summaryHTML;
    }

    document.getElementById("playBtn").addEventListener("click", startMatch);
    document.getElementById("playAgainBtn").addEventListener("click", startMatch);
    document.getElementById("backBtn").addEventListener("click", showStart);

    showStart();
