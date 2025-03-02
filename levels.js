const safeUrlParts = [
    { prefix: "www.", suffix: ".com" },
    { prefix: "app.", suffix: ".org" },
    { prefix: "my.", suffix: ".edu" },
    { prefix: "portal.", suffix: ".gov" },
    { prefix: "login.", suffix: ".net" }
  ];
  
  const safeDomains = [
    "google", "amazon", "facebook", "microsoft", "apple", 
    "github", "linkedin", "twitter", "youtube", "netflix",
    "dropbox", "slack", "zoom", "adobe", "spotify"
  ];
  
  const spamUrlParts = [
    { prefix: "get.", suffix: ".net" },
    { prefix: "free.", suffix: ".xyz" },
    { prefix: "win.", suffix: ".online" },
    { prefix: "claim.", suffix: ".site" },
    { prefix: "verify.", suffix: ".club" }
  ];
  
  const spamDomains = [
    "freemoney", "claimprize", "hotdeals", "giftcard", "discount",
    "verifyaccount", "securityalert", "updateinfo", "loginverify", "passwordreset",
    "winnernotice", "freetickets", "lotterywin", "luckyuser", "instantcash"
  ];
  
  const urlParams = [
    "?token=expired",
    "?account=verify",
    "?session=reset",
    "?offer=limited",
    "?alert=urgent",
    "?claim=now",
    "?prize=waiting",
    "?click=here",
    "?auth=required",
    "?security=breach"
  ];
  
  class Game {
    constructor() {
      this.gameContainer = document.querySelector('.game-container');
      this.startScreen = document.querySelector('.start-screen');
      this.gameOverScreen = document.querySelector('.game-over');
      this.startButton = document.getElementById('start-button');
      this.restartButton = document.getElementById('restart-button');
      this.timerElement = document.querySelector('.timer');
      this.scoreElement = document.getElementById('score');
      this.mistakesElement = document.getElementById('mistakes');
      this.finalScoreElement = document.getElementById('final-score');
      this.finalMistakesElement = document.getElementById('final-mistakes');
      this.timeSurvivedElement = document.getElementById('time-survived');
      this.shields = document.querySelectorAll('.shield');
      
      this.links = [];
      this.gameRunning = false;
      this.timeRemaining = 60;
      this.score = 0;
      this.mistakes = 0;
      this.spamReachedTop = 0;
      this.difficulty = 1;
      this.timerId = null;
      this.linkGenerationSpeed = 2000; // Initial time between new links in ms
      
      this.setupEventListeners();
    }
    
    setupEventListeners() {
      this.startButton.addEventListener('click', () => this.startGame());
      this.restartButton.addEventListener('click', () => this.startGame());
    }
    
    startGame() {
      // Reset game state
      this.timeRemaining = 60;
      this.score = 0;
      this.mistakes = 0;
      this.spamReachedTop = 0;
      this.difficulty = 1;
      this.gameRunning = true;
      this.linkGenerationSpeed = 2000;
      
      // Clear any existing links
      this.links.forEach(link => {
        if (link.element && link.element.parentNode) {
          link.element.parentNode.removeChild(link.element);
        }
      });
      this.links = [];
      
      // Update UI
      this.timerElement.textContent = this.timeRemaining;
      this.scoreElement.textContent = this.score;
      this.mistakesElement.textContent = this.mistakes;
      
      // Reset shields
      this.shields.forEach(shield => {
        shield.classList.remove('shield-lost');
      });
      
      // Hide overlays
      this.startScreen.classList.add('hidden');
      this.gameOverScreen.classList.add('hidden');
      
      // Start game loops
      this.startGameLoop();
      this.startLinkGeneration();
      this.startTimer();
    }
    
    endGame(reason) {
      this.gameRunning = false;
      clearInterval(this.timerId);
      clearTimeout(this.linkGenerationTimeout);
      clearTimeout(this.gameLoopTimeout);
      
      // Update final stats
      this.finalScoreElement.textContent = this.score;
      this.finalMistakesElement.textContent = this.mistakes;
      this.timeSurvivedElement.textContent = 60 - this.timeRemaining;
      
    // Show game over screen if player lost
  if (reason !== "win") {
    this.gameOverScreen.classList.remove('hidden');
  } else {
    // Call completeLevel when player wins
    completeLevel(1);
  }
}
checkWinCondition() {
  // Player wins if they survive for the entire duration (time runs out)
  if (this.timeRemaining <= 0 && this.spamReachedTop < 3 && this.mistakes < 3) {
    this.endGame("win");
  }
}
    startTimer() {
      this.timerId = setInterval(() => {
        this.timeRemaining--;
        this.timerElement.textContent = this.timeRemaining;
        
        // Increase difficulty every 15 seconds
        if (this.timeRemaining % 15 === 0 && this.timeRemaining > 0) {
          this.difficulty += 0.25;
          this.linkGenerationSpeed = Math.max(500, this.linkGenerationSpeed - 300);
        }
        
        if (this.timeRemaining <= 0) {
          this.checkWinCondition(); // Check for win condition 
        }
      }, 1000);
    }
    
    startGameLoop() {
      const gameLoop = () => {
        if (!this.gameRunning) return;
        
        this.updateLinks();
        this.checkCollisions();
        
        this.gameLoopTimeout = setTimeout(gameLoop, 16); // ~60fps
      };
      
      gameLoop();
    }
    
    startLinkGeneration() {
      const generateLinks = () => {
        if (!this.gameRunning) return;
        
        this.generateLink();
        
        this.linkGenerationTimeout = setTimeout(generateLinks, this.linkGenerationSpeed / this.difficulty);
      };
      
      generateLinks();
    }
    
    generateLink() {
      const isSpam = Math.random() < 0.6; // 60% chance of spam
      const isFakeDanger = !isSpam && Math.random() < 0.3 * this.difficulty; // Safe links that look dangerous
      
      let urlText;
      if (isSpam) {
        const spamUrlPart = spamUrlParts[Math.floor(Math.random() * spamUrlParts.length)];
        const spamDomain = spamDomains[Math.floor(Math.random() * spamDomains.length)];
        const param = Math.random() < 0.7 ? urlParams[Math.floor(Math.random() * urlParams.length)] : "";
        urlText = spamUrlPart.prefix + spamDomain + spamUrlPart.suffix + param;
      } else {
        const safeUrlPart = safeUrlParts[Math.floor(Math.random() * safeUrlParts.length)];
        const safeDomain = safeDomains[Math.floor(Math.random() * safeDomains.length)];
        urlText = safeUrlPart.prefix + safeDomain + safeUrlPart.suffix;
      }
      
      // Create link element
      const linkElement = document.createElement('div');
      linkElement.className = `link ${isSpam ? 'spam' : 'safe'}${isFakeDanger ? ' fake-danger' : ''}`;
      
      // Add an icon
      const icon = document.createElement('span');
      icon.className = 'icon';
      icon.textContent = isSpam ? '🔗' : '🔒';
      linkElement.appendChild(icon);
      
      // Add the link text
      const textSpan = document.createElement('span');
      textSpan.textContent = urlText;
      linkElement.appendChild(textSpan);
      
      // Position the link at the bottom of the screen
      const xPos = Math.random() * (window.innerWidth - 250);
      const yPos = window.innerHeight - 50; // Start just above the bottom of the screen
      
      linkElement.style.left = `${xPos}px`;
      linkElement.style.top = `${yPos}px`; // Using top instead of bottom
      
      // Add click handler
      linkElement.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSpam) {
          this.score++;
          this.scoreElement.textContent = this.score;
          this.removeLink(linkElement);
          
          // Remove from the links array
          const index = this.links.findIndex(link => link.element === linkElement);
          if (index !== -1) {
            this.links.splice(index, 1);
          }
        } else {
          this.mistakes++;
          this.mistakesElement.textContent = this.mistakes;
          linkElement.style.opacity = '0.5';
          linkElement.style.pointerEvents = 'none';
          
          // Update shields
          if (this.mistakes <= 3) {
            this.shields[this.mistakes - 1].classList.add('shield-lost');
          }
          
          if (this.mistakes >= 3) {
            this.endGame("mistakes");
          }
        }
      });
      
      // Add to the game container and links array
      this.gameContainer.appendChild(linkElement);
      this.links.push({
        element: linkElement,
        isSpam,
        speed: (1 + Math.random() * 0.5) * this.difficulty,
        position: yPos
      });
    }
    
    updateLinks() {
      for (const link of this.links) {
        if (!link.element) continue;
        
        // Update position (moving upward)
        link.position -= link.speed;
        link.element.style.top = `${link.position}px`;
      }
    }
    
    checkCollisions() {
      for (let i = this.links.length - 1; i >= 0; i--) {
        const link = this.links[i];
        if (!link.element) continue;
        
        const rect = link.element.getBoundingClientRect();
        
        // Check if link has reached the cyber center
        if (rect.top <= 60) { // Cyber center height
          if (link.isSpam) {
            this.spamReachedTop++;
            
            // Update shields
            if (this.spamReachedTop <= 3) {
              this.shields[this.spamReachedTop - 1].classList.add('shield-lost');
            }
            
            if (this.spamReachedTop >= 3) {
              this.endGame("spamReachedTop");
            }
          }
          
          this.removeLink(link.element);
          this.links.splice(i, 1);
        }
      }
    }
    
    removeLink(element) {
      element.style.transition = 'transform 0.2s, opacity 0.2s';
      element.style.transform = 'scale(0)';
      element.style.opacity = '0';
      
      setTimeout(() => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 200);
    }
  }
  
  // Initialize the game when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
  });
