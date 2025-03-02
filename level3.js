const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const loseScreen = document.getElementById('lose-screen');
const congratsPopup = document.getElementById('congrats-popup');

const startButton = document.getElementById('start-button');
const playAgainWin = document.getElementById('play-again-win');
const playAgainLose = document.getElementById('play-again-lose');
const continueButton = document.getElementById('continue-button');

const timerDisplay = document.getElementById('timer-value');
const puzzlesSolvedDisplay = document.getElementById('puzzles-solved');
const locks = document.querySelectorAll('.lock');
const logsContainer = document.getElementById('logs');
const hackerAttack = document.getElementById('hacker-attack');

const sequencePuzzle = document.getElementById('sequence-puzzle');
const memoryPuzzle = document.getElementById('memory-puzzle');
const mismatchPuzzle = document.getElementById('mismatch-puzzle');
const phishingPuzzle = document.getElementById('phishing-puzzle');

const sequenceDisplay = document.getElementById('sequence-display');
const sequenceOptions = document.getElementById('sequence-options');

const memoryDisplay = document.getElementById('memory-display');
const memoryInput = document.getElementById('memory-input');
const memorySubmit = document.getElementById('memory-submit');

const codeContainer = document.getElementById('code-container');

const phishingDecline = document.getElementById('phishing-decline');
const phishingAccept = document.getElementById('phishing-accept');
const phishingIp = document.getElementById('phishing-ip');
const phishingAuth = document.getElementById('phishing-auth');

const hintButton = document.getElementById('hint-button');
const hintTooltip = document.getElementById('hint-tooltip');

// Game state
let gameTimer;
let timeRemaining = 60;
let puzzlesSolved = 0;
let locksSecured = 0;
let currentPuzzle;
let correctAnswer;
let hackerSpeed = 8000; // Initial hacker attempt speed (ms)
let hackerTimer;
let puzzleDifficulty = 1;
let memoryCode = '';
let hintVisible = false;

// Puzzle hints
const hints = {
    sequence: "Look for a consistent pattern: adding, multiplying, or alternating operations.",
    memory: "Try to break the code into chunks or create a mnemonic to remember it.",
    mismatch: "Compare all codes carefully - look for digits that break the pattern.",
    phishing: "This is a social engineering attack! Real security protocols never ask for emergency transfers."
};

// Event Listeners
startButton.addEventListener('click', startGame);
playAgainWin.addEventListener('click', resetGame);
playAgainLose.addEventListener('click', resetGame);
memorySubmit.addEventListener('click', checkMemoryAnswer);
phishingDecline.addEventListener('click', handlePhishingDecline);
phishingAccept.addEventListener('click', handlePhishingAccept);

hintButton.addEventListener('click', toggleHint);
continueButton.addEventListener('click', closeCongratsPopup);

// Hint functionality
function toggleHint() {
    if (!hintVisible) {
        showHint();
    } else {
        hideHint();
    }
}

function showHint() {
    hintTooltip.textContent = hints[currentPuzzle] || "Complete the puzzle to secure the vault!";
    hintTooltip.classList.add('active');
    hintVisible = true;
    
    // Hide hint after 8 seconds
    setTimeout(hideHint, 8000);
}

function hideHint() {
    hintTooltip.classList.remove('active');
    hintVisible = false;
}

// Confetti effect for win screen
function createConfetti() {
    const confettiCount = 150;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 5) + 's';
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 8000);
    }
}


// Helper function to show a screen
function showScreen(screen) {
    // Hide all screens
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    winScreen.classList.remove('active');
    loseScreen.classList.remove('active');
    
    // Show the target screen
    screen.classList.add('active');
}

// Initialize game
function startGame() {
    showScreen(gameScreen);
    resetGameState();
    startTimer();
    startHackerAttacks();
    showNextPuzzle();
    addLog('system', 'SYSTEM: Game started. Defend the vault!');
    addLog('player', 'YOU: Beginning defense protocols...');
}

function resetGame() {
    showScreen(startScreen);
    clearInterval(gameTimer);
    clearInterval(hackerTimer);
}

function resetGameState() {
    timeRemaining = 60;
    puzzlesSolved = 0;
    locksSecured = 0;
    hackerSpeed = 5000;
    puzzleDifficulty = 1;
    timerDisplay.textContent = timeRemaining;
    puzzlesSolvedDisplay.textContent = puzzlesSolved;
    
    // Reset locks
    locks.forEach(lock => {
        lock.classList.remove('locked', 'unlocked');
    });
    
    // Clear logs
    while (logsContainer.children.length > 2) {
        logsContainer.removeChild(logsContainer.lastChild);
    }
}

