// Game state
let board = ["", "", "", "", "", "", "", "", ""];
let player = "X"; // Human player
let computer = "O"; // AI player
let isGameOver = false;
let computerStarts = false; // Set this to true if the computer should start first

// Add event listeners to cells
const cells = document.querySelectorAll(".cell");
cells.forEach((cell) => cell.addEventListener("click", playerMove));

const message = document.getElementById("message");
const retryBtn = document.getElementById("retry-btn");
retryBtn.addEventListener("click", resetGame);

// Player's move
function playerMove(e) {
    let id = e.target.id;

    // Check if the cell is already occupied or game is over
    if (board[id] !== "" || isGameOver) {
        return;
    }

    board[id] = player;
    renderBoard();

    if (checkWinner(board, player)) {
        message.textContent = "You win!";
        endGame();
    } else if (isBoardFull(board)) {
        message.textContent = "It's a draw!";
        endGame();
    } else {
        setTimeout(() => computerMove(), 500); // Delay computer's move for a better UX
    }
}

// AI move using Min-Max Algorithm
function computerMove() {
    let bestMove = minMax(board, computer);
    board[bestMove.index] = computer;
    renderBoard();

    if (checkWinner(board, computer)) {
        message.textContent = "Computer wins!";
        endGame();
    } else if (isBoardFull(board)) {
        message.textContent = "It's a draw!";
        endGame();
    }
}

// Min-Max Algorithm
function minMax(newBoard, playerTurn) {
    let availableSpots = getAvailableSpots(newBoard);

    if (checkWinner(newBoard, player)) {
        return { score: -10 };
    } else if (checkWinner(newBoard, computer)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = playerTurn;

        if (playerTurn === computer) {
            let result = minMax(newBoard, player);
            move.score = result.score;
        } else {
            let result = minMax(newBoard, computer);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (playerTurn === computer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
}

// Check if the board is full
function isBoardFull(board) {
    return board.every((cell) => cell !== "");
}

// Check if there is a winner
function checkWinner(board, playerTurn) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winPatterns.some((pattern) =>
        pattern.every((index) => board[index] === playerTurn)
    );
}

// Get available spots on the board
function getAvailableSpots(board) {
    return board
        .map((cell, index) => (cell === "" ? index : null))
        .filter((val) => val !== null);
}

// Render the board to the UI
function renderBoard() {
    board.forEach((mark, index) => {
        cells[index].textContent = mark;
    });
}

// End the game and show the retry button
function endGame() {
    isGameOver = true;
    retryBtn.style.display = "block";
}

// Reset the game
function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    isGameOver = false;
    message.textContent = "";
    retryBtn.style.display = "none";
    renderBoard();

    // If the computer starts, trigger its move
    if (computerStarts) {
        setTimeout(() => computerMove(), 500);
    }
}

// Initialize game and make the computer play first if computerStarts is true
if (computerStarts) {
    setTimeout(() => computerMove(), 500);
}
