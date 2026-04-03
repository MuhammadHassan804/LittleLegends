// english.js - Complete typing game logic with real-time highlighting, WPM, accuracy, progress, sounds & popup

// -------------------  SOUND SYSTEM (Web Audio, no external) -------------------
class TypingSounds {
  constructor() {
    this.audioCtx = null;
    this.enabled = true;
    this.initAudioOnFirstInteraction();
  }

  initAudioOnFirstInteraction() {
    const resumeAudio = () => {
      if (this.audioCtx === null) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('keydown', resumeAudio);
  }

  playBeep(type) {
    if (!this.enabled) return;
    try {
      if (this.audioCtx === null) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      if (type === 'correct') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      } else if (type === 'error') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
      } else if (type === 'success') {
        // happy chord: two beeps fast
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc.frequency.setValueAtTime(880, now);
        osc2.frequency.setValueAtTime(1100, now);
        gain.gain.setValueAtTime(0.12, now);
        gain2.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc2.start();
        osc2.stop(now + 0.25);
        osc.start();
        osc.stop(now + 0.25);
        return;
      }
      osc.start();
      osc.stop(now + 0.2);
    } catch(e) { console.log("sound error", e); }
  }
}

const soundManager = new TypingSounds();

// -------------------  PARAGRAPH DATABASE (simple, kid-friendly) -------------------
const paragraphsList = [
  "My name is Sara. I like to play.",
  "I go to school every day.",
  "The sun is bright. I am happy.",
  "I have a red ball. It is fun.",
  "My cat is small and cute.",
  "I like to read books.",
  "We eat good food together.",
  "My friend Ali is kind.",
  "Look at the big blue sky.",
  "I love my family very much."
];

// -------------------  GLOBAL VARIABLES -------------------
let currentParagraph = "";            // plain target string
let currentTyped = "";               // current input
let startTime = null;                // timestamp when first character typed (for WPM)
let totalCharsTyped = 0;             // total keystrokes (for accuracy)
let totalCorrectChars = 0;
let gameActive = true;
let currentCompletionFlag = false;    // avoid multiple popups

// DOM elements
const targetParagraphDiv = document.getElementById("targetParagraph");
const typingInput = document.getElementById("typingInput");
const restartBtn = document.getElementById("restartBtn");
const wpmSpan = document.getElementById("wpmValue");
const accuracySpan = document.getElementById("accuracyValue");
const progressFill = document.getElementById("progressFill");
const popupOverlay = document.getElementById("successPopup");
const popupMessageSpan = document.getElementById("popupMessage");
const closePopupBtn = document.getElementById("closePopupBtn");

// Array of success messages
const successMessages = [
  "Great Job! 🎉", "Well Done! 👏", "Awesome! 🌟", 
  "Perfect! 🎈", "You're a star! ⭐", "Super Typist! 🚀"
];

// -------------------  HELPER: get random paragraph -------------------
function getRandomParagraph() {
  const randomIndex = Math.floor(Math.random() * paragraphsList.length);
  return paragraphsList[randomIndex];
}

// -------------------  UPDATE STATS: WPM, ACCURACY, PROGRESS -------------------
function updateStats() {
  // Accuracy calculation
  let accuracy = 100;
  if (totalCharsTyped > 0) {
    accuracy = (totalCorrectChars / totalCharsTyped) * 100;
  }
  accuracy = Math.min(100, Math.max(0, accuracy));
  accuracySpan.innerText = Math.floor(accuracy);
  
  // WPM: (correct chars / 5) per minute, based on time since first typed char
  let wpm = 0;
  if (startTime !== null && totalCorrectChars > 0) {
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    if (elapsedMinutes > 0) {
      const netChars = totalCorrectChars;
      wpm = Math.floor((netChars / 5) / elapsedMinutes);
      if (wpm > 300) wpm = 300; // sanity
    }
  }
  wpmSpan.innerText = wpm;
  
  // Progress: (correct typed characters length) / total target length
  const targetLen = currentParagraph.length;
  let progressPercent = 0;
  if (targetLen > 0) {
    let matchedLen = 0;
    for (let i = 0; i < currentTyped.length && i < targetLen; i++) {
      if (currentTyped[i] === currentParagraph[i]) matchedLen++;
      else break; // stop at first mismatch? For progress fill we use matched length continuous
    }
    progressPercent = (matchedLen / targetLen) * 100;
  }
  progressFill.style.width = `${progressPercent}%`;
}

// -------------------  HIGHLIGHT LOGIC: update paragraph with spans (green/red) and current position -------------------
function updateHighlighting() {
  const target = currentParagraph;
  const typed = currentTyped;
  const targetLength = target.length;
  let highlightedHTML = "";
  
  for (let i = 0; i < targetLength; i++) {
    const targetChar = target[i];
    let statusClass = "";
    let isCurrent = false;
    
    if (i < typed.length) {
      const typedChar = typed[i];
      if (typedChar === targetChar) {
        statusClass = "highlight-correct";
      } else {
        statusClass = "highlight-wrong";
      }
      // mark current position only if we are exactly at this index and it's the next to type? but we show current marker at mismatch or correct index? 
      // Highlight current editing position (the next character to type) if i === typed.length
    } 
    // The character where user needs to type next (active position)
    if (i === typed.length) {
      isCurrent = true;
    }
    
    let additionalClass = statusClass;
    if (isCurrent && i < targetLength && typed.length <= targetLength) {
      additionalClass += " highlight-current";
    }
    // Escape HTML special chars but keep letters safe; but our characters are safe from paragraphs.
    let displayChar = targetChar === " " ? "&nbsp;" : targetChar;
    if (targetChar === " ") displayChar = "&nbsp;";
    highlightedHTML += `<span class="highlight-letter ${additionalClass}">${displayChar}</span>`;
  }
  
  targetParagraphDiv.innerHTML = highlightedHTML;
}

