// Game State
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let hasFlippedCard = false;
let moves = 0;
let matches = 0;

// Large pool of 50+ unique child-friendly emojis
const emojiPool = [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯',
    '🦁','🐸','🐵','🐷','🐮','🐔','🐧','🐦','🐤','🦆',
    '🦉','🦋','🐞','🐜','🐝','🪲','🐛','🦗','🪰','🐍',
    '🍎','🍌','🍇','🍓','🍒','🍉','🍊','🍋','🥝','🥭',
    '⭐','🌟','✨','🎈','🎁','🎨','🎪','🎢','🚗','🚙',
    '🚚','🚜','🛸','🎧','🎵','🎤','🎸','🥁','🎲','🧸',
    '🐢','🐙','🦑','🦀','🐡','🐠','🐟','🐬','🐳','🐋',
    '🦓','🦍','🦧','🦘','🦬','🐘','🦒','🐪','🐫','🦙',
    '🌵','🌴','🌳','🌲','🌸','🌼','🌻','🌺','🍀','🍁',
    '🍄','🌍','🌎','🌏','🌙','☀️','⛅','⚡','🔥','💧',
    '🍕','🍔','🍟','🌭','🍿','🥤','🍩','🍪','🎂','🍰',
    '⚽','🏀','🏈','⚾','🎾','🏐','🏓','🏸','🥊','🏆'
];

// DOM Elements
const gameBoard = document.getElementById('gameBoard');
const movesCounter = document.getElementById('moves');
const matchesCounter = document.getElementById('matches');
const winModal = document.getElementById('winModal');
const finalMoves = document.getElementById('finalMoves');
const finalMatches = document.getElementById('finalMatches');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const playAgainBtn = document.getElementById('playAgainBtn');

// Initialize Game
function initGame() {
    cards = [];
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    hasFlippedCard = false;
    moves = 0;
    matches = 0;
    
    // Reset UI
    movesCounter.textContent = '0';
    matchesCounter.textContent = '0';
    winModal.classList.remove('active');
    
    // Generate new random game
    generateNewGame();
}

// Generate completely new random pairs from pool
function generateNewGame() {
    // Pick 10 unique pairs randomly from large pool
    const selectedEmojis = [];
    const availableEmojis = [...emojiPool];
    
    while (selectedEmojis.length < 10) {
        const randomIndex = Math.floor(Math.random() * availableEmojis.length);
        const emoji = availableEmojis.splice(randomIndex, 1)[0];
        selectedEmojis.push(emoji);
    }
    
    // Create 20 cards (10 pairs)
    cards = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    shuffleArray(cards);
    
    // Render board
    renderBoard();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render game board
function renderBoard() {
    gameBoard.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        
        card.innerHTML = `
            <div class="card-front">
                <span>?</span>
            </div>
            <div class="card-back">
                <span>${emoji}</span>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Flip card handler
function flipCard(event) {
    if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }
    
    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    
    secondCard = this;
    moves++;
    movesCounter.textContent = moves;
    
    checkForMatch();
}

// Check if cards match
function checkForMatch() {
    lockBoard = true;
    
    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        disableCards();
        matches++;
        matchesCounter.textContent = matches;
        
        if (matches === 10) {
            setTimeout(showWinModal, 1000);
        }
        
        resetBoard();
        return;
    }
    
    // No match - flip back after delay
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Disable matched cards permanently
function disableCards() {
    firstCard.classList.add('matched', 'locked');
    secondCard.classList.add('matched', 'locked');
}

// Reset board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Show win modal
function showWinModal() {
    finalMoves.textContent = moves;
    finalMatches.textContent = matches;
    winModal.classList.add('active');
}

// Event Listeners
restartBtn.addEventListener('click', initGame);
homeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});
playAgainBtn.addEventListener('click', initGame);

// Close modal on outside click
winModal.addEventListener('click', (e) => {
    if (e.target === winModal) {
        winModal.classList.remove('active');
    }
});

// Prevent clicking same card twice
document.addEventListener('click', (e) => {
    if (e.target.closest('.card') && firstCard === e.target.closest('.card')) {
        e.stopPropagation();
    }
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);