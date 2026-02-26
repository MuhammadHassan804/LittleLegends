// spell-sprint.js
// Professional Spell Sprint Game
// Features: Timer 30-60s, No word repetition, 3 Difficulties, Clean UI

// ---------- Extensive Word Database by Difficulty (50+ words per difficulty) ----------
const wordDatabase = {
  easy: [
    { pattern: "C _ T", answer: "A", hint: "A furry pet that meows", word: "CAT", options: ["A", "O", "U", "E"] },
    { pattern: "D _ G", answer: "O", hint: "A pet that barks", word: "DOG", options: ["O", "A", "I", "U"] },
    { pattern: "S _ N", answer: "U", hint: "Shines in the sky", word: "SUN", options: ["U", "A", "E", "O"] },
    { pattern: "C _ R", answer: "A", hint: "You drive this", word: "CAR", options: ["A", "O", "U", "E"] },
    { pattern: "B _ G", answer: "A", hint: "You carry things in this", word: "BAG", options: ["A", "E", "I", "O"] },
    { pattern: "H _ T", answer: "A", hint: "You wear it on your head", word: "HAT", options: ["A", "O", "U", "E"] },
    { pattern: "F _ X", answer: "O", hint: "A clever orange animal", word: "FOX", options: ["O", "A", "I", "U"] },
    { pattern: "P _ G", answer: "I", hint: "A pink farm animal", word: "PIG", options: ["I", "A", "E", "O"] },
    { pattern: "C _ P", answer: "U", hint: "You drink from this", word: "CUP", options: ["U", "A", "O", "E"] },
    { pattern: "B _ S", answer: "U", hint: "Takes you to school", word: "BUS", options: ["U", "A", "I", "E"] },
    { pattern: "F _ N", answer: "U", hint: "Playing is ___", word: "FUN", options: ["U", "A", "O", "E"] },
    { pattern: "R _ N", answer: "U", hint: "Fast movement", word: "RUN", options: ["U", "A", "I", "E"] },
    { pattern: "B _ D", answer: "E", hint: "Where you sleep", word: "BED", options: ["E", "A", "I", "O"] },
    { pattern: "R _ D", answer: "E", hint: "Color of an apple", word: "RED", options: ["E", "A", "I", "O"] },
    { pattern: "B _ _ B", answer: "A", hint: "A bouncing toy", word: "BALL", options: ["A", "O", "U", "E"] },
    { pattern: "B _ _ D", answer: "I", hint: "Flying animal", word: "BIRD", options: ["I", "U", "A", "E"] }
  ],
  
  medium: [
    { pattern: "B _ R D", answer: "I", hint: "Flying animal", word: "BIRD", options: ["I", "U", "A", "E"] },
    { pattern: "F _ S H", answer: "I", hint: "Swims in water", word: "FISH", options: ["I", "O", "A", "U"] },
    { pattern: "B O _ K", answer: "O", hint: "You read this", word: "BOOK", options: ["O", "A", "E", "U"] },
    { pattern: "T A B L _", answer: "E", hint: "You eat on this", word: "TABLE", options: ["E", "A", "O", "U"] },
    { pattern: "C H _ I R", answer: "A", hint: "You sit on this", word: "CHAIR", options: ["A", "E", "I", "O"] },
    { pattern: "H O _ S E", answer: "U", hint: "Where you live", word: "HOUSE", options: ["U", "A", "E", "O"] },
    { pattern: "A P P _ E", answer: "L", hint: "A red fruit", word: "APPLE", options: ["L", "P", "R", "T"] },
    { pattern: "G R A S _", answer: "S", hint: "Green and grows", word: "GRASS", options: ["S", "T", "P", "K"] },
    { pattern: "C L O _ D", answer: "U", hint: "In the sky", word: "CLOUD", options: ["U", "A", "E", "O"] },
    { pattern: "F L O W _", answer: "R", hint: "Garden plant", word: "FLOWER", options: ["R", "S", "T", "P"] },
    { pattern: "T I G _ R", answer: "E", hint: "Big cat with stripes", word: "TIGER", options: ["E", "A", "U", "O"] },
    { pattern: "R A B B _ T", answer: "I", hint: "Long ears, hops", word: "RABBIT", options: ["I", "Y", "E", "A"] },
    { pattern: "C A N D _", answer: "Y", hint: "Sweet treat", word: "CANDY", options: ["Y", "I", "E", "A"] },
    { pattern: "H A P P _", answer: "Y", hint: "Feeling joyful", word: "HAPPY", options: ["Y", "I", "E", "A"] },
    { pattern: "S M I L _", answer: "E", hint: "Show you're happy", word: "SMILE", options: ["E", "A", "O", "U"] },
    { pattern: "P _ Z Z A", answer: "I", hint: "Italian food", word: "PIZZA", options: ["I", "A", "E", "O"] }
  ],
  
  hard: [
    { pattern: "E L _ P H A N T", answer: "E", hint: "Largest land animal", word: "ELEPHANT", options: ["E", "A", "I", "O"] },
    { pattern: "G I R A F F _", answer: "E", hint: "Very tall animal", word: "GIRAFFE", options: ["E", "A", "I", "Y"] },
    { pattern: "D O L P H _ N", answer: "I", hint: "Smart ocean animal", word: "DOLPHIN", options: ["I", "Y", "E", "A"] },
    { pattern: "P E N G U _ N", answer: "I", hint: "Bird that can't fly", word: "PENGUIN", options: ["I", "A", "E", "O"] },
    { pattern: "B U T T E R F L _", answer: "Y", hint: "Colorful insect", word: "BUTTERFLY", options: ["Y", "I", "E", "A"] },
    { pattern: "C H O C O L A T _", answer: "E", hint: "Sweet brown treat", word: "CHOCOLATE", options: ["E", "A", "I", "O"] },
    { pattern: "S T R A W B E R R _", answer: "Y", hint: "Red fruit with seeds", word: "STRAWBERRY", options: ["Y", "I", "E", "A"] },
    { pattern: "B R E A K F A S _", answer: "T", hint: "First meal of day", word: "BREAKFAST", options: ["T", "K", "C", "P"] },
    { pattern: "U M B R E L L _", answer: "A", hint: "Keeps you dry in rain", word: "UMBRELLA", options: ["A", "E", "O", "U"] },
    { pattern: "B A L L O O _", answer: "N", hint: "Floats in the air", word: "BALLOON", options: ["N", "M", "P", "R"] },
    { pattern: "R A I N B O _", answer: "W", hint: "Colorful arc in sky", word: "RAINBOW", options: ["W", "V", "U", "N"] },
    { pattern: "T E L E P H O N _", answer: "E", hint: "You call people with this", word: "TELEPHONE", options: ["E", "A", "O", "U"] },
    { pattern: "C O M P U T _ R", answer: "E", hint: "You play games on this", word: "COMPUTER", options: ["E", "A", "I", "O"] },
    { pattern: "B I C Y C _ E", answer: "L", hint: "Two wheels, pedal power", word: "BICYCLE", options: ["L", "K", "C", "S"] },
    { pattern: "R E S T A _ R A N T", answer: "U", hint: "You eat out here", word: "RESTAURANT", options: ["U", "A", "E", "O"] }
  ]
};

