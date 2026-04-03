// Speed Vocabulary Race - Complete Game Logic

// ---------- Vocabulary Database (60+ words) ----------
const vocabularyDatabase = [
  // Set 1 - Emotions
  { word: "Happy", correct: "Glad", options: ["Sad", "Angry", "Glad", "Tired"] },
  { word: "Sad", correct: "Unhappy", options: ["Happy", "Unhappy", "Excited", "Calm"] },
  { word: "Angry", correct: "Mad", options: ["Happy", "Mad", "Calm", "Peaceful"] },
  { word: "Scared", correct: "Afraid", options: ["Brave", "Afraid", "Happy", "Calm"] },
  { word: "Excited", correct: "Thrilled", options: ["Bored", "Thrilled", "Tired", "Sad"] },
  
  // Set 2 - Speed & Movement
  { word: "Fast", correct: "Quick", options: ["Slow", "Quick", "Lazy", "Late"] },
  { word: "Slow", correct: "Sluggish", options: ["Fast", "Quick", "Sluggish", "Rapid"] },
  { word: "Quick", correct: "Rapid", options: ["Slow", "Rapid", "Late", "Lazy"] },
  { word: "Run", correct: "Sprint", options: ["Walk", "Sprint", "Stop", "Rest"] },
  { word: "Walk", correct: "Stroll", options: ["Run", "Stroll", "Jump", "Hop"] },
  
  // Set 3 - Size
  { word: "Big", correct: "Large", options: ["Small", "Tiny", "Large", "Little"] },
  { word: "Small", correct: "Tiny", options: ["Big", "Large", "Tiny", "Huge"] },
  { word: "Huge", correct: "Gigantic", options: ["Small", "Gigantic", "Tiny", "Little"] },
  { word: "Tall", correct: "High", options: ["Short", "Low", "High", "Small"] },
  { word: "Short", correct: "Low", options: ["Tall", "High", "Low", "Big"] },
  
  // Set 4 - Animals
  { word: "Dog", correct: "Canine", options: ["Cat", "Canine", "Bird", "Fish"] },
  { word: "Cat", correct: "Feline", options: ["Dog", "Feline", "Bird", "Mouse"] },
  { word: "Bird", correct: "Avian", options: ["Fish", "Avian", "Reptile", "Mammal"] },
  { word: "Fish", correct: "Aquatic", options: ["Bird", "Aquatic", "Mammal", "Insect"] },
  { word: "Lion", correct: "King", options: ["Tiger", "King", "Queen", "Bear"] },
  
  // Set 5 - Food
  { word: "Apple", correct: "Fruit", options: ["Vegetable", "Fruit", "Meat", "Grain"] },
  { word: "Carrot", correct: "Vegetable", options: ["Fruit", "Vegetable", "Meat", "Dairy"] },
  { word: "Pizza", correct: "Italian", options: ["Chinese", "Italian", "Mexican", "Indian"] },
  { word: "Bread", correct: "Loaf", options: ["Cake", "Loaf", "Cookie", "Pie"] },
  { word: "Milk", correct: "Dairy", options: ["Juice", "Dairy", "Soda", "Water"] },
  
  // Set 6 - School
  { word: "Book", correct: "Read", options: ["Write", "Read", "Draw", "Sing"] },
  { word: "Pen", correct: "Write", options: ["Read", "Write", "Draw", "Paint"] },
  { word: "Teacher", correct: "Educator", options: ["Student", "Educator", "Principal", "Coach"] },
  { word: "Student", correct: "Learner", options: ["Teacher", "Learner", "Principal", "Staff"] },
  { word: "Math", correct: "Numbers", options: ["Words", "Numbers", "Shapes", "Colors"] },
  
  // Set 7 - Weather
  { word: "Sun", correct: "Sunny", options: ["Rainy", "Sunny", "Cloudy", "Windy"] },
  { word: "Rain", correct: "Wet", options: ["Dry", "Wet", "Cold", "Hot"] },
  { word: "Cloud", correct: "Fluffy", options: ["Heavy", "Fluffy", "Dark", "Light"] },
  { word: "Wind", correct: "Breeze", options: ["Storm", "Breeze", "Gale", "Hurricane"] },
  { word: "Snow", correct: "Cold", options: ["Hot", "Cold", "Warm", "Cool"] },
  
  // Set 8 - Actions
  { word: "Jump", correct: "Leap", options: ["Walk", "Leap", "Sit", "Stand"] },
  { word: "Sit", correct: "Rest", options: ["Stand", "Rest", "Run", "Jump"] },
  { word: "Sleep", correct: "Rest", options: ["Play", "Rest", "Work", "Study"] },
  { word: "Eat", correct: "Consume", options: ["Drink", "Consume", "Cook", "Prepare"] },
  { word: "Drink", correct: "Sip", options: ["Eat", "Sip", "Gulp", "Swallow"] },
  
  // Set 9 - Colors
  { word: "Red", correct: "Scarlet", options: ["Blue", "Scarlet", "Green", "Yellow"] },
  { word: "Blue", correct: "Azure", options: ["Red", "Azure", "Green", "Purple"] },
  { word: "Green", correct: "Emerald", options: ["Red", "Blue", "Emerald", "Yellow"] },
  { word: "Yellow", correct: "Gold", options: ["Silver", "Gold", "Bronze", "Copper"] },
  { word: "Purple", correct: "Violet", options: ["Red", "Blue", "Violet", "Pink"] },
  
  // Set 10 - Opposites
  { word: "Hot", correct: "Cold", options: ["Warm", "Cold", "Cool", "Chilly"] },
  { word: "Day", correct: "Night", options: ["Morning", "Night", "Evening", "Afternoon"] },
  { word: "Light", correct: "Dark", options: ["Bright", "Dark", "Dim", "Shiny"] },
  { word: "Up", correct: "Down", options: ["Left", "Down", "Right", "Above"] },
  { word: "In", correct: "Out", options: ["Inside", "Out", "Within", "Beyond"] },
  
  // Set 11 - More words
  { word: "Good", correct: "Nice", options: ["Bad", "Nice", "Mean", "Rude"] },
  { word: "Bad", correct: "Mean", options: ["Good", "Mean", "Nice", "Kind"] },
  { word: "New", correct: "Fresh", options: ["Old", "Fresh", "Used", "Ancient"] },
  { word: "Old", correct: "Ancient", options: ["New", "Ancient", "Young", "Fresh"] },
  { word: "Young", correct: "Youthful", options: ["Old", "Youthful", "Aged", "Mature"] },
  
  // Set 12 - Fun words
  { word: "Fun", correct: "Enjoyable", options: ["Boring", "Enjoyable", "Dull", "Tiresome"] },
  { word: "Game", correct: "Play", options: ["Work", "Play", "Study", "Rest"] },
  { word: "Toy", correct: "Plaything", options: ["Tool", "Plaything", "Item", "Object"] },
  { word: "Friend", correct: "Buddy", options: ["Enemy", "Buddy", "Stranger", "Foe"] },
  { word: "Family", correct: "Relatives", options: ["Strangers", "Relatives", "Friends", "Neighbors"] }
];

