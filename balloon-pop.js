// Game State
let gameState = {
    score: 0,
    timer: 60,
    isPlaying: false,
    correctAnswer: null,
    balloons: [],
    animationFrame: null,
    timerInterval: null,
    questionHistory: new Set()
};

// DOM Elements
const questionEl = document.getElementById('question');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameArea = document.getElementById('gameArea');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const gameOverlay = document.getElementById('gameOverlay');
const finalScoreEl = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const homeModalBtn = document.getElementById('homeModalBtn');

// Colors for balloons
const balloonColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

// Initialize event listeners
function initEventListeners() {
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    homeBtn.addEventListener('click', goHome);
    playAgainBtn.addEventListener('click', () => {
        gameOverlay.style.display = 'none';
        startGame();
    });
    homeModalBtn.addEventListener('click', goHome);
}

// Generate unique math question
function generateQuestion() {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        const a = Math.floor(Math.random() * 12) + 1; // 1-12 for medium difficulty
        const b = Math.floor(Math.random() * 12) + 1;
        const operators = ['+', '-'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let question, answer;
        
        if (operator === '+') {
            question = `${a} + ${b} = ?`;
            answer = a + b;
        } else {
            // Ensure subtraction doesn't give negative results
            if (a >= b) {
                question = `${a} - ${b} = ?`;
                answer = a - b;
            } else {
                question = `${b} - ${a} = ?`;
                answer = b - a;
            }
        }
        
        const questionKey = `${question}-${answer}`;
        
        if (!gameState.questionHistory.has(questionKey)) {
            gameState.questionHistory.add(questionKey);
            return { question, answer };
        }
        
        attempts++;
    }
    
    // If we can't find a unique question, clear history and try again
    gameState.questionHistory.clear();
    return generateQuestion();
}

// Generate wrong answers
function generateWrongAnswers(correct, count = 3) {
    const wrongs = new Set();
    
    while (wrongs.size < count) {
        const offset = Math.floor(Math.random() * 5) + 1; // 1-5 offset
        const wrong = correct + (Math.random() < 0.5 ? offset : -offset);
        
        if (wrong > 0 && wrong <= 24 && wrong !== correct) {
            wrongs.add(wrong);
        }
    }
    
    return Array.from(wrongs);
}

// Create balloon
function createBalloon(answer, isCorrect, index) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    balloon.setAttribute('data-color', color);
    balloon.setAttribute('data-answer', answer);
    balloon.setAttribute('data-correct', isCorrect);
    
    // Calculate position for equal spacing
    const gameWidth = gameArea.offsetWidth;
    const balloonWidth = 100;
    const totalWidth = 4 * balloonWidth;
    const spacing = (gameWidth - totalWidth) / 5;
    
    const left = spacing + (index * (balloonWidth + spacing));
    balloon.style.left = `${left}px`;
    balloon.style.bottom = '50px'; // All start at same level
    
    // All balloons move at same speed (1.5px per frame)
    balloon.setAttribute('data-speed', '1.5');
    
    balloon.innerHTML = `
        <div class="balloon-body">
            <span class="balloon-answer">${answer}</span>
        </div>
    `;
    
    balloon.addEventListener('click', () => handleBalloonClick(balloon));
    
    return balloon;
}

// Handle balloon click
function handleBalloonClick(balloon) {
    if (!gameState.isPlaying || balloon.classList.contains('balloon-pop') || balloon.classList.contains('balloon-wrong')) {
        return;
    }
    
    const isCorrect = balloon.getAttribute('data-correct') === 'true';
    
    if (isCorrect) {
        // Correct pop
        balloon.classList.add('balloon-pop');
        
        // Increase score
        gameState.score++;
        scoreEl.textContent = gameState.score;
        
        // Remove balloon and generate new question
        setTimeout(() => {
            balloon.remove();
            gameState.balloons = gameState.balloons.filter(b => b !== balloon);
            
            // Check if all balloons are popped or game should continue
            if (gameState.isPlaying) {
                generateNewSet();
            }
        }, 300);
    } else {
        // Wrong click - red buzzer effect
        balloon.classList.add('balloon-wrong');
        
        // Add red flash to game area
        gameArea.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        setTimeout(() => {
            gameArea.style.backgroundColor = '';
        }, 200);
        
        setTimeout(() => {
            balloon.classList.remove('balloon-wrong');
        }, 500);
    }
}

