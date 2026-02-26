// Wait for page to load
window.onload = function() {
  console.log("Game initializing...");
  
  // DOM Elements
  const questionsList = document.getElementById('questionsList');
  const answersList = document.getElementById('answersList');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const matchedCountEl = document.getElementById('matchedCount');
  const totalCountEl = document.getElementById('totalCount');
  const hintText = document.getElementById('hintText');
  const restartBtn = document.getElementById('restartBtn');
  
  // Win Popup Elements
  const winPopup = document.getElementById('winPopup');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const homeBtn = document.getElementById('homeBtn');
  const finalScoreEl = document.getElementById('finalScore');
  
  // Time End Popup Elements
  const timeEndPopup = document.getElementById('timeEndPopup');
  const timeEndPlayAgainBtn = document.getElementById('timeEndPlayAgainBtn');
  const timeEndHomeBtn = document.getElementById('timeEndHomeBtn');
  const timeEndScoreEl = document.getElementById('timeEndScore');

  // Game State
  const TOTAL_QUESTIONS = 5;
  let questions = [];
  let answers = [];
  let score = 0;
  let timeLeft = 30; // Changed from 60 to 30
  let timerInterval = null;
  let gameActive = true;
  let matchedPairs = new Array(TOTAL_QUESTIONS).fill(false);
  let selectedQuestionIndex = null;

  // Generate a single question
  function generateQuestion() {
    const operations = [
      { symbol: '+', func: (a, b) => a + b },
      { symbol: '-', func: (a, b) => Math.max(a, b) - Math.min(a, b) },
      { symbol: '×', func: (a, b) => a * b }
    ];
    
    const op = operations[Math.floor(Math.random() * operations.length)];
    let num1 = Math.floor(Math.random() * 12) + 2;
    let num2 = Math.floor(Math.random() * 12) + 2;
    
    if (op.symbol === '-') {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      num1 = larger;
      num2 = smaller;
    }
    
    const equation = `${num1} ${op.symbol} ${num2}`;
    const correctAnswer = op.func(num1, num2);
    
    return {
      equation,
      correctAnswer
    };
  }

  // Generate all questions (ensuring uniqueness)
  function generateAllQuestions() {
    const questions = [];
    const usedEquations = new Set();
    const usedAnswers = new Set();
    
    while (questions.length < TOTAL_QUESTIONS) {
      const question = generateQuestion();
      if (!usedEquations.has(question.equation) && !usedAnswers.has(question.correctAnswer)) {
        usedEquations.add(question.equation);
        usedAnswers.add(question.correctAnswer);
        questions.push(question);
      }
    }
    
    return questions;
  }

  // Shuffle answers
  function shuffleAnswers(questions) {
    const answers = questions.map(q => q.correctAnswer);
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }

  // Render questions and answers
  function renderGame() {
    // Clear containers
    questionsList.innerHTML = '';
    answersList.innerHTML = '';
    
    // Render questions
    questions.forEach((q, index) => {
      const questionCard = document.createElement('div');
      questionCard.className = `question-card ${matchedPairs[index] ? 'matched' : ''}`;
      if (selectedQuestionIndex === index && !matchedPairs[index]) {
        questionCard.classList.add('selected');
      }
      questionCard.textContent = q.equation;
      questionCard.dataset.index = index;
      questionCard.dataset.answer = q.correctAnswer;
      
      if (!matchedPairs[index] && gameActive) {
        questionCard.addEventListener('click', () => selectQuestion(index));
      }
      
      questionsList.appendChild(questionCard);
    });
    
    // Render answers
    answers.forEach((answer, index) => {
      const answerCard = document.createElement('div');
      answerCard.className = 'answer-card';
      answerCard.textContent = answer;
      answerCard.dataset.value = answer;
      answerCard.dataset.index = index;
      
      // Check if this answer is already matched
      const matchedQuestionIndex = questions.findIndex(q => q.correctAnswer === answer);
      if (matchedPairs[matchedQuestionIndex]) {
        answerCard.classList.add('matched');
      } else if (gameActive) {
        answerCard.addEventListener('click', () => selectAnswer(answer, answerCard));
      }
      
      answersList.appendChild(answerCard);
    });
    
    // Update matched count
    const matchedCount = matchedPairs.filter(Boolean).length;
    matchedCountEl.textContent = matchedCount;
    
    // Update hint
    if (!gameActive) {
      hintText.textContent = 'Game ended - Click New Game to play again';
    } else if (selectedQuestionIndex !== null && !matchedPairs[selectedQuestionIndex]) {
      hintText.textContent = `Selected: ${questions[selectedQuestionIndex].equation} - Now select its answer`;
    } else {
      hintText.textContent = 'Select a question, then select its answer';
    }
  }

  // Select a question
  function selectQuestion(index) {
    if (!gameActive) return;
    if (matchedPairs[index]) {
      hintText.textContent = 'This question is already matched';
      return;
    }
    
    selectedQuestionIndex = index;
    renderGame();
  }

  // Select an answer
  function selectAnswer(answer, answerCard) {
    if (!gameActive) return;
    if (selectedQuestionIndex === null) {
      hintText.textContent = 'First select a question';
      answerCard.classList.add('wrong-selection');
      setTimeout(() => {
        answerCard.classList.remove('wrong-selection');
      }, 300);
      return;
    }
    
    const selectedQuestion = questions[selectedQuestionIndex];
    
    if (matchedPairs[selectedQuestionIndex]) {
      hintText.textContent = 'This question is already matched';
      selectedQuestionIndex = null;
      renderGame();
      return;
    }
    
    if (answer === selectedQuestion.correctAnswer) {
      // Correct match
      matchedPairs[selectedQuestionIndex] = true;
      score++;
      scoreEl.textContent = score;
      
      // Update matched count
      const matchedCount = matchedPairs.filter(Boolean).length;
      matchedCountEl.textContent = matchedCount;
      
      hintText.textContent = '✓ Correct match!';
      
      selectedQuestionIndex = null;
      renderGame();
      
      // Check if all matched
      if (matchedCount === TOTAL_QUESTIONS) {
        showWinPopup();
      }
    } else {
      // Wrong match
      hintText.textContent = '✗ Wrong match - try again';
      answerCard.classList.add('wrong-selection');
      setTimeout(() => {
        answerCard.classList.remove('wrong-selection');
      }, 300);
    }
  }

  // Timer function
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = 30; // Changed from 60 to 30
    timeEl.textContent = timeLeft;
    timeEl.style.color = '';
    
    timerInterval = setInterval(() => {
      if (!gameActive) return;
      
      timeLeft--;
      timeEl.textContent = timeLeft;
      
      if (timeLeft <= 10) {
        timeEl.style.color = '#f56565';
      }
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameActive = false;
        showTimeEndPopup();
      }
    }, 1000);
  }

  // Show win popup
  function showWinPopup() {
    clearInterval(timerInterval);
    gameActive = false;
    finalScoreEl.textContent = score;
    winPopup.style.display = 'flex';
  }

  // Show time end popup
  function showTimeEndPopup() {
    gameActive = false;
    timeEndScoreEl.textContent = score;
    timeEndPopup.style.display = 'flex';
    hintText.textContent = 'Time expired - Click New Game to play again';
    renderGame(); // Re-render to disable all clicks
  }

  // Reset game
  function resetGame() {
    // Reset state
    questions = generateAllQuestions();
    answers = shuffleAnswers(questions);
    score = 0;
    timeLeft = 30; // Changed from 60 to 30
    gameActive = true;
    matchedPairs = new Array(TOTAL_QUESTIONS).fill(false);
    selectedQuestionIndex = null;
    
    // Update UI
    scoreEl.textContent = '0';
    timeEl.textContent = '30'; // Changed from 60 to 30
    timeEl.style.color = '';
    matchedCountEl.textContent = '0';
    totalCountEl.textContent = TOTAL_QUESTIONS;
    
    // Render game
    renderGame();
    
    // Restart timer
    startTimer();
    
    // Hide popups
    winPopup.style.display = 'none';
    timeEndPopup.style.display = 'none';
  }

  // Go home
  function goHome() {
    window.location.href = 'index.html';
  }

  // Setup event listeners
  function setupEventListeners() {
    restartBtn.addEventListener('click', resetGame);
    
    // Win popup buttons
    playAgainBtn.addEventListener('click', resetGame);
    homeBtn.addEventListener('click', goHome);
    
    // Time end popup buttons
    timeEndPlayAgainBtn.addEventListener('click', resetGame);
    timeEndHomeBtn.addEventListener('click', goHome);
    
    // Close popups when clicking outside
    winPopup.addEventListener('click', (e) => {
      if (e.target === winPopup) {
        winPopup.style.display = 'none';
      }
    });
    
    timeEndPopup.addEventListener('click', (e) => {
      if (e.target === timeEndPopup) {
        timeEndPopup.style.display = 'none';
      }
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (winPopup.style.display === 'flex') {
          winPopup.style.display = 'none';
        }
        if (timeEndPopup.style.display === 'flex') {
          timeEndPopup.style.display = 'none';
        }
      }
    });
  }

  // Initialize game
  function init() {
    totalCountEl.textContent = TOTAL_QUESTIONS;
    resetGame();
    setupEventListeners();
    console.log("Game ready!");
  }

  init();
};