// ---------- Game State ----------
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval = null;
let timeLeft = 10; // seconds
let gameActive = false;
let canAnswer = true;
let totalQuestions = 10;
let currentDifficulty = 'medium';

// DOM Elements
const elements = {
  scoreDisplay: document.getElementById('scoreDisplay'),
  timerDisplay: document.getElementById('timerDisplay'),
  questionCounter: document.getElementById('questionCounter'),
  progressBar: document.getElementById('progressBar'),
  currentWord: document.getElementById('currentWord'),
  wordCard: document.getElementById('wordCard'),
  rocketAnimation: document.getElementById('rocketAnimation'),
  optionsContainer: document.getElementById('optionsContainer'),
  messageBanner: document.getElementById('messageBanner'),
  resultModal: document.getElementById('resultModal'),
  finalScore: document.getElementById('finalScore'),
  finalPercentage: document.getElementById('finalPercentage'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  homeBtn: document.getElementById('homeBtn'),
  difficultySelect: document.getElementById('difficultyLevel'),
  confettiCanvas: document.getElementById('confettiCanvas')
};

// ---------- Helper Functions ----------
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getTimerByDifficulty() {
  switch(currentDifficulty) {
    case 'easy': return 12; // Easy: 12 seconds (was 4)
    case 'medium': return 10; // Medium: 10 seconds (was 3)
    case 'hard': return 8; // Hard: 8 seconds (was 2)
    default: return 10;
  }
}

function updateTimerDisplay() {
  elements.timerDisplay.textContent = timeLeft;
  if (timeLeft <= 1) {
    elements.timerDisplay.style.color = '#f43b47';
  } else {
    elements.timerDisplay.style.color = '#764ba2';
  }
}

function updateScore() {
  elements.scoreDisplay.textContent = score;
}

function updateProgress() {
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;
  elements.progressBar.style.width = `${progress}%`;
}

function showMessage(text, isError = false) {
  elements.messageBanner.textContent = text;
  elements.messageBanner.style.color = isError ? '#f43b47' : '#84fab0';
  elements.messageBanner.classList.add('show');
  
  setTimeout(() => {
    elements.messageBanner.classList.remove('show');
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimer() {
  stopTimer();
  timeLeft = getTimerByDifficulty();
  updateTimerDisplay();
  
  timerInterval = setInterval(() => {
    if (!gameActive || !canAnswer) return;
    
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      // Time's up for this question
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  if (!gameActive || !canAnswer) return;
  
  canAnswer = false;
  stopTimer();
  
  // Show time up message
  showMessage('⏰ Time Up!', true);
  
  // Disable all option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
  
  // Highlight correct answer
  const currentQ = currentQuestions[currentQuestionIndex];
  document.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.textContent === currentQ.correct) {
      btn.classList.add('correct');
    }
  });
  
  // Move to next question after delay
  setTimeout(() => {
    moveToNextQuestion();
  }, 1500);
}

function showRocketAnimation() {
  elements.rocketAnimation.classList.add('show');
  setTimeout(() => {
    elements.rocketAnimation.classList.remove('show');
  }, 1000);
}

function handleCorrectAnswer(selectedBtn) {
  // Update score
  score++;
  updateScore();
  
  // Visual feedback
  selectedBtn.classList.add('correct');
  showRocketAnimation();
  showMessage('✅ Correct! +1', false);
  
  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
  
  // Move to next question
  setTimeout(() => {
    moveToNextQuestion();
  }, 800);
}

function handleWrongAnswer(selectedBtn, correctAnswer) {
  // Visual feedback
  selectedBtn.classList.add('wrong');
  
  // Highlight correct answer
  document.querySelectorAll('.option-btn').forEach(btn => {
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    }
  });
  
  showMessage('❌ Try Again!', true);
  
  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
  
  // Move to next question
  setTimeout(() => {
    moveToNextQuestion();
  }, 1500);
}

function moveToNextQuestion() {
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= totalQuestions) {
    // Game complete
    endGame();
  } else {
    // Load next question
    loadQuestion();
  }
}

function loadQuestion() {
  // Reset state
  canAnswer = true;
  stopTimer();
  
  // Update question counter
  elements.questionCounter.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
  updateProgress();
  
  // Get current question
  const question = currentQuestions[currentQuestionIndex];
  
  // Update word with animation
  elements.wordCard.style.animation = 'none';
  elements.wordCard.offsetHeight; // Trigger reflow
  elements.wordCard.style.animation = 'wordPop 0.5s ease';
  
  elements.currentWord.textContent = question.word;
  
  // Shuffle options
  const shuffledOptions = shuffleArray([...question.options]);
  
  // Clear and create option buttons
  elements.optionsContainer.innerHTML = '';
  
  shuffledOptions.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => handleOptionClick(btn, option));
    elements.optionsContainer.appendChild(btn);
  });
  
  // Start timer
  startTimer();
}