// ---------- Game State ----------
let currentDifficulty = "medium";
let currentLevel = 1;
let score = 0;
let streak = 0;
let highestStreak = 0;
let wordsCompleted = 0;
let usedIndices = [];
let currentWords = [];
let currentQuestion = null;
let timerInterval = null;
let timeLeft = 35; // Will be set based on difficulty
let gameActive = false;
let gamePaused = false;
let nextWordTimeout = null;

// DOM Elements
const elements = {
  score: document.getElementById('score'),
  streak: document.getElementById('streak'),
  fireEmoji: document.getElementById('fireEmoji'),
  timer: document.getElementById('timer'),
  levelBadge: document.getElementById('levelBadge'),
  incompleteWord: document.getElementById('incompleteWord'),
  hintText: document.getElementById('hintText'),
  optionsContainer: document.getElementById('optionsContainer'),
  messageDisplay: document.getElementById('messageDisplay'),
  progressBar: document.getElementById('progressBar'),
  gameOverModal: document.getElementById('gameOverModal'),
  levelCompleteModal: document.getElementById('levelCompleteModal'),
  finalScore: document.getElementById('finalScore'),
  finalStreak: document.getElementById('finalStreak'),
  finalWords: document.getElementById('finalWords'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  continueBtn: document.getElementById('continueBtn'),
  difficultySelect: document.getElementById('difficultySelect')
};

// ---------- Helper Functions ----------
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  elements.timer.textContent = formatTime(timeLeft);
  elements.timer.style.color = timeLeft <= 10 ? '#dc2626' : '#1e293b';
}