// Generate new set of balloons
function generateNewSet() {
    if (!gameState.isPlaying) return;
    
    // Remove all existing balloons
    gameState.balloons.forEach(balloon => balloon.remove());
    gameState.balloons = [];
    
    // Generate new question
    const { question, answer } = generateQuestion();
    questionEl.textContent = question;
    gameState.correctAnswer = answer;
    
    // Generate answers (1 correct, 3 wrong)
    const wrongAnswers = generateWrongAnswers(answer, 3);
    const answers = [answer, ...wrongAnswers];
    
    // Shuffle answers
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    
    // Create balloons with equal spacing
    answers.forEach((ans, index) => {
        const isCorrect = ans === answer;
        const balloon = createBalloon(ans, isCorrect, index);
        gameArea.appendChild(balloon);
        gameState.balloons.push(balloon);
    });
}

// Animation loop
function animate() {
    if (!gameState.isPlaying) return;
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    const gameAreaTop = gameAreaRect.top;
    
    for (let i = gameState.balloons.length - 1; i >= 0; i--) {
        const balloon = gameState.balloons[i];
        
        if (!balloon.parentNode) {
            gameState.balloons.splice(i, 1);
            continue;
        }
        
        // Move balloon up at constant speed
        const currentBottom = parseFloat(balloon.style.bottom) || 50;
        const speed = 1.5; // Constant speed for all balloons
        const newBottom = currentBottom + speed;
        balloon.style.bottom = `${newBottom}px`;
        
        // Check if balloon reached top
        const balloonRect = balloon.getBoundingClientRect();
        if (balloonRect.top <= gameAreaTop) {
            balloon.remove();
            gameState.balloons.splice(i, 1);
        }
    }
    
    // Generate new set if all balloons are gone
    if (gameState.balloons.length === 0 && gameState.isPlaying) {
        generateNewSet();
    }
    
    gameState.animationFrame = requestAnimationFrame(animate);
}

// Timer function
function startTimer() {
    gameState.timer = 60;
    timerEl.textContent = gameState.timer;
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timerEl.textContent = gameState.timer;
        
        // Visual warning when time is low
        if (gameState.timer <= 10) {
            timerEl.style.color = '#ff4444';
        } else {
            timerEl.style.color = '#f1c40f';
        }
        
        if (gameState.timer <= 0) {
            endGame();
        }
    }, 1000);
}

// Start game
function startGame() {
    // Reset state
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.timer = 60;
    gameState.questionHistory.clear();
    
    // Update UI
    scoreEl.textContent = '0';
    timerEl.textContent = '60';
    timerEl.style.color = '#f1c40f';
    
    // Enable/disable buttons
    startBtn.disabled = true;
    restartBtn.disabled = false;
    
    // Hide overlay
    gameOverlay.style.display = 'none';
    
    // Clear existing balloons
    gameState.balloons.forEach(balloon => balloon.remove());
    gameState.balloons = [];
    
    // Start timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    startTimer();
    
    // Start animation
    if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
    }
    generateNewSet();
    gameState.animationFrame = requestAnimationFrame(animate);
}

// Restart game
function restartGame() {
    endGame();
    startGame();
}

// End game
function endGame() {
    gameState.isPlaying = false;
    
    // Clear intervals and animation
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    if (gameState.animationFrame) {
        cancelAnimationFrame(gameState.animationFrame);
    }
    
    // Clear balloons
    gameState.balloons.forEach(balloon => balloon.remove());
    gameState.balloons = [];
    
    // Show game over overlay
    finalScoreEl.textContent = gameState.score;
    gameOverlay.style.display = 'flex';
}

// Go home
function goHome() {
    window.location.href = 'index.html';
}

// Handle window resize
function handleResize() {
    if (gameState.isPlaying && gameState.balloons.length > 0) {
        // Reposition balloons with new spacing
        const gameWidth = gameArea.offsetWidth;
        const balloonWidth = 100;
        const totalWidth = 4 * balloonWidth;
        const spacing = (gameWidth - totalWidth) / 5;
        
        gameState.balloons.forEach((balloon, index) => {
            const left = spacing + (index * (balloonWidth + spacing));
            balloon.style.left = `${left}px`;
        });
    }
}

// Initialize
function init() {
    initEventListeners();
    window.addEventListener('resize', handleResize);
    
    // Set initial state
    gameOverlay.style.display = 'none';
    startBtn.disabled = false;
    restartBtn.disabled = true;
}

// Start everything when page loads
document.addEventListener('DOMContentLoaded', init);