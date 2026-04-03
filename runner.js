// runner.js - Math Runner Game: endless runner with educational math challenges
// Author: Math Runner for Grade 1-7

// ------------------- GLOBAL VARIABLES -------------------
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dimensions (fixed logical size, but responsive via CSS)
canvas.width = 800;
canvas.height = 400;

// Game state
let gameRunning = false;
let animationId = null;
let difficultyMode = 'easy';   // 'easy', 'medium', 'hard' (will be set by score / adaptive)
let currentLives = 3;
let currentScore = 0;
let currentCoins = 0;
let currentStreak = 0;
let baseSpeed = 3.5;    // obstacle scroll speed & runner motion feel
let currentSpeed = 3.5;
let speedMultiplier = 1.0;
let questionTimer = 0;
let timeUntilNextQuestion = 1.8; // seconds
let lastTimestamp = 0;

// Runner & obstacle positions (endless runner)
let runnerX = 100;
let runnerY = canvas.height - 70;
const runnerWidth = 40;
const runnerHeight = 50;
let obstacles = [];      // each obstacle: { x, y, width, height, active }
let obstacleCooldown = 0;
let wrongAnswerTrigger = false;    // to spawn obstacle on wrong answer

// Question System
let currentQuestion = null;
let currentOptions = [];
let correctAnswerValue = null;
let waitingForAnswer = true;
let canAnswer = true;    // avoid double answer same frame
let nextQuestionScheduled = false;

// UI elements
const scoreSpan = document.getElementById('scoreValue');
const livesSpan = document.getElementById('livesValue');
const coinsSpan = document.getElementById('coinsValue');
const questionDiv = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const feedbackToast = document.getElementById('feedbackToast');

// Helper: sound simulation (optional beep via web audio simple)
let audioCtx = null;
function playTone(type) {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) { return; }
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    let freq = type === 'correct' ? 880 : 440;
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);
    osc.stop(audioCtx.currentTime + 0.3);
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

// ------------------- MATH QUESTION GENERATOR (adaptive by grade & mode) -------------------
function getDifficultyByScore() {
    if (currentScore < 200) return 'easy';
    if (currentScore < 600) return 'medium';
    return 'hard';
}

function generateMathQuestion() {
    const activeDifficulty = getDifficultyByScore();
    let a, b, operator, answer, problemText;
    const randOp = () => {
        if (activeDifficulty === 'easy') {
            const ops = ['+', '-'];
            return ops[Math.floor(Math.random() * ops.length)];
        } else if (activeDifficulty === 'medium') {
            const ops = ['+', '-', '×', '÷'];
            return ops[Math.floor(Math.random() * ops.length)];
        } else {
            const ops = ['+', '-', '×', '÷'];
            return ops[Math.floor(Math.random() * ops.length)];
        }
    };
    operator = randOp();
    
    if (activeDifficulty === 'easy') { // Grade 1-2: numbers 0-20, no negative
        a = Math.floor(Math.random() * 13) + 1;
        b = Math.floor(Math.random() * 13) + 1;
        if (operator === '+') { answer = a + b; problemText = `${a} + ${b}`; }
        else { 
            answer = a - b;
            if (answer < 0) { [a,b] = [b,a]; answer = a - b; }
            problemText = `${a} - ${b}`;
        }
    } 
    else if (activeDifficulty === 'medium') { // Grade 3-5 multiplication/division
        if (operator === '×') {
            a = Math.floor(Math.random() * 10) + 2;
            b = Math.floor(Math.random() * 10) + 2;
            answer = a * b;
            problemText = `${a} × ${b}`;
        } else if (operator === '÷') {
            b = Math.floor(Math.random() * 9) + 2;
            answer = Math.floor(Math.random() * 10) + 1;
            a = b * answer;
            problemText = `${a} ÷ ${b}`;
        } else if (operator === '+') {
            a = Math.floor(Math.random() * 30) + 1;
            b = Math.floor(Math.random() * 30) + 1;
            answer = a + b;
            problemText = `${a} + ${b}`;
        } else {
            a = Math.floor(Math.random() * 30) + 10;
            b = Math.floor(Math.random() * 20) + 1;
            answer = a - b;
            if (answer < 0) { [a,b] = [b,a]; answer = a - b; }
            problemText = `${a} - ${b}`;
        }
    } 
    else { // Hard mode: mixed operations, time pressure & larger ranges
        if (operator === '×') {
            a = Math.floor(Math.random() * 12) + 3;
            b = Math.floor(Math.random() * 12) + 3;
            answer = a * b;
            problemText = `${a} × ${b}`;
        } else if (operator === '÷') {
            b = Math.floor(Math.random() * 12) + 2;
            answer = Math.floor(Math.random() * 12) + 2;
            a = b * answer;
            problemText = `${a} ÷ ${b}`;
        } else if (operator === '+') {
            a = Math.floor(Math.random() * 50) + 10;
            b = Math.floor(Math.random() * 50) + 10;
            answer = a + b;
            problemText = `${a} + ${b}`;
        } else {
            a = Math.floor(Math.random() * 60) + 20;
            b = Math.floor(Math.random() * 30) + 1;
            answer = a - b;
            problemText = `${a} - ${b}`;
        }
    }
    // generate 4 options with one correct and three plausible distractors
    let optionsSet = new Set();
    optionsSet.add(answer);
    while(optionsSet.size < 4) {
        let offset = Math.floor(Math.random() * 11) - 5;
        let distractor = answer + offset;
        if (distractor < 0) distractor = answer + 1;
        if (distractor === answer) distractor = answer + (Math.random() > 0.5 ? 1 : -1);
        optionsSet.add(distractor);
    }
    let opts = Array.from(optionsSet);
    opts.sort(() => Math.random() - 0.5);
    
    currentQuestion = problemText;
    currentOptions = opts;
    correctAnswerValue = answer;
    waitingForAnswer = false;
    canAnswer = true;
    
    // Update UI
    questionDiv.innerText = `❓ ${currentQuestion} = ?`;
    optionsContainer.innerHTML = '';
    currentOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('opt-btn');
        btn.addEventListener('click', () => handleAnswer(opt));
        optionsContainer.appendChild(btn);
    });
}

