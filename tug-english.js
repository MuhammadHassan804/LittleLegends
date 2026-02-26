// tug-english.js - Multiple Choice Version
// Complete logic for Tug of War English Game with multiple choice options
// - Players click on A, B, C, D buttons to answer
// - English grammar questions with 4 options each
// - Video moves based on correct/wrong answers
// - Team loses after 3 wrong answers
// - 2-minute timer

// ---------- Elements ----------
const blueScoreEl = document.getElementById("blueScore");
const redScoreEl  = document.getElementById("redScore");
const miniBlueEl  = document.getElementById("miniBlue");
const miniRedEl   = document.getElementById("miniRed");

const blueQuestionEl = document.getElementById("blueQuestion");
const redQuestionEl  = document.getElementById("redQuestion");

const blueOptions = document.getElementById("blueOptions");
const redOptions = document.getElementById("redOptions");

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

// Check if all elements exist
const requiredEls = [
  blueScoreEl, redScoreEl, miniBlueEl, miniRedEl,
  blueQuestionEl, redQuestionEl, blueOptions, redOptions,
  teamBlue, teamRed, blueHint, redHint,
  turnPill, restartBtn, timerEl, videoContainer, tugVideo, 
  videoOverlay, drawPopup, closeDrawPopup
];

if (requiredEls.some(el => !el)) {
  console.warn("tug-english.js: Required elements not found");
} else {

  // ---------- English Question Database (Multiple Choice) ----------
  const questionDatabase = {
    tenses: [
      {
        text: "Which tense is used in: 'I am reading'?",
        options: ["Past Simple", "Future Simple", "Present Simple", "Present Continuous"],
        correct: "D",
        hint: "Action happening now"
      },
      {
        text: "Which tense is used in: 'She went to school'?",
        options: ["Present Simple", "Past Simple", "Future Simple", "Present Continuous"],
        correct: "B",
        hint: "Action completed in the past"
      },
      {
        text: "Which tense is used in: 'They will arrive tomorrow'?",
        options: ["Past Simple", "Present Continuous", "Future Simple", "Present Simple"],
        correct: "C",
        hint: "Action that hasn't happened yet"
      },
      {
        text: "Which tense is used in: 'He works in an office'?",
        options: ["Past Simple", "Present Continuous", "Future Simple", "Present Simple"],
        correct: "D",
        hint: "Habitual action"
      }
    ],
    
    verbForms: [
      {
        text: "Choose the correct form:",
        options: ["You like coffee?", "Like you coffee?", "You do like coffee?", "Do you like coffee?"],
        correct: "D",
        hint: "Question form with 'do'"
      },
      {
        text: "Choose the correct form:",
        options: ["He go to school", "He goes to school", "He going to school", "He to go school"],
        correct: "B",
        hint: "3rd person singular needs -s"
      },
      {
        text: "Choose the correct form:",
        options: ["She don't like tea", "She doesn't likes tea", "She doesn't like tea", "She not like tea"],
        correct: "C",
        hint: "Negative with doesn't + base form"
      },
      {
        text: "Choose the correct form:",
        options: ["They is playing", "They are playing", "They am playing", "They be playing"],
        correct: "B",
        hint: "Plural subject needs 'are'"
      }
    ],
    
    sentenceCorrection: [
      {
        text: "Correct this sentence: 'She go to school.'",
        options: ["She go to school", "She goes to school", "She going to school", "She to go school"],
        correct: "B",
        hint: "Add -s for 3rd person"
      },
      {
        text: "Correct this sentence: 'They is playing.'",
        options: ["They is playing", "They are playing", "They am playing", "They be playing"],
        correct: "B",
        hint: "Use 'are' with plural subjects"
      },
      {
        text: "Correct this sentence: 'I have went there.'",
        options: ["I have went", "I has went", "I have gone", "I has gone"],
        correct: "C",
        hint: "Past participle of 'go' is 'gone'"
      },
      {
        text: "Correct this sentence: 'He don't like coffee.'",
        options: ["He don't like", "He doesn't likes", "He doesn't like", "He not like"],
        correct: "C",
        hint: "3rd person negative = doesn't + base form"
      }
    ],
    
    presentSimple: [
      {
        text: "Complete: 'I ___ in an office.'",
        options: ["work", "works", "working", "am work"],
        correct: "A",
        hint: "I + base form"
      },
      {
        text: "Complete: 'She ___ in a hospital.'",
        options: ["work", "works", "working", "is work"],
        correct: "B",
        hint: "She + verb+s"
      }
    ],
    
    presentContinuous: [
      {
        text: "Complete: 'I ___ a book now.'",
        options: ["read", "reads", "am reading", "is reading"],
        correct: "C",
        hint: "I + am + verb-ing"
      },
      {
        text: "Complete: 'They ___ football at the moment.'",
        options: ["play", "plays", "are playing", "is playing"],
        correct: "C",
        hint: "They + are + verb-ing"
      }
    ],
    
    pastSimple: [
      {
        text: "Complete: 'I ___ to the cinema yesterday.'",
        options: ["go", "goes", "went", "gone"],
        correct: "C",
        hint: "Past of 'go' is 'went'"
      },
      {
        text: "Complete: 'She ___ a new car last week.'",
        options: ["buy", "buys", "bought", "buyed"],
        correct: "C",
        hint: "Past of 'buy' is 'bought'"
      }
    ],
    
    future: [
      {
        text: "Complete: 'I ___ you tomorrow.'",
        options: ["call", "calls", "will call", "am call"],
        correct: "C",
        hint: "Future with 'will'"
      },
      {
        text: "Complete: 'It ___ later.'",
        options: ["rain", "rains", "will rain", "is rain"],
        correct: "C",
        hint: "Future prediction with 'will'"
      }
    ]
  };

  // ---------- Game State ----------
  let blueScore = 0;
  let redScore  = 0;

  // Wrong answer counters
  let blueWrongCount = 0;
  let redWrongCount = 0;

  // Game over flag
  let gameOver = false;

  let currentTurn = "blue"; // "blue" | "red"
  
  // Current question data for each team
  let blueCurrentQuestion = null;
  let redCurrentQuestion = null;

  // Timer variables - 2 minutes (120 seconds)
  let timerSeconds = 120;
  let timerId = null;

  // Video position (-80 to 80, 0 is center)
  let videoPosition = 0;
  const MAX_POSITION = 80;

  // Track selected options
  let blueSelectedOption = null;
  let redSelectedOption = null;

  // ---------- URL Parameters ----------
  const params = new URLSearchParams(window.location.search);
  const selectedCat = params.get("cat") || "grammar";
  const selectedLvl = params.get("lvl") || "easy";

  // Available categories
  const categories = {
    grammar: ["tenses", "verbForms", "sentenceCorrection"],
    tenses: ["tenses"],
    verbs: ["verbForms"],
    correction: ["sentenceCorrection"],
    all: ["tenses", "verbForms", "sentenceCorrection", "presentSimple", "presentContinuous", "pastSimple", "future"]
  };

  function getQuestionPools() {
    const cat = selectedCat.toLowerCase();
    if (categories[cat]) return categories[cat];
    return ["tenses", "verbForms", "sentenceCorrection"];
  }

  const questionPools = getQuestionPools();

  // ---------- Timer Functions ----------
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    timerEl.textContent = formatTime(timerSeconds);
    
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
    timerSeconds = 120;
    updateTimerDisplay();

    timerId = setInterval(() => {
      if (gameOver) {
        clearInterval(timerId);
        return;
      }
      
      timerSeconds--;
      updateTimerDisplay();

      if (timerSeconds <= 0) {
        clearInterval(timerId);
        
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
    }
  }

  // ---------- Video Functions ----------
  function initVideo() {
    tugVideo.addEventListener('ended', function() {
      console.log("Win video ended");
    });
    
    tugVideo.play().catch(e => {
      console.log("Video autoplay prevented");
      const startVideo = () => {
        tugVideo.play();
        document.removeEventListener('click', startVideo);
      };
      document.addEventListener('click', startVideo);
    });
  }

  function playWinVideo(winner) {
    tugVideo.pause();
    videoContainer.classList.remove("blue-win", "red-win", "draw-result");
    
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
    
    tugVideo.loop = false;
    tugVideo.play().catch(e => console.log("Win video playback failed"));
  }

  function showDrawPopup() {
    drawPopup.classList.add("show");
    setTimeout(() => {
      drawPopup.classList.remove("show");
    }, 4000);
  }

  function updateVideoPosition() {
    if (gameOver) return;
    tugVideo.style.transform = `translateX(${videoPosition}px)`;
    videoContainer.style.setProperty('--current-position', videoPosition + 'px');
    
    if (videoPosition < -20) {
      videoOverlay.style.backgroundColor = 'rgba(11, 117, 255, 0.1)';
    } else if (videoPosition > 20) {
      videoOverlay.style.backgroundColor = 'rgba(229, 57, 53, 0.1)';
    } else {
      videoOverlay.style.backgroundColor = 'transparent';
    }
  }

  function moveVideo(towardsTeam) {
    if (gameOver) return;
    
    const step = 15;
    
    if (towardsTeam === "blue") {
      videoPosition = Math.max(-MAX_POSITION, videoPosition - step);
    } else if (towardsTeam === "red") {
      videoPosition = Math.min(MAX_POSITION, videoPosition + step);
    }
    
    updateVideoPosition();
    
    if (videoPosition <= -MAX_POSITION) {
      endGame("blue", "rope_pull");
    } else if (videoPosition >= MAX_POSITION) {
      endGame("red", "rope_pull");
    }
  }

  function checkWrongLimit(team) {
    if (team === "blue" && blueWrongCount >= 3) {
      videoPosition = MAX_POSITION;
      updateVideoPosition();
      endGame("red", "blue_wrong_limit");
      return true;
    } else if (team === "red" && redWrongCount >= 3) {
      videoPosition = -MAX_POSITION;
      updateVideoPosition();
      endGame("blue", "red_wrong_limit");
      return true;
    }
    return false;
  }

  function endGame(winningTeam) {
    if (gameOver) return;
    
    gameOver = true;
    
    teamBlue.classList.add("is-disabled");
    teamRed.classList.add("is-disabled");
    
    stopTimer();
    
    if (winningTeam === "blue") {
      playWinVideo("blue");
      turnPill.innerHTML = '<span class="victory-icon">👑</span> BLUE TEAM VICTORY! <span class="victory-icon">👑</span>';
      turnPill.style.background = 'linear-gradient(135deg, #0b75ff, #4a9eff)';
      turnPill.style.color = '#ffffff';
      turnPill.style.animation = 'victoryPulse 1.5s infinite';
      
      blueHint.innerHTML = '🏆 GRAMMAR CHAMPIONS! 🏆';
      blueHint.style.color = '#0b75ff';
      blueHint.style.animation = 'glow 1.5s infinite';
      
      redHint.innerHTML = '💪 GOOD GAME! 💪';
      videoContainer.style.boxShadow = '0 0 50px rgba(11, 117, 255, 0.6)';
      
    } else if (winningTeam === "red") {
      playWinVideo("red");
      turnPill.innerHTML = '<span class="victory-icon">👑</span> RED TEAM VICTORY! <span class="victory-icon">👑</span>';
      turnPill.style.background = 'linear-gradient(135deg, #e53935, #ff6b6b)';
      turnPill.style.color = '#ffffff';
      turnPill.style.animation = 'victoryPulse 1.5s infinite';
      
      redHint.innerHTML = '🏆 GRAMMAR CHAMPIONS! 🏆';
      redHint.style.color = '#e53935';
      redHint.style.animation = 'glow 1.5s infinite';
      
      blueHint.innerHTML = '💪 GOOD GAME! 💪';
      videoContainer.style.boxShadow = '0 0 50px rgba(229, 57, 53, 0.6)';
      
    } else if (winningTeam === "draw") {
      playWinVideo("draw");
      showDrawPopup();
      turnPill.innerHTML = '🤝 IT\'S A DRAW! 🤝';
      turnPill.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
      turnPill.style.color = '#ffffff';
      
      blueHint.innerHTML = '⭐ WELL PLAYED! ⭐';
      redHint.innerHTML = '⭐ WELL PLAYED! ⭐';
      blueHint.style.color = '#667eea';
      redHint.style.color = '#764ba2';
      videoContainer.style.boxShadow = '0 0 50px rgba(102, 126, 234, 0.6)';
    }
  }

  function setTurn(team) {
    if (gameOver) return;
    
    currentTurn = team;
    
    // Clear selected options
    blueSelectedOption = null;
    redSelectedOption = null;
    
    // Remove selected class from all option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.classList.remove('selected');
    });

    if (team === "blue") {
      teamBlue.classList.remove("is-disabled");
      teamRed.classList.add("is-disabled");

      blueHint.textContent = blueCurrentQuestion?.hint ? 
        `Your turn ✅ (${blueCurrentQuestion.hint})` : "Your turn ✅";
      redHint.textContent = "Wait… ⏳";

      turnPill.textContent = "BLUE TURN";
      turnPill.style.background = "rgba(11,117,255,0.12)";
      turnPill.style.borderColor = "rgba(11,117,255,0.25)";
      turnPill.style.color = "#0b75ff";
    } else {
      teamRed.classList.remove("is-disabled");
      teamBlue.classList.add("is-disabled");

      redHint.textContent = redCurrentQuestion?.hint ? 
        `Your turn ✅ (${redCurrentQuestion.hint})` : "Your turn ✅";
      blueHint.textContent = "Wait… ⏳";

      turnPill.textContent = "RED TURN";
      turnPill.style.background = "rgba(229,57,53,0.12)";
      turnPill.style.borderColor = "rgba(229,57,53,0.25)";
      turnPill.style.color = "#e53935";
    }
  }

  function updateScores() {
    blueScoreEl.textContent = String(blueScore);
    redScoreEl.textContent  = String(redScore);
    miniBlueEl.textContent  = String(blueScore);
    miniRedEl.textContent   = String(redScore);
  }

  function renderOptions(container, questionData, team) {
    if (!container || !questionData) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create option buttons
    const letters = ['A', 'B', 'C', 'D'];
    questionData.options.forEach((optionText, index) => {
      const letter = letters[index];
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('data-option', letter);
      btn.textContent = `${letter}: ${optionText}`;
      
      // Add click handler
      btn.addEventListener('click', () => {
        if (gameOver) return;
        if (team !== currentTurn) return;
        
        // Remove selected class from all buttons in this container
        container.querySelectorAll('.option-btn').forEach(b => {
          b.classList.remove('selected');
        });
        
        // Add selected class to this button
        btn.classList.add('selected');
        
        // Store selected option
        if (team === 'blue') {
          blueSelectedOption = letter;
        } else {
          redSelectedOption = letter;
        }
        
        // Auto-submit after selection (optional - remove if you want manual submit)
        setTimeout(() => {
          if ((team === 'blue' && blueSelectedOption) || (team === 'red' && redSelectedOption)) {
            submitAnswer(team);
          }
        }, 300);
      });
      
      container.appendChild(btn);
    });
  }

  function getRandomQuestion() {
    const poolName = questionPools[Math.floor(Math.random() * questionPools.length)];
    const pool = questionDatabase[poolName];
    
    if (!pool || pool.length === 0) {
      // Fallback question
      return {
        text: "Which tense is used in: 'I am reading'?",
        options: ["Past Simple", "Future Simple", "Present Simple", "Present Continuous"],
        correct: "D",
        hint: "Action happening now"
      };
    }
    
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function setQuestions() {
    if (gameOver) return;
    
    const q1 = getRandomQuestion();
    const q2 = getRandomQuestion();

    blueQuestionEl.textContent = q1.text;
    redQuestionEl.textContent = q2.text;

    blueCurrentQuestion = q1;
    redCurrentQuestion = q2;
    
    // Render options
    renderOptions(blueOptions, q1, 'blue');
    renderOptions(redOptions, q2, 'red');
    
    // Update hint for current turn
    if (currentTurn === "blue") {
      blueHint.textContent = `Your turn ✅ (${q1.hint})`;
    } else {
      redHint.textContent = `Your turn ✅ (${q2.hint})`;
    }
  }

  function submitAnswer(team) {
    if (gameOver) return;
    
    const selectedOption = team === 'blue' ? blueSelectedOption : redSelectedOption;
    const questionData = team === 'blue' ? blueCurrentQuestion : redCurrentQuestion;
    const hintEl = team === 'blue' ? blueHint : redHint;

    if (!selectedOption) {
      hintEl.textContent = "Please select an answer ❌";
      return;
    }

    const isCorrect = selectedOption === questionData.correct;

    if (isCorrect) {
      // CORRECT ANSWER
      if (team === "blue") {
        blueScore++;
        moveVideo("blue");
        hintEl.textContent = "Correct ✅ +1";
      } else {
        redScore++;
        moveVideo("red");
        hintEl.textContent = "Correct ✅ +1";
      }
    } else {
      // WRONG ANSWER
      const correctLetter = questionData.correct;
      const correctText = questionData.options[correctLetter.charCodeAt(0) - 65];
      
      if (team === "blue") {
        blueWrongCount++;
        moveVideo("red");
        hintEl.textContent = `Wrong ❌ Correct was ${correctLetter}: "${correctText}" (${blueWrongCount}/3 wrong)`;
      } else {
        redWrongCount++;
        moveVideo("blue");
        hintEl.textContent = `Wrong ❌ Correct was ${correctLetter}: "${correctText}" (${redWrongCount}/3 wrong)`;
      }
      
      if (checkWrongLimit(team)) {
        return;
      }
      
      if (blueWrongCount >= 3 && redWrongCount >= 3) {
        endGame("draw");
        return;
      }
    }

    updateScores();

    if (!gameOver) {
      setTimeout(() => {
        setTurn(team === "blue" ? "red" : "blue");
        setQuestions();
      }, 800);
    }
  }

  // ---------- Restart ----------
  function resetGame() {
    blueScore = 0;
    redScore = 0;
    blueWrongCount = 0;
    redWrongCount = 0;
    gameOver = false;
    videoPosition = 0;
    blueSelectedOption = null;
    redSelectedOption = null;
    
    stopTimer();
    
    tugVideo.src = "main.mp4";
    tugVideo.loop = true;
    tugVideo.play().catch(e => console.log("Playback prevented"));
    
    videoContainer.classList.remove("blue-win", "red-win", "draw-result");
    videoContainer.style.boxShadow = '';
    videoContainer.style.animation = '';
    
    updateScores();
    updateVideoPosition();

    blueHint.textContent = "Your turn ✅";
    redHint.textContent = "Wait… ⏳";
    blueHint.style = "";
    redHint.style = "";

    videoOverlay.style.backgroundColor = 'transparent';
    drawPopup.classList.remove("show");

    timerSeconds = 120;
    updateTimerDisplay();
    timerEl.style = "";

    setTurn("blue");
    setQuestions();
    startTimer();
  }

  // ---------- Event Listeners ----------
  restartBtn.addEventListener("click", resetGame);

  closeDrawPopup.addEventListener("click", () => {
    drawPopup.classList.remove("show");
  });

  drawPopup.addEventListener("click", (e) => {
    if (e.target === drawPopup) {
      drawPopup.classList.remove("show");
    }
  });

  // Keyboard support (1,2,3,4 for A,B,C,D)
  document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    
    const key = e.key;
    if (['1', '2', '3', '4'].includes(key)) {
      const optionLetter = String.fromCharCode(64 + parseInt(key)); // 1->A, 2->B, etc.
      const container = currentTurn === 'blue' ? blueOptions : redOptions;
      const buttons = container.querySelectorAll('.option-btn');
      
      buttons.forEach(btn => {
        if (btn.getAttribute('data-option') === optionLetter) {
          btn.click();
        }
      });
      e.preventDefault();
    }
    
    if (key === "Enter") {
      submitAnswer(currentTurn);
      e.preventDefault();
    }
  });

  // Initialize
  initVideo();
  resetGame();
}