function startTimer() {
    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            gameOver('Time ran out! The hacker has broken through your defenses.');
        }
    }, 1000);
}

function startHackerAttacks() {
    clearInterval(hackerTimer);
    hackerTimer = setInterval(() => {
        simulateHackerAttack();
    }, hackerSpeed);
}

function simulateHackerAttack() {
    // Visual effect
    hackerAttack.style.opacity = '1';
    document.getElementById('game-container').classList.add('glitch');
    
    setTimeout(() => {
        hackerAttack.style.opacity = '0';
        document.getElementById('game-container').classList.remove('glitch');
    }, 300);
    
    // Log hacker activity
    const hackActivities = [
        "HACKER: Attempting brute force on lock system...",
        "HACKER: Running dictionary attack against vault security...",
        "HACKER: Deploying exploit code against firewall...",
        "HACKER: Attempting to bypass encryption protocols...",
        "HACKER: Scanning for security vulnerabilities..."
    ];
    
    addLog('hacker', hackActivities[Math.floor(Math.random() * hackActivities.length)]);
    
    // Check if we should increase difficulty
    if (puzzlesSolved >= 3 && hackerSpeed > 3000) {
        hackerSpeed = 3000;
        clearInterval(hackerTimer);
        addLog('hacker', 'HACKER: Increasing attack speed! Deploying advanced tools...');
        startHackerAttacks();
    } else if (puzzlesSolved >= 6 && hackerSpeed > 2000) {
        hackerSpeed = 2000;
        clearInterval(hackerTimer);
        addLog('hacker', 'HACKER: Breaking through first layer defenses! Attack accelerating!');
        startHackerAttacks();
    }
}

