
const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let gameBoard = [];
let gameActive = true;
let scores = { player1: 0, player2: 0 };


const gameBoardElement = document.getElementById('game-board');
const gameStatusElement = document.getElementById('game-status');
const player1Element = document.getElementById('player1');
const player2Element = document.getElementById('player2');
const turnIndicator1 = document.getElementById('turn-indicator1');
const turnIndicator2 = document.getElementById('turn-indicator2');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const restartButton = document.getElementById('restart-btn');
const resetScoreButton = document.getElementById('reset-score-btn');
const gameOverModal = document.getElementById('game-over-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const playAgainButton = document.getElementById('play-again-btn');
const closeModalButton = document.getElementById('close-modal-btn');
const closeModalX = document.getElementById('close-modal');
const columnIndicators = document.querySelectorAll('.column-indicator');


function initGame() {
   
    gameBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    
    gameBoardElement.innerHTML = '';
    

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('click', () => handleCellClick(col));
            
            gameBoardElement.appendChild(cell);
        }
    }
    
    
    currentPlayer = 1;
    gameActive = true;
    
   
    updateGameStatus();
    updatePlayerIndicators();
    

    columnIndicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const col = parseInt(indicator.dataset.col);
            handleCellClick(col);
        });
    });
}


function handleCellClick(col) {
    if (!gameActive) return;
    
    
    for (let row = ROWS - 1; row >= 0; row--) {
        if (gameBoard[row][col] === 0) {
           
            gameBoard[row][col] = currentPlayer;
            
         
            updateBoardUI();
            
          
            if (checkWin(row, col)) {
                gameActive = false;
                updateScores();
                showGameOverModal(`Player ${currentPlayer} wins!`);
                return;
            }
            
            if (checkDraw()) {
                gameActive = false;
                showGameOverModal("It's a draw!");
                return;
            }
            
            
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateGameStatus();
            updatePlayerIndicators();
            return;
        }
    }
    
    
    if (gameBoard[0][col] !== 0) {
        gameStatusElement.textContent = `Column ${col + 1} is full! Try another column.`;
        setTimeout(() => updateGameStatus(), 1500);
    }
}

function updateBoardUI() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const cellValue = gameBoard[row][col];
        
       
        cell.classList.remove('red', 'yellow', 'winning');
        
        
        if (cellValue === 1) {
            cell.classList.add('red');
        } else if (cellValue === 2) {
            cell.classList.add('yellow');
        }
    });
}


function updateGameStatus() {
    if (gameActive) {
        gameStatusElement.textContent = `Player ${currentPlayer}'s Turn`;
        gameStatusElement.style.color = currentPlayer === 1 ? '#ff416c' : '#ffeb3b';
    }
}


function updatePlayerIndicators() {
    if (currentPlayer === 1) {
        player1Element.classList.add('active');
        player2Element.classList.remove('active');
        turnIndicator1.textContent = 'YOUR TURN';
        turnIndicator2.textContent = 'WAITING';
    } else {
        player1Element.classList.remove('active');
        player2Element.classList.add('active');
        turnIndicator1.textContent = 'WAITING';
        turnIndicator2.textContent = 'YOUR TURN';
    }
}


function checkWin(row, col) {
    const player = gameBoard[row][col];
    
  
    let count = 0;
    for (let c = 0; c < COLS; c++) {
        count = gameBoard[row][c] === player ? count + 1 : 0;
        if (count >= 4) {
            highlightWinningCells(row, c - 3, row, c, 'horizontal');
            return true;
        }
    }
    
    
    count = 0;
    for (let r = 0; r < ROWS; r++) {
        count = gameBoard[r][col] === player ? count + 1 : 0;
        if (count >= 4) {
            highlightWinningCells(r - 3, col, r, col, 'vertical');
            return true;
        }
    }
    
    
    count = 0;
    let startRow = row - Math.min(row, col);
    let startCol = col - Math.min(row, col);
    
    for (let r = startRow, c = startCol; r < ROWS && c < COLS; r++, c++) {
        count = gameBoard[r][c] === player ? count + 1 : 0;
        if (count >= 4) {
            highlightWinningCells(r - 3, c - 3, r, c, 'diagonal-down');
            return true;
        }
    }
    
   
    count = 0;
    startRow = row + Math.min(ROWS - 1 - row, col);
    startCol = col - Math.min(ROWS - 1 - row, col);
    
    for (let r = startRow, c = startCol; r >= 0 && c < COLS; r--, c++) {
        count = gameBoard[r][c] === player ? count + 1 : 0;
        if (count >= 4) {
            highlightWinningCells(r + 3, c - 3, r, c, 'diagonal-up');
            return true;
        }
    }
    
    return false;
}

// Highlight winning cells
function highlightWinningCells(startRow, startCol, endRow, endCol, direction) {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        
        let isWinning = false;
        
        if (direction === 'horizontal') {
            isWinning = (row === startRow && col >= startCol && col <= endCol);
        } else if (direction === 'vertical') {
            isWinning = (col === startCol && row >= startRow && row <= endRow);
        } else if (direction === 'diagonal-down') {
            const diff = row - startRow;
            isWinning = (row >= startRow && row <= endRow && 
                        col >= startCol && col <= endCol && 
                        row - startRow === col - startCol);
        } else if (direction === 'diagonal-up') {
            const diff = startRow - row;
            isWinning = (row <= startRow && row >= endRow && 
                        col >= startCol && col <= endCol && 
                        startRow - row === col - startCol);
        }
        
        if (isWinning) {
            cell.classList.add('winning');
        }
    });
}


function checkDraw() {
   
    for (let col = 0; col < COLS; col++) {
        if (gameBoard[0][col] === 0) {
            return false;
        }
    }
    return true;
}


function updateScores() {
    if (currentPlayer === 1) {
        scores.player1++;
        score1Element.textContent = scores.player1;
    } else {
        scores.player2++;
        score2Element.textContent = scores.player2;
    }
}


function showGameOverModal(message) {
    modalMessage.textContent = message;
    
    if (message.includes("wins")) {
        modalTitle.textContent = "Congratulations!";
        document.getElementById('winner-icon').innerHTML = '<i class="fas fa-trophy"></i>';
    } else {
        modalTitle.textContent = "Game Over!";
        document.getElementById('winner-icon').innerHTML = '<i class="fas fa-handshake"></i>';
    }
    
    gameOverModal.style.display = 'flex';
}


function closeGameOverModal() {
    gameOverModal.style.display = 'none';
}


function restartGame() {
    closeGameOverModal();
    initGame();
}


function resetScores() {
    if (confirm("Are you sure you want to reset all scores?")) {
        scores = { player1: 0, player2: 0 };
        score1Element.textContent = '0';
        score2Element.textContent = '0';
        restartGame();
    }
}

restartButton.addEventListener('click', restartGame);
resetScoreButton.addEventListener('click', resetScores);
playAgainButton.addEventListener('click', restartGame);
closeModalButton.addEventListener('click', closeGameOverModal);
closeModalX.addEventListener('click', closeGameOverModal);


window.addEventListener('click', (event) => {
    if (event.target === gameOverModal) {
        closeGameOverModal();
    }
});


window.addEventListener('DOMContentLoaded', initGame);


document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    
 
    if (event.key >= '1' && event.key <= '7') {
        const col = parseInt(event.key) - 1;
        handleCellClick(col);
    }
    
    
    if (event.key === 'r' || event.key === 'R') {
        restartGame();
    }
});