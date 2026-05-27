const board = document.getElementById("board");

const turnText =
    document.getElementById("turn");

const restartBtn =
    document.getElementById("restartBtn");

const redScoreText =
    document.getElementById("redScore");

const yellowScoreText =
    document.getElementById("yellowScore");

const drawScoreText =
    document.getElementById("drawScore");

const popup =
    document.getElementById("winnerPopup");

const winnerMessage =
    document.getElementById("winnerMessage");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const rows = 6;
const cols = 7;

let currentPlayer = "red";

let gameOver = false;

let redScore = 0;
let yellowScore = 0;
let drawScore = 0;

let gameBoard = [];

/* CREATE EMPTY BOARD */

function createBoardArray(){

    gameBoard = [];

    for(let row = 0; row < rows; row++){

        gameBoard[row] = [];

        for(let col = 0; col < cols; col++){

            gameBoard[row][col] = "";
        }
    }
}

createBoardArray();

/* CREATE BOARD UI */

function createBoardUI(){

    board.innerHTML = "";

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;

            cell.addEventListener("click", () => {

                if(
                    !gameOver &&
                    currentPlayer === "red"
                ){
                    placeDisc(col);
                }
            });

            board.appendChild(cell);
        }
    }
}

createBoardUI();

/* PLACE DISC */

function placeDisc(col){

    for(let row = rows - 1; row >= 0; row--){

        if(gameBoard[row][col] === ""){

            gameBoard[row][col] =
                currentPlayer;

            updateBoard();

            if(checkWinner()){

                gameOver = true;

                if(currentPlayer === "red"){

                    redScore++;

                    redScoreText.innerText =
                        redScore;

                    turnText.innerHTML =
                        "🏆 Player Wins!";

                    showWinnerPopup(
                        "🏆 Player Wins!"
                    );
                }

                else{

                    yellowScore++;

                    yellowScoreText.innerText =
                        yellowScore;

                    turnText.innerHTML =
                        "🤖 AI Wins!";

                    showWinnerPopup(
                        "🤖 AI Wins!"
                    );
                }

                return;
            }

            if(checkDraw()){

                gameOver = true;

                drawScore++;

                drawScoreText.innerText =
                    drawScore;

                turnText.innerHTML =
                    "🤝 Match Draw!";

                showWinnerPopup(
                    "🤝 Match Draw!"
                );

                return;
            }

            switchPlayer();

            if(
                currentPlayer === "yellow" &&
                !gameOver
            ){

                turnText.innerHTML =
                    "🤖 AI Thinking...";

                setTimeout(() => {

                    computerMove();

                }, 700);
            }

            return;
        }
    }
}

/* AI MOVE */

function computerMove(){

    let validColumns = [];

    for(let col = 0; col < cols; col++){

        if(gameBoard[0][col] === ""){

            validColumns.push(col);
        }
    }

    if(validColumns.length === 0){

        return;
    }

    const randomCol =
        validColumns[
            Math.floor(
                Math.random() *
                validColumns.length
            )
        ];

    placeDisc(randomCol);
}

/* UPDATE BOARD */

function updateBoard(){

    const cells =
        document.querySelectorAll(".cell");

    cells.forEach(cell => {

        const row = cell.dataset.row;
        const col = cell.dataset.col;

        cell.classList.remove(
            "red",
            "yellow"
        );

        if(gameBoard[row][col] === "red"){

            cell.classList.add("red");

            cell.classList.add("drop");

            setTimeout(() => {

                cell.classList.remove("drop");

            }, 250);
        }

        else if(
            gameBoard[row][col] === "yellow"
        ){

            cell.classList.add("yellow");

            cell.classList.add("drop");

            setTimeout(() => {

                cell.classList.remove("drop");

            }, 250);
        }
    });
}

/* SWITCH PLAYER */

function switchPlayer(){

    if(currentPlayer === "red"){

        currentPlayer = "yellow";
    }

    else{

        currentPlayer = "red";

        turnText.innerHTML =
            "🔴 Your Turn";
    }
}

/* CHECK WINNER */

function checkWinner(){

    const directions = [

        [0,1],
        [1,0],
        [1,1],
        [1,-1]
    ];

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            if(!gameBoard[row][col]) continue;

            for(let [dr,dc] of directions){

                let winningCells = [
                    [row,col]
                ];

                for(let i = 1; i < 4; i++){

                    const r = row + dr * i;
                    const c = col + dc * i;

                    if(
                        r < 0 ||
                        r >= rows ||
                        c < 0 ||
                        c >= cols ||
                        gameBoard[r][c] !==
                        gameBoard[row][col]
                    ){
                        break;
                    }

                    winningCells.push([r,c]);
                }

                if(winningCells.length === 4){

                    highlightWinningCells(
                        winningCells
                    );

                    return true;
                }
            }
        }
    }

    return false;
}

/* HIGHLIGHT WINNING CELLS */

function highlightWinningCells(cells){

    const allCells =
        document.querySelectorAll(".cell");

    cells.forEach(([row,col]) => {

        allCells.forEach(cell => {

            if(
                Number(cell.dataset.row) === row &&
                Number(cell.dataset.col) === col
            ){

                cell.classList.add("win");
            }
        });
    });
}

/* CHECK DRAW */

function checkDraw(){

    for(let row = 0; row < rows; row++){

        for(let col = 0; col < cols; col++){

            if(gameBoard[row][col] === ""){

                return false;
            }
        }
    }

    return true;
}

/* SHOW POPUP */

function showWinnerPopup(message){

    winnerMessage.innerHTML = message;

    popup.classList.remove("hidden");

    confetti({
        particleCount:150,
        spread:80,
        origin:{ y:0.6 }
    });
}

/* RESET ONLY BOARD */

function resetBoard(){

    createBoardArray();

    updateBoard();

    currentPlayer = "red";

    gameOver = false;

    turnText.innerHTML =
        "🔴 Your Turn";

    document
        .querySelectorAll(".cell")
        .forEach(cell => {

            cell.classList.remove("win");
        });
}

/* FULL RESET */

function fullResetGame(){

    resetBoard();

    redScore = 0;
    yellowScore = 0;
    drawScore = 0;

    redScoreText.innerText = 0;
    yellowScoreText.innerText = 0;
    drawScoreText.innerText = 0;
}

/* PLAY AGAIN */

playAgainBtn.addEventListener("click", () => {

    popup.classList.add("hidden");

    resetBoard();
});

/* RESTART BUTTON */

restartBtn.addEventListener("click", () => {

    popup.classList.add("hidden");

    fullResetGame();
});