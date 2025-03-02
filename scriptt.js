window.onload = function() {
    // Check if returning from completed level
    const urlParams = new URLSearchParams(window.location.search);
    const levelCompleted = urlParams.get('levelCompleted');
    
    if (levelCompleted) {
        console.log("Returned from completed level:", levelCompleted);
        // Show the levels container instead of the start button
        document.querySelector('.start-btn-container').style.display = 'none';
        document.getElementById('levelsContainer').style.display = 'flex';
          // Update progress
    let progress = JSON.parse(localStorage.getItem('cyberHeistProgress') || '{"levelsCompleted":[false,false,false]}');
    progress.levelsCompleted[parseInt(levelCompleted) - 1] = true;
    localStorage.setItem('cyberHeistProgress', JSON.stringify(progress));
    
    // Refresh the UI based on this progress
    loadProgress();
  }
};
       
// Show levels
function showLevels() {
    document.querySelector('.start-btn-container').style.display = 'none';
    document.getElementById('levelsContainer').style.display = 'flex';
}

// Open modals
function openExitModal() {
    document.getElementById('exitModal').style.display = 'flex';
}

function openInstructionsModal() {
    document.getElementById('instructionsModal').style.display = 'flex';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Exit game
function exitGame() {
    window.location.href = "about:blank"; // This will work as a demo
}

// Start level
function startLevel(level) {
    // In a real implementation, this would navigate to the specific level
    // For demo purposes, we'll just show a completion popup after a delay
    setTimeout(() => {
        document.getElementById('congratsModal').style.display = 'flex';
        currentLevel = level;
    }, 2000);
    if (level === 1) {
        // Navigate to Spam Defender page
        window.location.href = "level1.html";
    } else if (level === 2) {
        // Navigate to Level 2 page 
        window.location.href = "level2.html";
    } else if (level === 3) {
        // Navigate to Level 3 page 
        window.location.href = "level3.html";
    }
}

// Track current level
let currentLevel = 0;

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal, .congrats-modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
// This function runs when the index page loads
window.addEventListener('DOMContentLoaded', function() {
    // Load progress from localStorage
    loadProgress();
    
    // Set up event listeners for the continue button if we're on a level page
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            // This will navigate back to the main page
            // The loadProgress function will handle unlocking the next level
        });
    }
});

// Load saved progress and update UI accordingly
function loadProgress() {
    const savedProgress = localStorage.getItem('cyberHeistProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Unlock levels based on completed status
        progress.levelsCompleted.forEach((completed, index) => {
            if (completed) {
                const levelNumber = index + 1;
                // If we've completed a level, unlock the next one (if it exists)
                if (levelNumber < 3) {
                    const nextLevelBox = document.getElementById(`level${levelNumber + 1}Box`);
                    const nextLevelBtn = document.getElementById(`level${levelNumber + 1}Btn`);
                    
                    if (nextLevelBox && nextLevelBtn) {
                        // Remove locked class
                        nextLevelBox.classList.remove('level-locked');
                        
                        // Update button
                        nextLevelBtn.textContent = 'PLAY';
                        nextLevelBtn.removeAttribute('disabled');
                    }
                }
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Check localStorage for level progress
    let progress = JSON.parse(localStorage.getItem('cyberHeistProgress') || '{"levelsCompleted":[false,false,false]}');
    console.log("Loaded progress:", progress);
    
    // Unlock levels based on saved progress
    progress.levelsCompleted.forEach((completed, index) => {
        if (completed) {
            const levelNumber = index + 1;
            console.log("Level " + levelNumber + " is completed");
            
            // If we completed a level, unlock the next one
            if (levelNumber < 3) { // We have 3 levels total
                const nextLevelNumber = levelNumber + 1;
                const nextLevelBox = document.querySelector(`.level-box:nth-child(${nextLevelNumber})`);
                
                if (nextLevelBox) {
                    // Remove locked class
                    nextLevelBox.classList.remove('level-locked');
                    
                    // Update button/link
                    const btn = nextLevelBox.querySelector('.level-btn');
                    if (btn) {
                        btn.textContent = 'PLAY';
                        btn.removeAttribute('disabled');
                        
                        // If it's a link (a tag), ensure it has the correct href
                        if (btn.tagName === 'A') {
                            btn.href = `level${nextLevelNumber}.html`;
                        }
                    }
                    
                    console.log("Unlocked level " + nextLevelNumber);
                }
            }
        }
    });
});