// --------------- ANSWER HANDLER --------------
function handleAnswer(selected) {
    if (!gameRunning || waitingForAnswer || !canAnswer) return;
    canAnswer = false;
    const isCorrect = (Number(selected) === correctAnswerValue);
    
    if (isCorrect) {
        // CORRECT: increase score, coins, speed boost, streak, positive animation
        let addScore = 10 + Math.floor(currentStreak / 3);
        currentScore += addScore;
        currentCoins += 5;
        currentStreak++;
        // Increase speed slightly, max 11
        currentSpeed = Math.min(11, currentSpeed + 0.35);
        // Positive feedback
        showToast(`+${addScore} 🎉`, '#8bc34a');
        playTone('correct');
        // Update UI
        updateStatsUI();
        
        // spawn speed effect
        const speedFx = document.getElementById('speedEffect');
        speedFx.classList.add('boost');
        setTimeout(() => speedFx.classList.remove('boost'), 200);
        
        // Additional: extra score on streak
        if (currentStreak % 5 === 0) {
            currentCoins += 10;
            showToast(`🔥 STREAK BONUS! +10🪙`, '#ffaa44');
            updateStatsUI();
        }
        // Schedule next question after correct (quickly)
        scheduleNextQuestion(0.8);
    } else {
        // WRONG: reduce lives, reduce speed, spawn obstacle, reset streak
        currentLives--;
        currentStreak = 0;
        currentSpeed = Math.max(2.5, currentSpeed - 1.2);
        showToast(`❌ WRONG! -1 ❤️`, '#ff6b6b');
        playTone('wrong');
        updateStatsUI();
        // spawn obstacle on wrong answer
        wrongAnswerTrigger = true;
        if (currentLives <= 0) {
            gameOver();
            return;
        }
        scheduleNextQuestion(1.2);
    }
    
    // disable buttons temporarily
    disableOptions(true);
    waitingForAnswer = true;
}

function disableOptions(disabled) {
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(btn => {
        if (disabled) btn.disabled = true;
        else btn.disabled = false;
    });
}

function scheduleNextQuestion(delaySec) {
    if (!gameRunning) return;
    // let the game loop manage questionTimer
    timeUntilNextQuestion = delaySec;
    nextQuestionScheduled = true;
}

// after timer generates new question
function refreshQuestion() {
    if (!gameRunning) return;
    generateMathQuestion();
    disableOptions(false);
    waitingForAnswer = false;
    canAnswer = true;
    nextQuestionScheduled = false;
}

// ------------- OBSTACLE MANAGEMENT -------------
function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 48,
        width: 32,
        height: 32,
        active: true
    });
}

function updateObstacles(deltaTime) {
    const moveDist = currentSpeed * deltaTime * 45;
    for (let i=0; i<obstacles.length; i++) {
        obstacles[i].x -= moveDist;
    }
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
    
    // Collision detection (runner rect)
    const runnerRect = { x: runnerX, y: runnerY, w: runnerWidth, h: runnerHeight };
    for (let i=0; i<obstacles.length; i++) {
        const obs = obstacles[i];
        if (obs.x < runnerRect.x + runnerRect.w && obs.x + obs.width > runnerRect.x &&
            obs.y < runnerRect.y + runnerRect.h && obs.y + obs.height > runnerRect.y) {
            // collision: lose life
            currentLives--;
            updateStatsUI();
            showToast(`💥 CRASH! -1 ❤️`, '#ff4444');
            obstacles.splice(i,1);
            if (currentLives <= 0) {
                gameOver();
            }
            break;
        }
    }
}

// spawn obstacle from wrong answer
function handleWrongTrigger() {
    if (wrongAnswerTrigger) {
        spawnObstacle();
        wrongAnswerTrigger = false;
    }
    // natural random obstacle every 4-6 secs when speed high
    if (gameRunning && Math.random() < 0.008 * (currentSpeed/4)) {
        spawnObstacle();
    }
}