function handleOptionClick(btn, selectedOption) {
  if (!gameActive || !canAnswer) return;
  
  const currentQ = currentQuestions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQ.correct;
  
  // Prevent double clicking
  canAnswer = false;
  stopTimer();
  
  if (isCorrect) {
    handleCorrectAnswer(btn);
  } else {
    handleWrongAnswer(btn, currentQ.correct);
  }
}

function endGame() {
  gameActive = false;
  stopTimer();
  
  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
  
  // Calculate percentage
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Update modal
  elements.finalScore.textContent = score;
  elements.finalPercentage.textContent = `${percentage}%`;
  
  // Show confetti for good scores
  if (percentage >= 70) {
    startConfetti();
  }
  
  // Show modal
  elements.resultModal.classList.add('show');
}

function startConfetti() {
  // Simple confetti effect using canvas
  const canvas = elements.confettiCanvas;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 5 - 2.5,
      vy: Math.random() * 5 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      size: Math.random() * 5 + 2
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let anyVisible = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.y < canvas.height) {
        anyVisible = true;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    });
    
    if (anyVisible) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  animate();
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 3000);
}

function resetGame() {
  // Reset state
  currentDifficulty = elements.difficultySelect.value;
  score = 0;
  currentQuestionIndex = 0;
  gameActive = true;
  canAnswer = true;
  
  // Shuffle and select random questions
  const shuffledDb = shuffleArray([...vocabularyDatabase]);
  currentQuestions = shuffledDb.slice(0, totalQuestions);
  
  // Update UI
  updateScore();
  elements.questionCounter.textContent = `1/${totalQuestions}`;
  elements.progressBar.style.width = '0%';
  
  // Hide modal
  elements.resultModal.classList.remove('show');
  
  // Load first question
  loadQuestion();
}

// ---------- Event Listeners ----------
elements.playAgainBtn.addEventListener('click', () => {
  resetGame();
});

elements.homeBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

elements.difficultySelect.addEventListener('change', (e) => {
  currentDifficulty = e.target.value;
  if (gameActive) {
    resetGame();
  }
});

// Handle window resize for confetti
window.addEventListener('resize', () => {
  const canvas = elements.confettiCanvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
  resetGame();
});