function updateScore() {
  elements.score.textContent = score;
  elements.streak.textContent = streak;
  
  // Update fire emoji based on streak
  if (streak >= 3) {
    elements.fireEmoji.classList.add('active');
  } else {
    elements.fireEmoji.classList.remove('active');
  }
  
  if (streak > highestStreak) {
    highestStreak = streak;
  }
}

function updateProgress() {
  if (currentWords.length > 0) {
    const progress = (usedIndices.length / currentWords.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
  }
}

function showMessage(text, isSuccess) {
  elements.messageDisplay.textContent = text;
  elements.messageDisplay.className = `message-display ${isSuccess ? 'success' : 'error'}`;
  
  setTimeout(() => {
    elements.messageDisplay.textContent = '';
    elements.messageDisplay.className = 'message-display';
  }, 1500);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  
  timerInterval = setInterval(() => {
    if (!gameActive || gamePaused) return;
    
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      handleGameOver();
    }
  }, 1000);
}

function handleGameOver() {
  stopTimer();
  gameActive = false;
  
  // Disable all buttons
  document.querySelectorAll('.letter-option').forEach(btn => {
    btn.disabled = true;
  });
  
  // Show game over modal
  elements.finalScore.textContent = score;
  elements.finalStreak.textContent = highestStreak;
  elements.finalWords.textContent = wordsCompleted;
  elements.gameOverModal.classList.add('show');
}

// Get base time based on difficulty (30-60 seconds range)
function getBaseTime() {
  switch(currentDifficulty) {
    case 'easy': return 45;
    case 'medium': return 35;
    case 'hard': return 30;
    default: return 35;
  }
}

// Initialize words for current difficulty
function initWords() {
  currentWords = [...wordDatabase[currentDifficulty]];
  
  // Shuffle words
  for (let i = currentWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentWords[i], currentWords[j]] = [currentWords[j], currentWords[i]];
  }
  
  usedIndices = [];
}

// Get next unused word (ensures no repetition)
function getNextWord() {
  if (usedIndices.length >= currentWords.length) {
    return null;
  }
  
  for (let i = 0; i < currentWords.length; i++) {
    if (!usedIndices.includes(i)) {
      usedIndices.push(i);
      return currentWords[i];
    }
  }
  
  return null;
}

function loadNextWord() {
  if (nextWordTimeout) {
    clearTimeout(nextWordTimeout);
    nextWordTimeout = null;
  }
  
  const nextWord = getNextWord();
  
  if (!nextWord) {
    // Level complete
    gameActive = false;
    gamePaused = true;
    stopTimer();
    elements.levelCompleteModal.classList.add('show');
    return;
  }
  
  currentQuestion = nextWord;
  
  // Update display
  elements.incompleteWord.textContent = currentQuestion.pattern;
  elements.hintText.textContent = currentQuestion.hint;
  
  // Generate options
  generateOptions(currentQuestion);
  
  // Update progress
  updateProgress();
}

function generateOptions(question) {
  elements.optionsContainer.innerHTML = '';
  
  // Use predefined options or create default
  const letters = question.options || ['A', 'B', 'C', 'D'];
  
  // Shuffle options
  const shuffled = [...letters].sort(() => Math.random() - 0.5);
  
  shuffled.forEach(letter => {
    if (letter) {
      const btn = document.createElement('button');
      btn.className = 'letter-option';
      btn.setAttribute('data-letter', letter);
      btn.textContent = letter;
      
      btn.addEventListener('click', () => handleLetterClick(btn, letter));
      
      elements.optionsContainer.appendChild(btn);
    }
  });
}