// ------------- GAME LOOP & RENDERING -------------
function drawRunner() {
    // simple runner (kid friendly)
    ctx.fillStyle = '#F9A825';
    ctx.shadowBlur = 0;
    ctx.fillRect(runnerX, runnerY, runnerWidth, runnerHeight);
    ctx.fillStyle = '#E65100';
    ctx.fillRect(runnerX+5, runnerY-10, 8, 12);
    ctx.fillStyle = '#000';
    ctx.fillRect(runnerX+28, runnerY+12, 6, 8);
    ctx.fillRect(runnerX+8, runnerY+12, 6, 8);
    // scarf
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(runnerX+12, runnerY+28, 18, 8);
    // legs animation simple
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(runnerX+8, runnerY+42, 8, 12);
    ctx.fillRect(runnerX+26, runnerY+42, 8, 12);
}

function drawBackground() {
    // sky gradient + ground
    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0, '#b2ebf2');
    grad.addColorStop(0.7, '#f9e0a0');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#6B4C3B';
    ctx.fillRect(0, canvas.height-25, canvas.width, 30);
    ctx.fillStyle = '#8B6946';
    for(let i=0;i<12;i++) {
        ctx.fillRect( i*70 + (Date.now()*0.005 % 70), canvas.height-32, 25, 8);
    }
    // draw obstacles
    obstacles.forEach(obs => {
        ctx.fillStyle = '#5D4037';
        ctx.shadowBlur = 4;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(obs.x+6, obs.y-6, 20, 8);
    });
    ctx.shadowBlur = 0;
}

function drawUItext() {
    ctx.font = 'bold 18px "Comic Neue"';
    ctx.fillStyle = '#2d2f1f';
    ctx.fillText(`⚡ Speed: ${currentSpeed.toFixed(1)}`, canvas.width-120, 35);
    if (currentStreak>2) ctx.fillStyle = '#f57c00';
    ctx.fillText(`🔥 Streak x${currentStreak}`, canvas.width-120, 65);
}

let lastFrameTime = 0;
function gameLoop(nowMs) {
    if (!gameRunning) return;
    const delta = Math.min(0.033, (nowMs - lastFrameTime) / 1000);
    if (delta <= 0) { lastFrameTime = nowMs; requestAnimationFrame(gameLoop); return; }
    lastFrameTime = nowMs;
    
    // update question timer
    if (waitingForAnswer || nextQuestionScheduled) {
        if (timeUntilNextQuestion > 0) {
            timeUntilNextQuestion -= delta;
        } else {
            if (nextQuestionScheduled || waitingForAnswer) {
                refreshQuestion();
            }
        }
    }
    
    // handle wrong answer obstacles and natural obstacles
    handleWrongTrigger();
    updateObstacles(delta);
    
    // speed gradually increase over time (endless difficulty)
    if (gameRunning && currentSpeed < 11.5) {
        currentSpeed += 0.008 * delta * 30;
        currentSpeed = Math.min(12, currentSpeed);
    }
    
    // repaint
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBackground();
    drawRunner();
    drawUItext();
    
    requestAnimationFrame(gameLoop);
}

// -------- GAME START / RESTART ----------
function startGame() {
    if (animationId) cancelAnimationFrame(animationId);
    gameRunning = true;
    currentLives = 3;
    currentScore = 0;
    currentCoins = 0;
    currentStreak = 0;
    currentSpeed = 3.5;
    obstacles = [];
    wrongAnswerTrigger = false;
    waitingForAnswer = false;
    canAnswer = true;
    nextQuestionScheduled = false;
    timeUntilNextQuestion = 0.5;
    updateStatsUI();
    generateMathQuestion();
    disableOptions(false);
    // start loop
    lastFrameTime = performance.now();
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    questionDiv.innerText = `💀 GAME OVER! Score: ${currentScore} 💀`;
    disableOptions(true);
    // show highscore localStorage
    let high = localStorage.getItem('mathRunnerHigh') || 0;
    if (currentScore > high) {
        localStorage.setItem('mathRunnerHigh', currentScore);
        questionDiv.innerText += ` 🏆 NEW HIGHSCORE!`;
    } else {
        questionDiv.innerText += `  Best: ${high}`;
    }
}

function restartGame() {
    if (animationId) cancelAnimationFrame(animationId);
    startGame();
}

function updateStatsUI() {
    scoreSpan.innerText = currentScore;
    livesSpan.innerText = currentLives;
    coinsSpan.innerText = currentCoins;
    if (currentLives <= 0 && gameRunning) gameOver();
}

function showToast(msg, bgColor='#ffd966') {
    const toast = document.getElementById('feedbackToast');
    toast.innerText = msg;
    toast.style.background = bgColor;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 600);
}

// Event Listeners
startBtn.addEventListener('click', () => {
    if (gameRunning) return;
    startGame();
});
restartBtn.addEventListener('click', () => {
    if (animationId) cancelAnimationFrame(animationId);
    startGame();
});
// initial idle question placeholder
(function init() {
    generateMathQuestion();
    disableOptions(true);
    questionDiv.innerText = '🌟 Press START to run & solve! 🌟';
    updateStatsUI();
})();