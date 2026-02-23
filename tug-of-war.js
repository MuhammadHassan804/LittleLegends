// tug-of-war.js
// Complete logic ✅ with tug-of-war mechanics, win videos, and 2-minute timer
// - Calculator-style dialers (digits build the number, X clears, ✓ submits)
// - Only active team's keypad works
// - Operation + Difficulty from URL: tug-of-war.html?op=add&lvl=easy
// - Video moves based on correct/wrong answers
// - Team loses after 3 wrong answers
// - 2-minute timer: when time ends, winner determined by score
// - Win videos: blue-win.mp4, red-win.mp4, draw.mp4 with enhanced victory screens

// ---------- Elements (safe) ----------
const blueScoreEl = document.getElementById("blueScore");
const redScoreEl  = document.getElementById("redScore");
const miniBlueEl  = document.getElementById("miniBlue");
const miniRedEl   = document.getElementById("miniRed");

const blueQuestionEl = document.getElementById("blueQuestion");
const redQuestionEl  = document.getElementById("redQuestion");

const blueDisplay = document.getElementById("blueDisplay");
const redDisplay  = document.getElementById("redDisplay");

const bluePad = document.getElementById("bluePad");
const redPad  = document.getElementById("redPad");

const teamBlue = document.getElementById("teamBlue");
const teamRed  = document.getElementById("teamRed");

const blueHint = document.getElementById("blueHint");
const redHint  = document.getElementById("redHint");

const turnPill = document.getElementById("turnPill");
const restartBtn = document.getElementById("restartBtn");

const timerEl = document.getElementById("timer");

// Video elements
const videoContainer = document.getElementById("videoContainer");
const tugVideo = document.getElementById("tugVideo");
const videoOverlay = document.getElementById("videoOverlay");

// Draw popup elements
const drawPopup = document.getElementById("drawPopup");
const closeDrawPopup = document.getElementById("closeDrawPopup");

// If this JS accidentally loads on index.html, just stop.
const requiredEls = [
  blueScoreEl, redScoreEl, miniBlueEl, miniRedEl,
  blueQuestionEl, redQuestionEl, blueDisplay, redDisplay,
  bluePad, redPad, teamBlue, teamRed, blueHint, redHint,
  turnPill, restartBtn, timerEl, videoContainer, tugVideo, 
  videoOverlay, drawPopup, closeDrawPopup
];

