// script.js - Shadow Match Safari with Difficulty Levels & Timer
// Complete drag & drop game with custom mouse/touch events, randomized animals, difficulty modes, and timer
// Features: 50+ unique animals, no repeats per game, enhanced difficulty with visual feedback
// Difficulties: Medium and Hard only

(function() {
  // ======================== ANIMAL DATABASE (50+ animals) ========================
  const ANIMAL_LIBRARY = [
    { id: "cat", emoji: "🐱", name: "Cat", shadowIcon: "🐾" },
    { id: "dog", emoji: "🐶", name: "Dog", shadowIcon: "🐾" },
    { id: "panda", emoji: "🐼", name: "Panda", shadowIcon: "🐾" },
    { id: "lion", emoji: "🦁", name: "Lion", shadowIcon: "🦁" },
    { id: "elephant", emoji: "🐘", name: "Elephant", shadowIcon: "🐘" },
    { id: "rabbit", emoji: "🐰", name: "Rabbit", shadowIcon: "🐾" },
    { id: "tiger", emoji: "🐯", name: "Tiger", shadowIcon: "🐯" },
    { id: "monkey", emoji: "🐵", name: "Monkey", shadowIcon: "🐵" },
    { id: "bear", emoji: "🐻", name: "Bear", shadowIcon: "🐻" },
    { id: "fox", emoji: "🦊", name: "Fox", shadowIcon: "🦊" },
    { id: "koala", emoji: "🐨", name: "Koala", shadowIcon: "🐨" },
    { id: "penguin", emoji: "🐧", name: "Penguin", shadowIcon: "🐧" },
    { id: "frog", emoji: "🐸", name: "Frog", shadowIcon: "🐸" },
    { id: "owl", emoji: "🦉", name: "Owl", shadowIcon: "🦉" },
    { id: "deer", emoji: "🦌", name: "Deer", shadowIcon: "🦌" },
    { id: "giraffe", emoji: "🦒", name: "Giraffe", shadowIcon: "🦒" },
    { id: "zebra", emoji: "🦓", name: "Zebra", shadowIcon: "🦓" },
    { id: "hippo", emoji: "🦛", name: "Hippo", shadowIcon: "🦛" },
    { id: "rhino", emoji: "🦏", name: "Rhino", shadowIcon: "🦏" },
    { id: "kangaroo", emoji: "🦘", name: "Kangaroo", shadowIcon: "🦘" },
    { id: "crocodile", emoji: "🐊", name: "Crocodile", shadowIcon: "🐊" },
    { id: "peacock", emoji: "🦚", name: "Peacock", shadowIcon: "🦚" },
    { id: "parrot", emoji: "🦜", name: "Parrot", shadowIcon: "🦜" },
    { id: "butterfly", emoji: "🦋", name: "Butterfly", shadowIcon: "🦋" },
    { id: "snail", emoji: "🐌", name: "Snail", shadowIcon: "🐌" },
    { id: "ladybug", emoji: "🐞", name: "Ladybug", shadowIcon: "🐞" },
    { id: "ant", emoji: "🐜", name: "Ant", shadowIcon: "🐜" },
    { id: "bee", emoji: "🐝", name: "Bee", shadowIcon: "🐝" },
    { id: "spider", emoji: "🕷️", name: "Spider", shadowIcon: "🕷️" },
    { id: "octopus", emoji: "🐙", name: "Octopus", shadowIcon: "🐙" },
    { id: "fish", emoji: "🐠", name: "Fish", shadowIcon: "🐠" },
    { id: "dolphin", emoji: "🐬", name: "Dolphin", shadowIcon: "🐬" },
    { id: "whale", emoji: "🐳", name: "Whale", shadowIcon: "🐳" },
    { id: "shark", emoji: "🦈", name: "Shark", shadowIcon: "🦈" },
    { id: "turtle", emoji: "🐢", name: "Turtle", shadowIcon: "🐢" },
    { id: "lizard", emoji: "🦎", name: "Lizard", shadowIcon: "🦎" },
    { id: "snake", emoji: "🐍", name: "Snake", shadowIcon: "🐍" },
    { id: "dragon", emoji: "🐉", name: "Dragon", shadowIcon: "🐉" },
    { id: "unicorn", emoji: "🦄", name: "Unicorn", shadowIcon: "🦄" },
    { id: "sloth", emoji: "🦥", name: "Sloth", shadowIcon: "🦥" },
    { id: "otter", emoji: "🦦", name: "Otter", shadowIcon: "🦦" },
    { id: "skunk", emoji: "🦨", name: "Skunk", shadowIcon: "🦨" },
    { id: "flamingo", emoji: "🦩", name: "Flamingo", shadowIcon: "🦩" },
    { id: "swan", emoji: "🦢", name: "Swan", shadowIcon: "🦢" },
    { id: "duck", emoji: "🦆", name: "Duck", shadowIcon: "🦆" },
    { id: "chicken", emoji: "🐔", name: "Chicken", shadowIcon: "🐔" },
    { id: "turkey", emoji: "🦃", name: "Turkey", shadowIcon: "🦃" },
    { id: "goat", emoji: "🐐", name: "Goat", shadowIcon: "🐐" },
    { id: "sheep", emoji: "🐑", name: "Sheep", shadowIcon: "🐑" },
    { id: "cow", emoji: "🐄", name: "Cow", shadowIcon: "🐄" },
    { id: "horse", emoji: "🐎", name: "Horse", shadowIcon: "🐎" },
    { id: "pig", emoji: "🐷", name: "Pig", shadowIcon: "🐷" },
    { id: "mouse", emoji: "🐭", name: "Mouse", shadowIcon: "🐭" },
    { id: "hamster", emoji: "🐹", name: "Hamster", shadowIcon: "🐹" },
    { id: "squirrel", emoji: "🐿️", name: "Squirrel", shadowIcon: "🐿️" },
    { id: "hedgehog", emoji: "🦔", name: "Hedgehog", shadowIcon: "🦔" },
    { id: "bat", emoji: "🦇", name: "Bat", shadowIcon: "🦇" }
  ];

  // Game constants
  const GAME_SIZE = 10; // 10 animals per game
  const GAME_TIME_SECONDS = 90; // 1 minute 30 seconds
  
  // Difficulty levels configuration - Medium and Hard only
  const DIFFICULTY_CONFIG = {
    medium: { 
      shadowOpacity: 0.55, 
      shadowFilter: "brightness(0.7) blur(1px)",
      shadowBlur: "1px",
      shadowBrightness: "0.7",
      shadowContrast: "0.9",
      label: "Medium",
      backgroundColor: "#e8dfc8",
      borderStyle: "3px dashed #8b7355"
    },
    hard: { 
      shadowOpacity: 0.22, 
      shadowFilter: "brightness(0.35) blur(3px) contrast(0.7)",
      shadowBlur: "3px",
      shadowBrightness: "0.35",
      shadowContrast: "0.7",
      label: "Hard",
      backgroundColor: "#c9b896",
      borderStyle: "3px solid #5a3e1a",
      extraDarkness: true,
      blurIntensity: "3px"
    }
  };
  
  // DOM Elements
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const playBtn = document.getElementById('playBtn');
  const restartBtn = document.getElementById('restartBtn');
  const winPlayAgainBtn = document.getElementById('winPlayAgainBtn');
  const animalsArea = document.getElementById('animalsArea');
  const shadowsArea = document.getElementById('shadowsArea');
  const matchCounterSpan = document.getElementById('matchCounter');
  const totalCounterSpan = document.getElementById('totalCounter');
  const winOverlay = document.getElementById('winOverlay');

  // Game state
  let currentAnimals = [];
  let matchedCount = 0;
  let matchedStatus = new Map();
  let activeDragItem = null;
  let cloneElement = null;
  let isDragging = false;
  let startDragX = 0, startDragY = 0;
  let currentDropZone = null;
  
  // Difficulty & Timer state
  let currentDifficulty = 'medium';   // medium or hard (default: medium)
  let timerInterval = null;
  let timeRemaining = GAME_TIME_SECONDS;
  let isGameActive = false;
  let timerDisplayElement = null;
  
  // Drag event handlers references
  let globalMoveHandler = null;
  let globalUpHandler = null;

  // Helper: Get random 10 animals from library (ensuring variety, no repeats)
  function getRandomAnimals() {
    const shuffled = [...ANIMAL_LIBRARY];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, GAME_SIZE);
  }

  // Shuffle array
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  
  // Apply difficulty level to shadow zones
  function applyDifficultyToShadows() {
    const shadowZones = document.querySelectorAll('.shadow-zone');
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    
    shadowZones.forEach(zone => {
      const icon = zone.querySelector('.shadow-icon');
      if (icon) {
        icon.style.transition = 'opacity 0.3s ease, filter 0.3s ease';
        icon.style.opacity = config.shadowOpacity;
        icon.style.filter = config.shadowFilter;
      }
      
      zone.style.transition = 'background-color 0.3s ease, border 0.3s ease';
      zone.style.backgroundColor = config.backgroundColor;
      zone.style.border = config.borderStyle;
      
      if (currentDifficulty === 'hard') {
        zone.style.boxShadow = 'inset 0 0 15px rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.1)';
        zone.style.backdropFilter = 'brightness(0.85)';
      } else {
        zone.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)';
        zone.style.backdropFilter = 'none';
      }
    });
    
    const shadowsAreaElem = document.getElementById('shadowsArea');
    if (shadowsAreaElem) {
      if (currentDifficulty === 'hard') {
        shadowsAreaElem.style.background = '#a89070';
        shadowsAreaElem.style.boxShadow = 'inset 0 1px 10px rgba(0,0,0,0.2), 0 10px 18px rgba(0,0,0,0.1)';
      } else {
        shadowsAreaElem.style.background = '#e8dfc8';
        shadowsAreaElem.style.boxShadow = 'inset 0 1px 6px rgba(85,55,20,0.1), 0 10px 18px rgba(0,0,0,0.1)';
      }
    }
  }
  
  // Update difficulty button active states
  function updateDifficultyButtons() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
      const difficulty = btn.getAttribute('data-difficulty');
      if (difficulty === currentDifficulty) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // Change difficulty without popup
  function setDifficulty(difficulty) {
    if (difficulty === currentDifficulty) return;
    
    if (!isGameActive) {
      currentDifficulty = difficulty;
      applyDifficultyToShadows();
      updateDifficultyButtons();
    } else {
      currentDifficulty = difficulty;
      applyDifficultyToShadows();
      updateDifficultyButtons();
      resetAndNewGame();
    }
  }
  
  // Create difficulty selector UI
  function createDifficultySelector() {
    const gameHeader = document.querySelector('.game-header');
    if (!gameHeader) return;
    
    if (document.getElementById('difficultySelector')) return;
    
    const difficultyDiv = document.createElement('div');
    difficultyDiv.className = 'difficulty-selector';
    difficultyDiv.id = 'difficultySelector';
    difficultyDiv.innerHTML = `
      <span class="difficulty-label">🎮 Difficulty:</span>
      <div class="difficulty-buttons">
        <button class="difficulty-btn medium-btn" data-difficulty="medium">⚡ Medium</button>
        <button class="difficulty-btn hard-btn" data-difficulty="hard">🔥 Hard</button>
      </div>
    `;
    
    const scoreBox = document.querySelector('.score-box');
    if (scoreBox && scoreBox.parentNode) {
      gameHeader.insertBefore(difficultyDiv, scoreBox.nextSibling);
    } else {
      gameHeader.appendChild(difficultyDiv);
    }
    
    const mediumBtn = difficultyDiv.querySelector('[data-difficulty="medium"]');
    const hardBtn = difficultyDiv.querySelector('[data-difficulty="hard"]');
    
    mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
    
    updateDifficultyButtons();
  }
  
  // Create Home button
  function createHomeButton() {
    const gameHeader = document.querySelector('.game-header');
    if (!gameHeader) return;
    
    if (document.getElementById('homeButton')) return;
    
    const homeBtn = document.createElement('button');
    homeBtn.className = 'home-btn';
    homeBtn.id = 'homeButton';
    homeBtn.innerHTML = '🏠 Home';
    homeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
    
    gameHeader.insertBefore(homeBtn, gameHeader.firstChild);
  }
  
  // Create timer display
  function createTimerDisplay() {
    const gameHeader = document.querySelector('.game-header');
    if (!gameHeader) return;
    
    if (document.getElementById('timerDisplay')) return;
    
    const timerDiv = document.createElement('div');
    timerDiv.className = 'timer-display';
    timerDiv.id = 'timerDisplay';
    timerDiv.innerHTML = `
      <span class="timer-icon">⏱️</span>
      <span class="timer-value" id="timerValue">1:30</span>
    `;
    
    const difficultySelect = document.getElementById('difficultySelector');
    if (difficultySelect && difficultySelect.nextSibling) {
      gameHeader.insertBefore(timerDiv, difficultySelect.nextSibling);
    } else {
      gameHeader.appendChild(timerDiv);
    }
    
    timerDisplayElement = document.getElementById('timerValue');
  }
  
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function updateTimerDisplay() {
    if (timerDisplayElement) {
      timerDisplayElement.textContent = formatTime(timeRemaining);
    }
  }
  
  function startTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    timeRemaining = GAME_TIME_SECONDS;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
      if (!isGameActive) return;
      
      if (timeRemaining <= 1) {
        clearInterval(timerInterval);
        timerInterval = null;
        timeRemaining = 0;
        updateTimerDisplay();
        handleTimeOut();
      } else {
        timeRemaining--;
        updateTimerDisplay();
      }
    }, 1000);
  }
  
  function handleTimeOut() {
    if (matchedCount === GAME_SIZE) return;
    
    isGameActive = false;
    
    const timeoutOverlay = document.createElement('div');
    timeoutOverlay.className = 'timeout-overlay';
    timeoutOverlay.innerHTML = `
      <div class="timeout-card">
        <h2>⏰ Time's Up! ⏰</h2>
        <p>You matched ${matchedCount} out of ${GAME_SIZE} animals.</p>
        <p class="difficulty-hint">Try ${currentDifficulty === 'medium' ? 'Hard' : 'Medium'} mode to practice!</p>
        <button class="timeout-play-again">Play Again 🌈</button>
      </div>
    `;
    document.body.appendChild(timeoutOverlay);
    
    const tryAgainBtn = timeoutOverlay.querySelector('.timeout-play-again');
    tryAgainBtn.addEventListener('click', () => {
      timeoutOverlay.remove();
      resetAndNewGame();
    });
    
    if (isDragging) {
      cleanupDrag();
    }
  }
  
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  
  function renderGame(animalsArray) {
    const shuffledAnimals = shuffleArray([...animalsArray]);
    const shuffledShadows = shuffleArray([...animalsArray]);
    
    animalsArea.innerHTML = '';
    shuffledAnimals.forEach(animal => {
      const animalCard = document.createElement('div');
      animalCard.className = 'animal-card';
      animalCard.setAttribute('data-animal', animal.id);
      animalCard.setAttribute('data-matched', 'false');
      animalCard.innerHTML = `
        <div class="animal-emoji">${animal.emoji}</div>
        <div class="animal-name">${animal.name}</div>
      `;
      animalsArea.appendChild(animalCard);
    });
    
    shadowsArea.innerHTML = '';
    shuffledShadows.forEach(animal => {
      const shadowZone = document.createElement('div');
      shadowZone.className = 'shadow-zone';
      shadowZone.setAttribute('data-shadow', animal.id);
      shadowZone.setAttribute('data-filled', 'false');
      shadowZone.innerHTML = `
        <div class="shadow-icon">${animal.shadowIcon || '🌑'}</div>
        <div class="shadow-label">???</div>
      `;
      shadowsArea.appendChild(shadowZone);
    });
    
    applyDifficultyToShadows();
  }

  function updateMatchCounter() {
    matchCounterSpan.textContent = matchedCount;
    totalCounterSpan.textContent = GAME_SIZE;
  }

  function checkWin() {
    if (matchedCount === GAME_SIZE && isGameActive) {
      isGameActive = false;
      stopTimer();
      showWinScreen();
    }
  }

  function showWinScreen() {
    winOverlay.classList.remove('hidden');
    const confettiDiv = document.querySelector('.confetti-animation');
    if (confettiDiv) {
      confettiDiv.style.animation = 'none';
      setTimeout(() => {
        confettiDiv.style.animation = 'confettiPop 0.6s infinite alternate';
      }, 10);
    }
  }

  function hideWinScreen() {
    winOverlay.classList.add('hidden');
  }

  function markMatch(animalCard, shadowZone) {
    const animalId = animalCard.getAttribute('data-animal');
    const shadowId = shadowZone.getAttribute('data-shadow');
    
    if (animalId !== shadowId) return false;
    if (matchedStatus.get(animalId) === true) return false;
    if (shadowZone.getAttribute('data-filled') === 'true') return false;
    
    matchedStatus.set(animalId, true);
    matchedCount++;
    
    animalCard.classList.add('matched');
    animalCard.setAttribute('data-matched', 'true');
    
    shadowZone.classList.add('correct-filled');
    shadowZone.setAttribute('data-filled', 'true');
    
    const shadowIcon = shadowZone.querySelector('.shadow-icon');
    if (shadowIcon) {
      shadowIcon.style.opacity = '0.9';
      shadowIcon.style.filter = 'none';
    }
    
    const animalObj = currentAnimals.find(a => a.id === animalId);
    if (animalObj) {
      const labelSpan = shadowZone.querySelector('.shadow-label');
      if (labelSpan) labelSpan.textContent = animalObj.name;
    }
    
    shadowZone.classList.add('glow-correct');
    setTimeout(() => {
      shadowZone.classList.remove('glow-correct');
    }, 500);
    
    updateMatchCounter();
    checkWin();
    
    return true;
  }
  
  function shakeElement(element) {
    if (!element) return;
    element.classList.add('shake-effect');
    setTimeout(() => {
      element.classList.remove('shake-effect');
    }, 400);
  }
  
  function addErrorHighlight(element) {
    if (!element) return;
    element.classList.add('wrong-match-highlight');
    setTimeout(() => {
      element.classList.remove('wrong-match-highlight');
    }, 400);
  }
  
  function cleanupDrag() {
    if (cloneElement && cloneElement.parentNode) {
      cloneElement.parentNode.removeChild(cloneElement);
    }
    cloneElement = null;
    
    if (activeDragItem) {
      activeDragItem.classList.remove('dragging');
      activeDragItem = null;
    }
    
    if (currentDropZone) {
      currentDropZone.classList.remove('drop-valid');
      currentDropZone = null;
    }
    
    if (globalMoveHandler) {
      window.removeEventListener('mousemove', globalMoveHandler);
      window.removeEventListener('touchmove', globalMoveHandler);
      window.removeEventListener('mouseup', globalUpHandler);
      window.removeEventListener('touchend', globalUpHandler);
      window.removeEventListener('touchcancel', globalUpHandler);
      globalMoveHandler = null;
      globalUpHandler = null;
    }
    
    isDragging = false;
    document.body.style.cursor = '';
  }
  
  function getDropZoneFromCoords(x, y) {
    const elements = document.elementsFromPoint(x, y);
    for (let el of elements) {
      if (el.classList && el.classList.contains('shadow-zone')) {
        return el;
      }
      if (el.parentElement && el.parentElement.classList && el.parentElement.classList.contains('shadow-zone')) {
        return el.parentElement;
      }
    }
    return null;
  }
  
  function onGlobalMove(e) {
    if (!isDragging || !cloneElement) return;
    e.preventDefault();
    
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const cloneWidth = cloneElement.offsetWidth;
    const cloneHeight = cloneElement.offsetHeight;
    cloneElement.style.left = `${clientX - cloneWidth / 2}px`;
    cloneElement.style.top = `${clientY - cloneHeight / 2}px`;
    
    const dropZone = getDropZoneFromCoords(clientX, clientY);
    if (dropZone !== currentDropZone) {
      if (currentDropZone) {
        currentDropZone.classList.remove('drop-valid');
      }
      currentDropZone = dropZone;
      if (currentDropZone && currentDropZone.getAttribute('data-filled') !== 'true') {
        currentDropZone.classList.add('drop-valid');
      }
    }
  }
  
  function onGlobalUp(e) {
    if (!isDragging || !activeDragItem) {
      cleanupDrag();
      return;
    }
    
    let clientX, clientY;
    if (e.changedTouches) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const targetDropZone = getDropZoneFromCoords(clientX, clientY);
    
    if (targetDropZone && targetDropZone.getAttribute('data-filled') !== 'true') {
      const animalId = activeDragItem.getAttribute('data-animal');
      const shadowId = targetDropZone.getAttribute('data-shadow');
      const alreadyMatched = matchedStatus.get(animalId) === true;
      
      if (animalId === shadowId && !alreadyMatched) {
        markMatch(activeDragItem, targetDropZone);
      } else {
        shakeElement(targetDropZone);
        addErrorHighlight(targetDropZone);
      }
    } else if (targetDropZone && targetDropZone.getAttribute('data-filled') === 'true') {
      shakeElement(targetDropZone);
    }
    
    cleanupDrag();
  }
  
  function startDrag(e, animalCard) {
    if (!isGameActive) {
      e.preventDefault();
      return false;
    }
    if (animalCard.classList.contains('matched')) {
      e.preventDefault();
      return false;
    }
    
    e.preventDefault();
    if (isDragging) return false;
    
    let startClientX, startClientY;
    if (e.touches) {
      startClientX = e.touches[0].clientX;
      startClientY = e.touches[0].clientY;
    } else {
      startClientX = e.clientX;
      startClientY = e.clientY;
    }
    
    activeDragItem = animalCard;
    isDragging = true;
    
    activeDragItem.classList.add('dragging');
    
    cloneElement = document.createElement('div');
    cloneElement.className = 'drag-clone';
    const emojiDiv = animalCard.querySelector('.animal-emoji');
    const nameDiv = animalCard.querySelector('.animal-name');
    cloneElement.innerHTML = `
      <div class="animal-emoji">${emojiDiv ? emojiDiv.innerHTML : '🐾'}</div>
      <div class="animal-name">${nameDiv ? nameDiv.innerText : ''}</div>
    `;
    document.body.appendChild(cloneElement);
    
    const cloneWidth = 110;
    const cloneHeight = 110;
    cloneElement.style.left = `${startClientX - cloneWidth / 2}px`;
    cloneElement.style.top = `${startClientY - cloneHeight / 2}px`;
    cloneElement.style.width = `${animalCard.offsetWidth}px`;
    
    globalMoveHandler = onGlobalMove;
    globalUpHandler = onGlobalUp;
    window.addEventListener('mousemove', globalMoveHandler);
    window.addEventListener('mouseup', globalUpHandler);
    window.addEventListener('touchmove', globalMoveHandler, { passive: false });
    window.addEventListener('touchend', globalUpHandler);
    window.addEventListener('touchcancel', globalUpHandler);
    
    document.body.style.cursor = 'grabbing';
    
    return true;
  }
  
  function attachDragListeners() {
    const animalCards = document.querySelectorAll('.animal-card');
    animalCards.forEach(card => {
      card.removeEventListener('mousedown', onMouseDown);
      card.removeEventListener('touchstart', onTouchStart);
      
      card.addEventListener('mousedown', onMouseDown);
      card.addEventListener('touchstart', onTouchStart, { passive: false });
    });
  }
  
  function onMouseDown(e) {
    const card = e.currentTarget;
    if (card.classList.contains('matched')) return;
    e.preventDefault();
    startDrag(e, card);
  }
  
  function onTouchStart(e) {
    const card = e.currentTarget;
    if (card.classList.contains('matched')) return;
    e.preventDefault();
    startDrag(e, card);
  }
  
  function resetAndNewGame() {
    if (isDragging) {
      cleanupDrag();
    }
    
    stopTimer();
    
    matchedCount = 0;
    matchedStatus.clear();
    isGameActive = true;
    
    currentAnimals = getRandomAnimals();
    
    renderGame(currentAnimals);
    updateMatchCounter();
    hideWinScreen();
    
    const timeoutOverlay = document.querySelector('.timeout-overlay');
    if (timeoutOverlay) timeoutOverlay.remove();
    
    attachDragListeners();
    startTimer();
  }
  
  function startNewGame() {
    currentDifficulty = 'medium';
    updateDifficultyButtons();
    
    currentAnimals = getRandomAnimals();
    
    matchedCount = 0;
    matchedStatus.clear();
    isGameActive = true;
    
    renderGame(currentAnimals);
    updateMatchCounter();
    hideWinScreen();
    
    const timeoutOverlay = document.querySelector('.timeout-overlay');
    if (timeoutOverlay) timeoutOverlay.remove();
    
    createHomeButton();
    createDifficultySelector();
    createTimerDisplay();
    
    attachDragListeners();
    startTimer();
    
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  }
  
  function handlePlayAgain() {
    resetAndNewGame();
  }
  
  playBtn.addEventListener('click', startNewGame);
  restartBtn.addEventListener('click', handlePlayAgain);
  winPlayAgainBtn.addEventListener('click', () => {
    resetAndNewGame();
  });
  
  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      e.preventDefault();
    }
  }, { passive: false });
  
  window.addEventListener('blur', () => {
    if (isDragging) cleanupDrag();
  });
  
  totalCounterSpan.textContent = GAME_SIZE;
  
  console.log("Shadow Match Safari Ready with Medium/Hard Difficulty, Home Button & Timer - Click Play to begin!");
})();