// Add a log message
function addLog(type, message) {
    const log = document.createElement('div');
    log.className = `log ${type}`;
    log.textContent = message;
    logsContainer.appendChild(log);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Puzzle generation and management
function showNextPuzzle() {
    // Hide all puzzles
    sequencePuzzle.classList.remove('active');
    memoryPuzzle.classList.remove('active');
    mismatchPuzzle.classList.remove('active');
    phishingPuzzle.classList.remove('active');
    
    // If we've completed enough puzzles and it's the final phase, show phishing puzzle
    if (puzzlesSolved >= 9 && locksSecured >= 2) {
        showPhishingPuzzle();
        return;
    }
    
    // Otherwise show a random puzzle
    const puzzleType = Math.floor(Math.random() * 3);
    
    switch (puzzleType) {
        case 0:
            showSequencePuzzle();
            break;
        case 1:
            showMemoryPuzzle();
            break;
        case 2:
            showMismatchPuzzle();
            break;
    }
}

// Pattern Recognition Puzzle
function showSequencePuzzle() {
    currentPuzzle = 'sequence';
    sequencePuzzle.classList.add('active');
    sequenceDisplay.innerHTML = '';
    sequenceOptions.innerHTML = '';
    
    let sequence;
    let answer;
    
    // Generate sequence based on difficulty
    if (puzzleDifficulty === 1) {
        // Simple arithmetic sequence
        const start = Math.floor(Math.random() * 5) + 1;
        const increment = Math.floor(Math.random() * 3) + 1;
        sequence = [];
        for (let i = 0; i < 4; i++) {
            sequence.push(start + i * increment);
        }
        answer = start + 4 * increment;
    } else if (puzzleDifficulty === 2) {
        // Fibonacci-like or geometric sequence
        const type = Math.random() > 0.5;
        sequence = [];
        if (type) {
            // Fibonacci-like
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + a;
            sequence.push(a, b);
            for (let i = 0; i < 2; i++) {
                sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
            }
            answer = sequence[sequence.length - 1] + sequence[sequence.length - 2];
        } else {
            // Geometric
            const start = Math.floor(Math.random() * 3) + 1;
            const multiplier = Math.floor(Math.random() * 2) + 2;
            let current = start;
            for (let i = 0; i < 4; i++) {
                sequence.push(current);
                current *= multiplier;
            }
            answer = current;
        }
    } else {
        // More complex sequence (alternating operations)
        sequence = [];
        const start = Math.floor(Math.random() * 5) + 1;
        const incr1 = Math.floor(Math.random() * 3) + 1;
        const incr2 = Math.floor(Math.random() * 3) + 1;
        
        let current = start;
        sequence.push(current);
        
        for (let i = 0; i < 3; i++) {
            if (i % 2 === 0) {
                current += incr1;
            } else {
                current *= incr2;
            }
            sequence.push(current);
        }
        
        // Next operation based on pattern
        if (sequence.length % 2 === 0) {
            answer = current + incr1;
        } else {
            answer = current * incr2;
        }
    }
    
    // Display sequence
    sequence.forEach(num => {
        const numEl = document.createElement('div');
        numEl.className = 'sequence-number';
        numEl.textContent = num;
        sequenceDisplay.appendChild(numEl);
    });
    
    // Add question mark for missing number
    const missingEl = document.createElement('div');
    missingEl.className = 'sequence-number';
    missingEl.textContent = '?';
    sequenceDisplay.appendChild(missingEl);
    
    // Generate options (one correct, three wrong)
    correctAnswer = answer;
    const options = [answer];
    
    while (options.length < 4) {
        // Generate believable wrong answers
        const wrongOption = answer + (Math.floor(Math.random() * 10) - 5);
        if (wrongOption !== answer && !options.includes(wrongOption) && wrongOption > 0) {
            options.push(wrongOption);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    // Display options
    options.forEach(opt => {
        const optEl = document.createElement('div');
        optEl.className = 'sequence-number';
        optEl.textContent = opt;
        optEl.addEventListener('click', () => checkSequenceAnswer(opt));
        sequenceOptions.appendChild(optEl);
    });
    
    addLog('system', 'SYSTEM: Pattern recognition challenge activated.');
}

function checkSequenceAnswer(answer) {
    if (answer === correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

// Memory Test Puzzle
function showMemoryPuzzle() {
    currentPuzzle = 'memory';
    memoryPuzzle.classList.add('active');
    memoryDisplay.textContent = '';
    memoryInput.value = '';
    
    // Generate code based on difficulty
    memoryCode = '';
    const codeLength = puzzleDifficulty === 1 ? 4 : (puzzleDifficulty === 2 ? 5 : 6);
    
    for (let i = 0; i < codeLength; i++) {
        memoryCode += Math.floor(Math.random() * 10);
    }
    
    // Display the code
    memoryDisplay.textContent = memoryCode;
    
    // Hide the code after a few seconds (based on difficulty)
    const memoryTime = puzzleDifficulty === 1 ? 5000 : (puzzleDifficulty === 2 ? 4000 : 3000);
    
    setTimeout(() => {
        memoryDisplay.textContent = '******';
    }, memoryTime);
    
    addLog('system', 'SYSTEM: Memory test initiated.');
}

function checkMemoryAnswer() {
    const userAnswer = memoryInput.value;
    
    if (userAnswer === memoryCode) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

// Mismatched Codes Puzzle
function showMismatchPuzzle() {
    currentPuzzle = 'mismatch';
    mismatchPuzzle.classList.add('active');
    codeContainer.innerHTML = '';
    
    // Generate pattern for codes
    let pattern = '';
    for (let i = 0; i < 6; i++) {
        pattern += Math.floor(Math.random() * 10);
    }
    
    // Generate 4 codes that follow the pattern and 1 that doesn't
    const codes = [];
    
    // Create codes that follow pattern
    for (let i = 0; i < 4; i++) {
        codes.push({
            value: pattern,
            isCorrect: false
        });
    }
    
    // Create the mismatched code
    let mismatchCode = '';
    const mismatchPosition = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < 6; i++) {
        if (i === mismatchPosition) {
            // Different digit at this position
            let newDigit = Math.floor(Math.random() * 10);
            while (newDigit.toString() === pattern[i]) {
                newDigit = Math.floor(Math.random() * 10);
            }
            mismatchCode += newDigit;
        } else {
            mismatchCode += pattern[i];
        }
    }
    
    codes.push({
        value: mismatchCode,
        isCorrect: true
    });
    
    // Shuffle the codes
    codes.sort(() => Math.random() - 0.5);
    
    // Display the codes
    codes.forEach((code, index) => {
        const codeEl = document.createElement('div');
        codeEl.className = 'code';
        codeEl.textContent = code.value;
        codeEl.dataset.correct = code.isCorrect;
        codeEl.addEventListener('click', () => checkMismatchAnswer(codeEl));
        codeContainer.appendChild(codeEl);
    });
    
    addLog('system', 'SYSTEM: Code verification challenge loaded.');
}

function checkMismatchAnswer(codeElement) {
    const isCorrect = codeElement.dataset.correct === 'true';
    
    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

// Phishing Challenge
function showPhishingPuzzle() {
    currentPuzzle = 'phishing';
    phishingPuzzle.classList.add('active');
    
    // Generate random IP and auth code
    const randomIP = Math.floor(Math.random() * 255);
    phishingIp.textContent = randomIP;
    
    const authCode = generateRandomAuth();
    phishingAuth.textContent = authCode;
    
    addLog('system', 'SYSTEM: Security verification prompt detected.');
}

function generateRandomAuth() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    // First block
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    result += '-';
    
    // Second block
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

function handlePhishingDecline() {
    // Correct action - decline the phishing attempt
    addLog('player', 'YOU: Suspicious request detected. Transfer declined.');
    handleCorrectAnswer(true); // True indicates this was the final challenge
}

function handlePhishingAccept() {
    // Wrong action - accepted phishing attempt
    addLog('player', 'YOU: Transfer authorized.');
    addLog('hacker', 'HACKER: Access granted! Vault keys obtained.');
    gameOver('You were tricked by a phishing attack! The hacker has stolen the vault keys.');
}

// Handle correct/incorrect answers
function handleCorrectAnswer(isFinal = false) {
    // Update puzzle count
    puzzlesSolved++;
    puzzlesSolvedDisplay.textContent = puzzlesSolved;
    
    // Visual feedback
    document.getElementById('game-container').classList.add('correct-answer');
    setTimeout(() => {
        document.getElementById('game-container').classList.remove('correct-answer');
    }, 500);
    
    // Add time as reward
    timeRemaining += 5;
    timerDisplay.textContent = timeRemaining;
    
    // Log
    addLog('player', 'YOU: Security challenge completed successfully!');
    
    // Increase difficulty after certain number of puzzles
    if (puzzlesSolved === 4) {
        puzzleDifficulty = 2;
        addLog('system', 'SYSTEM: Security protocols increased to level 2.');
    } else if (puzzlesSolved === 7) {
        puzzleDifficulty = 3;
        addLog('system', 'SYSTEM: Maximum security protocols activated!');
    }
    
    // Check if we should lock a vault
    if (puzzlesSolved === 3 && locksSecured < 1) {
        secureLock(0);
    } else if (puzzlesSolved === 6 && locksSecured < 2) {
        secureLock(1);
    } else if (puzzlesSolved === 9 && locksSecured < 3 && !isFinal) {
        // Only secure the final lock if it's not from the phishing challenge
        secureLock(2);
    } else if (isFinal || (puzzlesSolved >= 10 && locksSecured >= 3)) {
        // Win condition
        gameWin();
        return;
    }
    
    // Show next puzzle
    showNextPuzzle();
}

function handleWrongAnswer() {
    // Penalty - lose time
    timeRemaining -= 3;
    timerDisplay.textContent = timeRemaining;
    
    // Visual feedback
    document.getElementById('game-container').classList.add('wrong-answer');
    setTimeout(() => {
        document.getElementById('game-container').classList.remove('wrong-answer');
    }, 500);
    
    // Check for game over
    if (timeRemaining <= 0) {
        gameOver('Time ran out! The hacker has broken through your defenses.');
        return;
    }
    
    // Log
    addLog('player', 'YOU: Security challenge failed! Reinforcing defenses...');
    
    // Show next puzzle
    showNextPuzzle();
}

function secureLock(lockIndex) {
    locks[lockIndex].classList.add('locked');
    locksSecured++;
    
    // Add time bonus for securing a lock
    timeRemaining += 10;
    timerDisplay.textContent = timeRemaining;
    
    // Log
    addLog('system', `SYSTEM: Vault lock ${lockIndex + 1} secured successfully!`);
    addLog('hacker', 'HACKER: NO! They secured another lock!');
}

function gameWin() {
    clearInterval(gameTimer);
    clearInterval(hackerTimer);
    
    // Show confetti
    createConfetti();
    
    // Show congratulations popup
    congratsPopup.classList.add('active');
    
    addLog('system', 'SYSTEM: All vault locks secured! Hacker attack neutralized.');
    addLog('player', 'YOU: Mission accomplished! The vault is secure.');
}

function closeCongratsPopup() {
    congratsPopup.classList.remove('active');
    showScreen(winScreen);
}

function gameOver(message) {
    clearInterval(gameTimer);
    clearInterval(hackerTimer);
    
    document.getElementById('lose-message').textContent = message;
    showScreen(loseScreen);
    
    addLog('system', 'SYSTEM: Critical failure! Vault security compromised.');
}