if (requiredEls.some(el => !el)) {
  console.warn("tug-of-war.js: Required elements not found (not on tug-of-war page).");
} else {

  // ---------- Game State ----------
  let blueScore = 0;
  let redScore  = 0;

  // Wrong answer counters
  let blueWrongCount = 0;
  let redWrongCount = 0;

  // Game over flag
  let gameOver = false;

  let currentTurn = "blue"; // "blue" | "red"
  let blueAnswer = 0;
  let redAnswer  = 0;

  // Timer variables - 2 minutes (120 seconds)
  let timerSeconds = 120;
  let timerId = null;
  let timerRunning = false;

  // Video position (-80 to 80, 0 is center)
  let videoPosition = 0;
  const MAX_POSITION = 80; // Maximum movement in pixels (positive = red side, negative = blue side)

  // ---------- Mode (Operation + Difficulty) ----------
  const params = new URLSearchParams(window.location.search);
  const selectedOp  = (params.get("op")  || "add").toLowerCase();     // add | sub | mul | div
  const selectedLvl = (params.get("lvl") || "easy").toLowerCase();    // easy | medium | hard

  const DIFF = {
    easy: {
      add: [0, 10],
      sub: [0, 10],
      mulA: [0, 10],
      mulB: [0, 10],
      divB: [1, 10],
      divAns: [0, 10]
    },
    medium: {
      add: [10, 50],
      sub: [10, 50],
      mulA: [2, 12],
      mulB: [2, 12],
      divB: [2, 12],
      divAns: [2, 12]
    },
    hard: {
      add: [50, 200],
      sub: [50, 200],
      mulA: [10, 20],
      mulB: [10, 20],
      divB: [5, 20],
      divAns: [5, 20]
    }
  };

  // ---------- Helpers ----------
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickRange(range) {
    return randInt(range[0], range[1]);
  }

  function clampMode() {
    const okOps = new Set(["add", "sub", "mul", "div"]);
    const okLvls = new Set(["easy", "medium", "hard"]);

    const op = okOps.has(selectedOp) ? selectedOp : "add";
    const lvl = okLvls.has(selectedLvl) ? selectedLvl : "easy";
    return { op, lvl };
  }

  const MODE = clampMode();

  // ---------- Timer Functions ----------
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    timerEl.textContent = formatTime(timerSeconds);
    
    // Add visual warning when time is running low
    if (timerSeconds <= 30) {
      timerEl.style.background = 'rgba(255, 87, 34, 0.2)';
      timerEl.style.borderColor = 'rgba(255, 87, 34, 0.5)';
      timerEl.style.color = '#ff5722';
      timerEl.style.animation = timerSeconds <= 10 ? 'pulse 1s infinite' : 'none';
    } else {
      timerEl.style.background = 'rgba(11,111,179,0.06)';
      timerEl.style.borderColor = 'rgba(11,111,179,0.35)';
      timerEl.style.color = '#0b6fb3';
      timerEl.style.animation = 'none';
    }
  }

  function startTimer() {
    if (timerId) clearInterval(timerId);
    timerRunning = true;
    timerSeconds = 120; // 2 minutes
    updateTimerDisplay();

    timerId = setInterval(() => {
      if (gameOver) {
        clearInterval(timerId);
        timerRunning = false;
        return;
      }
      
      timerSeconds--;
      updateTimerDisplay();

      // Time's up - determine winner by score
      if (timerSeconds <= 0) {
        clearInterval(timerId);
        timerRunning = false;
        
        if (!gameOver) {
          if (blueScore > redScore) {
            endGame("blue", "time_up");
          } else if (redScore > blueScore) {
            endGame("red", "time_up");
          } else {
            endGame("draw", "time_up_draw");
          }
        }
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      timerRunning = false;
    }
  }

  // ---------- Video Functions ----------
  function initVideo() {
    // Set up video event listeners for when they end
    tugVideo.addEventListener('ended', function() {
      // When win video ends, keep showing the final frame (don't loop)
      // This maintains the victory screen effect
      console.log("Win video ended");
    });
    
    // Try to play video (browsers may require user interaction)
    tugVideo.play().catch(e => {
      console.log("Video autoplay prevented, will play on first interaction");
      // Add one-time click handler to start video
      const startVideo = () => {
        tugVideo.play();
        document.removeEventListener('click', startVideo);
      };
      document.addEventListener('click', startVideo);
    });
  }

  function playWinVideo(winner) {
    // Pause current video
    tugVideo.pause();
    
    // Remove any existing victory classes
    videoContainer.classList.remove("blue-win", "red-win", "draw-result");
    
    // Change video source based on winner
    if (winner === "blue") {
      tugVideo.src = "blue-win.mp4";
      videoContainer.classList.add("blue-win");
    } else if (winner === "red") {
      tugVideo.src = "red-win.mp4";
      videoContainer.classList.add("red-win");
    } else if (winner === "draw") {
      tugVideo.src = "draw.mp4";
      videoContainer.classList.add("draw-result");
    }
    
    // Remove loop for win videos (they should play once and hold)
    tugVideo.loop = false;
    
    // Play the win video
    tugVideo.play().catch(e => console.log("Win video playback failed"));
  }

  function showDrawPopup() {
    drawPopup.classList.add("show");
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      drawPopup.classList.remove("show");
    }, 4000);
  }

  function updateVideoPosition() {
    if (gameOver) return; // Don't update position if game is over
    
    // Apply the transform based on videoPosition
    tugVideo.style.transform = `translateX(${videoPosition}px)`;
    
    // Set CSS variable for animations
    videoContainer.style.setProperty('--current-position', videoPosition + 'px');
    
    // Add visual feedback based on who's winning
    if (videoPosition < -20) {
      // Blue is winning
      videoOverlay.style.backgroundColor = 'rgba(11, 117, 255, 0.1)';
    } else if (videoPosition > 20) {
      // Red is winning
      videoOverlay.style.backgroundColor = 'rgba(229, 57, 53, 0.1)';
    } else {
      // Close to center
      videoOverlay.style.backgroundColor = 'transparent';
    }
  }

  function moveVideo(towardsTeam) {
    if (gameOver) return;
    
    // Move video: towardsBlue = negative direction, towardsRed = positive direction
    const step = 15; // Movement step in pixels
    
    if (towardsTeam === "blue") {
      videoPosition = Math.max(-MAX_POSITION, videoPosition - step);
    } else if (towardsTeam === "red") {
      videoPosition = Math.min(MAX_POSITION, videoPosition + step);
    }
    
    updateVideoPosition();
    
    // Check if game is over (video reached one side)
    if (videoPosition <= -MAX_POSITION) {
      endGame("blue", "rope_pull"); // Blue wins by pulling rope
    } else if (videoPosition >= MAX_POSITION) {
      endGame("red", "rope_pull"); // Red wins by pulling rope
    }
  }

  function checkWrongLimit(team) {
    if (team === "blue" && blueWrongCount >= 3) {
      // Blue loses (video moves all the way to Red side)
      videoPosition = MAX_POSITION;
      updateVideoPosition();
      endGame("red", "blue_wrong_limit");
      return true;
    } else if (team === "red" && redWrongCount >= 3) {
      // Red loses (video moves all the way to Blue side)
      videoPosition = -MAX_POSITION;
      updateVideoPosition();
      endGame("blue", "red_wrong_limit");
      return true;
    }
    return false;
  }

  function endGame(winningTeam, reason = "video_reached_end") {
    if (gameOver) return;
    
    gameOver = true;
    
    // Disable both keypads
    teamBlue.classList.add("is-disabled");
    teamRed.classList.add("is-disabled");
    
    // Stop timer
    stopTimer();
    
    // Play appropriate video and show enhanced victory messages
    if (winningTeam === "blue") {
      playWinVideo("blue");
      
      // Enhanced Blue victory screen styling
      turnPill.innerHTML = '<span class="victory-icon">👑</span> BLUE TEAM VICTORY! <span class="victory-icon">👑</span>';
      turnPill.style.background = 'linear-gradient(135deg, #0b75ff, #4a9eff)';
      turnPill.style.borderColor = '#ffffff';
      turnPill.style.color = '#ffffff';
      turnPill.style.fontSize = '20px';
      turnPill.style.padding = '12px 20px';
      turnPill.style.boxShadow = '0 0 30px rgba(11, 117, 255, 0.8)';
      turnPill.style.animation = 'victoryPulse 1.5s infinite';
      
      blueHint.innerHTML = '🏆 CHAMPIONS! 🏆';
      blueHint.style.color = '#0b75ff';
      blueHint.style.fontSize = '18px';
      blueHint.style.fontWeight = '900';
      blueHint.style.animation = 'glow 1.5s infinite';
      
      redHint.innerHTML = '💪 GOOD GAME! 💪';
      redHint.style.color = '#666';
      redHint.style.fontSize = '16px';
      
      // Add victory effect to video container
      videoContainer.style.boxShadow = '0 0 50px rgba(11, 117, 255, 0.6)';
      
    } else if (winningTeam === "red") {
      playWinVideo("red");
      
      // Enhanced Red victory screen styling
      turnPill.innerHTML = '<span class="victory-icon">👑</span> RED TEAM VICTORY! <span class="victory-icon">👑</span>';
      turnPill.style.background = 'linear-gradient(135deg, #e53935, #ff6b6b)';
      turnPill.style.borderColor = '#ffffff';
      turnPill.style.color = '#ffffff';
      turnPill.style.fontSize = '20px';
      turnPill.style.padding = '12px 20px';
      turnPill.style.boxShadow = '0 0 30px rgba(229, 57, 53, 0.8)';
      turnPill.style.animation = 'victoryPulse 1.5s infinite';
      
      redHint.innerHTML = '🏆 CHAMPIONS! 🏆';
      redHint.style.color = '#e53935';
      redHint.style.fontSize = '18px';
      redHint.style.fontWeight = '900';
      redHint.style.animation = 'glow 1.5s infinite';
      
      blueHint.innerHTML = '💪 GOOD GAME! 💪';
      blueHint.style.color = '#666';
      blueHint.style.fontSize = '16px';
      
      // Add victory effect to video container
      videoContainer.style.boxShadow = '0 0 50px rgba(229, 57, 53, 0.6)';
      
    } else if (winningTeam === "draw") {
      playWinVideo("draw");
      showDrawPopup();
      
      // Enhanced Draw styling
      turnPill.innerHTML = '🤝 IT\'S A DRAW! 🤝';
      turnPill.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
      turnPill.style.borderColor = '#ffffff';
      turnPill.style.color = '#ffffff';
      turnPill.style.fontSize = '20px';
      turnPill.style.padding = '12px 20px';
      turnPill.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.8)';
      
      blueHint.innerHTML = '⭐ WELL PLAYED! ⭐';
      redHint.innerHTML = '⭐ WELL PLAYED! ⭐';
      blueHint.style.color = '#667eea';
      redHint.style.color = '#764ba2';
      blueHint.style.fontSize = '17px';
      redHint.style.fontSize = '17px';
      blueHint.style.fontWeight = '800';
      redHint.style.fontWeight = '800';
      
      // Add victory effect to video container
      videoContainer.style.boxShadow = '0 0 50px rgba(102, 126, 234, 0.6)';
    }
  }

  function setTurn(team) {
    if (gameOver) return;
    
    currentTurn = team;

    if (team === "blue") {
      teamBlue.classList.remove("is-disabled");
      teamRed.classList.add("is-disabled");

      blueHint.textContent = "Your turn ✅";
      blueHint.style.color = "";
      blueHint.style.fontSize = "";
      blueHint.style.animation = "";
      
      redHint.textContent = "Wait… ⏳";
      redHint.style.color = "";
      redHint.style.fontSize = "";

      turnPill.textContent = "BLUE TURN";
      turnPill.style.background = "rgba(11,117,255,0.12)";
      turnPill.style.borderColor = "rgba(11,117,255,0.25)";
      turnPill.style.color = "#0b75ff";
      turnPill.style.fontSize = "";
      turnPill.style.padding = "";
      turnPill.style.boxShadow = "";
      turnPill.style.animation = "";

      blueDisplay.value = "";
    } else {
      teamRed.classList.remove("is-disabled");
      teamBlue.classList.add("is-disabled");

      redHint.textContent = "Your turn ✅";
      redHint.style.color = "";
      redHint.style.fontSize = "";
      redHint.style.animation = "";
      
      blueHint.textContent = "Wait… ⏳";
      blueHint.style.color = "";
      blueHint.style.fontSize = "";

      turnPill.textContent = "RED TURN";
      turnPill.style.background = "rgba(229,57,53,0.12)";
      turnPill.style.borderColor = "rgba(229,57,53,0.25)";
      turnPill.style.color = "#e53935";
      turnPill.style.fontSize = "";
      turnPill.style.padding = "";
      turnPill.style.boxShadow = "";
      turnPill.style.animation = "";

      redDisplay.value = "";
    }
  }

  function updateScores() {
    blueScoreEl.textContent = String(blueScore);
    redScoreEl.textContent  = String(redScore);
    miniBlueEl.textContent  = String(blueScore);
    miniRedEl.textContent   = String(redScore);
  }

  function makeQuestion() {
    const d = DIFF[MODE.lvl] || DIFF.easy;

    // ADD
    if (MODE.op === "add") {
      const a = pickRange(d.add);
      const b = pickRange(d.add);
      return { text: `${a} + ${b} = ?`, ans: a + b };
    }

    // SUB (non-negative)
    if (MODE.op === "sub") {
      let a = pickRange(d.sub);
      let b = pickRange(d.sub);
      if (b > a) [a, b] = [b, a];
      return { text: `${a} - ${b} = ?`, ans: a - b };
    }

    // MUL
    if (MODE.op === "mul") {
      const a = pickRange(d.mulA);
      const b = pickRange(d.mulB);
      return { text: `${a} × ${b} = ?`, ans: a * b };
    }

    // DIV (whole number)
    if (MODE.op === "div") {
      const b = pickRange(d.divB);
      const ans = pickRange(d.divAns);
      const a = b * ans;
      return { text: `${a} ÷ ${b} = ?`, ans };
    }

    // fallback
    const a = randInt(0, 10);
    const b = randInt(0, 10);
    return { text: `${a} + ${b} = ?`, ans: a + b };
  }

  function setQuestions() {
    if (gameOver) return;
    
    const q1 = makeQuestion();
    const q2 = makeQuestion();

    blueQuestionEl.textContent = q1.text;
    redQuestionEl.textContent  = q2.text;

    blueAnswer = q1.ans;
    redAnswer  = q2.ans;
  }

  // ---------- Dialer Logic ----------
  function getDisplay(team) {
    return team === "blue" ? blueDisplay : redDisplay;
  }

  function getHint(team) {
    return team === "blue" ? blueHint : redHint;
  }

  function appendDigit(team, digit) {
    if (gameOver) return;
    
    const display = getDisplay(team);

    // limit length
    if (display.value.length >= 5) return;

    // handle leading zeros
    if (display.value === "0") display.value = "";

    display.value += String(digit);
  }

  function clearDisplay(team) {
    if (gameOver) return;
    
    const display = getDisplay(team);
    display.value = "";
  }

  function submitAnswer(team) {
    if (gameOver) return;
    
    const display = getDisplay(team);
    const raw = display.value.trim();

    // No input
    if (raw === "") return;

    const userVal = Number(raw);
    if (Number.isNaN(userVal)) {
      getHint(team).textContent = "Invalid ❌";
      return;
    }

    const correct = team === "blue" ? blueAnswer : redAnswer;
    const hintEl = getHint(team);

    if (userVal === correct) {
      // CORRECT ANSWER
      if (team === "blue") {
        blueScore++;
        // Blue correct: video moves toward Blue side
        moveVideo("blue");
        hintEl.textContent = "Correct ✅ +1";
      } else {
        redScore++;
        // Red correct: video moves toward Red side
        moveVideo("red");
        hintEl.textContent = "Correct ✅ +1";
      }
    } else {
      // WRONG ANSWER
      if (team === "blue") {
        blueWrongCount++;
        // Blue wrong: video moves toward Red side (advantage to Red)
        moveVideo("red");
        hintEl.textContent = `Wrong ❌ (${blueWrongCount}/3 wrong)`;
      } else {
        redWrongCount++;
        // Red wrong: video moves toward Blue side (advantage to Blue)
        moveVideo("blue");
        hintEl.textContent = `Wrong ❌ (${redWrongCount}/3 wrong)`;
      }
      
      // Check if team reached wrong answer limit
      if (checkWrongLimit(team)) {
        return; // Game over, don't proceed
      }
      
      // Check for draw (both teams at 3 wrong answers)
      if (blueWrongCount >= 3 && redWrongCount >= 3) {
        endGame("draw");
        return;
      }
    }

    updateScores();

    // Only switch turns if game is not over
    if (!gameOver) {
      // Switch turn + new questions
      setTimeout(() => {
        setTurn(team === "blue" ? "red" : "blue");
        setQuestions();
      }, 500);
    }
  }

  function bindPad(padEl, team) {
    padEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      // lock other team's keypad or if game over
      if (team !== currentTurn || gameOver) return;

      const digit = btn.dataset.digit;
      const action = btn.dataset.action;

      if (digit != null) {
        appendDigit(team, digit);
        return;
      }

      if (action === "clear") {
        clearDisplay(team);
        return;
      }

      if (action === "submit") {
        submitAnswer(team);
        return;
      }
    });
  }

  // ---------- Restart ----------
  function resetGame() {
    // Reset scores
    blueScore = 0;
    redScore = 0;
    
    // Reset wrong counters
    blueWrongCount = 0;
    redWrongCount = 0;
    
    // Reset game over flag
    gameOver = false;
    
    // Reset video position
    videoPosition = 0;
    
    // Stop any running timer
    stopTimer();
    
    // Restore main video
    tugVideo.src = "main.mp4";
    tugVideo.loop = true;
    tugVideo.play().catch(e => console.log("Playback prevented"));
    
    // Remove win classes and effects
    videoContainer.classList.remove("blue-win", "red-win", "draw-result");
    videoContainer.style.boxShadow = '';
    videoContainer.style.animation = '';
    
    updateScores();
    updateVideoPosition();

    blueDisplay.value = "";
    redDisplay.value  = "";

    blueHint.textContent = "Your turn ✅";
    redHint.textContent  = "Wait… ⏳";
    blueHint.style = "";
    redHint.style = "";

    // Remove overlay color
    videoOverlay.style.backgroundColor = 'transparent';
    
    // Hide popup if visible
    drawPopup.classList.remove("show");

    // Reset timer display
    timerSeconds = 120;
    updateTimerDisplay();
    timerEl.style = "";

    setTurn("blue");
    setQuestions();
    startTimer(); // Start the 2-minute timer
  }

  // ---------- Event Listeners ----------
  bindPad(bluePad, "blue");
  bindPad(redPad, "red");

  restartBtn.addEventListener("click", resetGame);

  // Close draw popup
  closeDrawPopup.addEventListener("click", () => {
    drawPopup.classList.remove("show");
  });

  // Click outside to close popup
  drawPopup.addEventListener("click", (e) => {
    if (e.target === drawPopup) {
      drawPopup.classList.remove("show");
    }
  });

  // Initialize video
  initVideo();

  // Keyboard support for active team
  document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    
    const isDigit = /^[0-9]$/.test(e.key);
    if (isDigit) {
      appendDigit(currentTurn, e.key);
      return;
    }
    if (e.key === "Backspace") {
      // simple backspace: remove last char
      const display = getDisplay(currentTurn);
      display.value = display.value.slice(0, -1);
      return;
    }
    if (e.key === "Escape") {
      clearDisplay(currentTurn);
      return;
    }
    if (e.key === "Enter") {
      submitAnswer(currentTurn);
      return;
    }
  });

  // Start the game with 2-minute timer
  resetGame();
}