// levels.js - Shared game logic for all levels
// This function should be called when a level is completed
function completeLevel(levelNumber) {
  console.log(`Level ${levelNumber} completed!`);
  // Store completion in localStorage
  let progress = JSON.parse(localStorage.getItem('cyberHeistProgress') || '{"levelsCompleted":[false,false,false]}');
  progress.levelsCompleted[levelNumber - 1] = true;
  localStorage.setItem('cyberHeistProgress', JSON.stringify(progress));
  console.log("Saved progress:", progress);

  // Show congratulation modal
    const congratsModal = document.getElementById('congratsModal');
  if (congratsModal) {
      congratsModal.style.display = 'flex';
  } else {
    console.error("Congrats modal not found in the DOM!");
    // Emergency fallback
    setTimeout(() => {
    alert("Congratulations! Level completed!");
    window.location.href = "index.html?levelCompleted=" + levelNumber;
  }, 1000);
}
}
  //LEVEL 2
 
  // Update the victory function in levels.js
function victory() {
  clearInterval(timerInterval);
  gameActive = false;
  
  finalStrengthDisplay.textContent = firewallStrength;
  victoryScreen.classList.remove('hidden');
  
  userInput.disabled = true;
  submitButton.disabled = true;
  
  // Celebration animation
  gameContainer.style.animation = 'celebrate 0.8s ease-in-out 3';
  
  // Add this line to call completeLevel when player wins
  completeLevel(2);
}