// -------------------  CHECK COMPLETION (if typed exactly matches full paragraph) -------------------
function checkCompletion() {
  if (currentCompletionFlag) return; // already showing popup
  if (currentTyped === currentParagraph && currentParagraph.length > 0) {
    // success! paragraph fully typed correctly
    currentCompletionFlag = true;
    // play success sound
    soundManager.playBeep("success");
    // random success message
    const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
    popupMessageSpan.innerText = randomMsg;
    popupOverlay.classList.add("active");
    // disable input? but keep, but after popup closed we reset to new paragraph
    typingInput.disabled = true;
  }
}

// -------------------  UPDATE TYPING: process input, update stats, highlighting, sounds -------------------
function processTyping(e) {
  if (currentCompletionFlag) return;
  const inputValue = typingInput.value;
  const oldTyped = currentTyped;
  currentTyped = inputValue;
  
  // Initialize timer on first character typed (for WPM)
  if (startTime === null && currentTyped.length > 0) {
    startTime = Date.now();
  }
  
  // Update stats based on comparison with target paragraph
  const target = currentParagraph;
  const newTypedLen = currentTyped.length;
  const oldLen = oldTyped.length;
  
  // track keystrokes and correct counts
  // we need to recalc totalCharsTyped and correct from scratch based on currentTyped vs target? Simpler incremental:
  // But to keep accuracy robust, we recompute total correct characters based on currentTyped & target.
  let correctCount = 0;
  for (let i = 0; i < currentTyped.length && i < target.length; i++) {
    if (currentTyped[i] === target[i]) correctCount++;
  }
  // Total typed characters = currentTyped.length
  totalCharsTyped = currentTyped.length;
  totalCorrectChars = correctCount;
  
  // Play sounds: if new character typed compare last char
  if (currentTyped.length > oldLen && currentTyped.length > 0) {
    const lastIndex = currentTyped.length - 1;
    if (lastIndex < target.length && currentTyped[lastIndex] === target[lastIndex]) {
      soundManager.playBeep("correct");
    } else if (lastIndex < target.length) {
      soundManager.playBeep("error");
    } else if (lastIndex >= target.length) {
      soundManager.playBeep("error");
    }
  } else if (currentTyped.length < oldLen && currentTyped.length >= 0) {
    // backspace - optional small feedback (no sound or silent)
  }
  
  // Update UI highlighting
  updateHighlighting();
  updateStats();
  
  // Check if the paragraph is fully and correctly completed
  checkCompletion();
}

// -------------------  RESET / LOAD NEW PARAGRAPH -------------------
function loadNewParagraph(resetStatsAndTimer = true) {
  // hide popup if active
  popupOverlay.classList.remove("active");
  currentCompletionFlag = false;
  typingInput.disabled = false;
  
  // get new paragraph (different from current maybe)
  let newPara = getRandomParagraph();
  if (newPara === currentParagraph && paragraphsList.length > 1) {
    while (newPara === currentParagraph) newPara = getRandomParagraph();
  }
  currentParagraph = newPara;
  currentTyped = "";
  typingInput.value = "";
  
  if (resetStatsAndTimer) {
    startTime = null;
    totalCharsTyped = 0;
    totalCorrectChars = 0;
  } else {
    // keep but we want fresh start always on restart
    startTime = null;
    totalCharsTyped = 0;
    totalCorrectChars = 0;
  }
  
  // re-render initial highlighting (no typed chars)
  updateHighlighting();
  updateStats();
  typingInput.focus();
}

// -------------------  RESTART GAME (New Paragraph) -------------------
function restartGame() {
  loadNewParagraph(true);
  // reset completion flag and enable input again
  currentCompletionFlag = false;
  typingInput.disabled = false;
  // Also reset popup active
  popupOverlay.classList.remove("active");
}

// -------------------  CLOSE POPUP AND LOAD NEXT PARAGRAPH -------------------
function closePopupAndNext() {
  popupOverlay.classList.remove("active");
  // load new paragraph
  loadNewParagraph(true);
  typingInput.disabled = false;
  currentCompletionFlag = false;
  typingInput.focus();
}

// -------------------  EVENT LISTENERS & INITIALIZE -------------------
function initGame() {
  // initial random paragraph
  currentParagraph = getRandomParagraph();
  currentTyped = "";
  typingInput.value = "";
  startTime = null;
  totalCharsTyped = 0;
  totalCorrectChars = 0;
  currentCompletionFlag = false;
  typingInput.disabled = false;
  updateHighlighting();
  updateStats();
  
  typingInput.addEventListener("input", processTyping);
  restartBtn.addEventListener("click", () => {
    restartGame();
  });
  closePopupBtn.addEventListener("click", closePopupAndNext);
  
  // focus input on page load / click anywhere
  typingInput.focus();
  // Also ensure clicking container focuses input
  document.body.addEventListener("click", () => {
    if (!currentCompletionFlag && typingInput.disabled === false) {
      typingInput.focus();
    }
  });
}

// start everything when DOM ready
document.addEventListener("DOMContentLoaded", initGame);