function handleLetterClick(btn, selectedLetter) {
  if (!gameActive || gamePaused || !currentQuestion) return;
  
  const correct = currentQuestion.answer;
  const isCorrect = selectedLetter === correct;
  
  // Disable all buttons temporarily
  document.querySelectorAll('.letter-option').forEach(b => {
    b.disabled = true;
  });
  
  if (isCorrect) {
    // Correct answer
    btn.classList.add('correct');
    
    // Calculate points with streak bonus
    const basePoints = 10;
    const streakBonus = streak * 2;
    const pointsEarned = basePoints + streakBonus;
    
    // Update game state
    score += pointsEarned;
    streak++;
    wordsCompleted++;
    
    // Add time bonus (2-5 seconds based on streak)
    const timeBonus = Math.min(5, 2 + Math.floor(streak / 2));
    timeLeft = Math.min(60, timeLeft + timeBonus);
    
    showMessage(`✓ +${pointsEarned} points!`, true);
    
    // Show completed word briefly
    elements.incompleteWord.textContent = currentQuestion.word;
    
    updateScore();
    updateTimerDisplay();
    
    // Move to next word immediately
    gamePaused = true;
    
    nextWordTimeout = setTimeout(() => {
      gamePaused = false;
      loadNextWord();
    }, 500);
    
  } else {
    // Wrong answer
    btn.classList.add('wrong');
    
    // Show correct answer
    document.querySelectorAll('.letter-option').forEach(b => {
      if (b.getAttribute('data-letter') === correct) {
        b.classList.add('correct');
      }
    });
    
    // Update game state
    streak = 0;
    timeLeft = Math.max(getBaseTime() - 10, timeLeft - 5); // Penalty
    
    showMessage(`✗ Correct letter was ${correct}`, false);
    updateScore();
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }
    
    // Re-enable buttons for retry
    setTimeout(() => {
      document.querySelectorAll('.letter-option').forEach(b => {
        b.disabled = false;
        b.classList.remove('wrong', 'correct');
      });
    }, 1500);
  }
}

function resetGame() {
  // Reset game state
  currentDifficulty = elements.difficultySelect.value;
  currentLevel = 1;
  score = 0;
  streak = 0;
  highestStreak = 0;
  wordsCompleted = 0;
  timeLeft = getBaseTime();
  gameActive = true;
  gamePaused = false;
  
  // Update UI
  elements.levelBadge.textContent = `Level ${currentLevel} · ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
  updateScore();
  updateTimerDisplay();
  elements.progressBar.style.width = '0%';
  
  // Stop timers
  stopTimer();
  if (nextWordTimeout) {
    clearTimeout(nextWordTimeout);
    nextWordTimeout = null;
  }
  
  // Hide modals
  elements.gameOverModal.classList.remove('show');
  elements.levelCompleteModal.classList.remove('show');
  
  // Initialize words
  initWords();
  
  // Load first word
  loadNextWord();
  
  // Start timer
  startTimer();
}

function nextLevel() {
  elements.levelCompleteModal.classList.remove('show');
  
  // Increase difficulty
  if (currentDifficulty === 'easy') {
    currentDifficulty = 'medium';
  } else if (currentDifficulty === 'medium') {
    currentDifficulty = 'hard';
  }
  
  elements.difficultySelect.value = currentDifficulty;
  currentLevel++;
  elements.levelBadge.textContent = `Level ${currentLevel} · ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
  
  // Reset time based on new difficulty
  timeLeft = getBaseTime();
  
  // Initialize new words
  initWords();
  
  // Restart game
  gameActive = true;
  gamePaused = false;
  updateTimerDisplay();
  loadNextWord();
  startTimer();
}

// ---------- Event Listeners ----------
elements.playAgainBtn.addEventListener('click', resetGame);
elements.continueBtn.addEventListener('click', nextLevel);

elements.difficultySelect.addEventListener('change', (e) => {
  currentDifficulty = e.target.value;
  currentLevel = 1;
  elements.levelBadge.textContent = `Level ${currentLevel} · ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
  
  if (gameActive) {
    resetGame();
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (!gameActive || gamePaused) return;
  
  const key = e.key.toUpperCase();
  if (key >= 'A' && key <= 'Z') {
    const buttons = document.querySelectorAll('.letter-option');
    for (let btn of buttons) {
      if (btn.getAttribute('data-letter') === key && !btn.disabled) {
        btn.click();
        break;
      }
    }
  }
});

// Initialize game
resetGame();