let board = [];
let rows 
let columns 

let minesCount 
let minesLocation = [];

let tilesClicked = 0; 
let flagEnabled = false;

let gameOver = false;
let confettiCount = 0

function resetGame(){
    window.location.reload();
}

function selectDifficulty(difficulty) {
    if (difficulty === 'easy') {
        minesCount = 10;
        rows = 8
        columns = 8
        document.getElementById("board").style.width = "400px";
        document.getElementById("board").style.height = "400px";
    } else if (difficulty === 'medium') {
        minesCount = 20;
        rows = 12
        columns = 12
        document.getElementById("board").style.width = "600px";
        document.getElementById("board").style.height = "600px";
    } else if (difficulty === 'hard') {
        minesCount = 40;
        rows = 16
        columns = 16
        document.getElementById("board").style.width = "800px";
        document.getElementById("board").style.height = "800px";
    }

    document.getElementById("difficulty").style.display = "none";
    document.getElementById("content").style.display = "block";
    startGame();
}


function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }


    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);

}

function revealMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1);      
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      

    minesFound += checkTile(r, c-1);        
    minesFound += checkTile(r, c+1);        

    minesFound += checkTile(r+1, c-1);     
    minesFound += checkTile(r+1, c);        
    minesFound += checkTile(r+1, c+1);     

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        board[r][c].innerText = "";
        
        checkMine(r-1, c-1);    
        checkMine(r-1, c);     
        checkMine(r-1, c+1);   

        checkMine(r, c-1);     
        checkMine(r, c+1);      

        checkMine(r+1, c-1);   
        checkMine(r+1, c);      
        checkMine(r+1, c+1);    
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Parabéns!! Nível Concluído";
        gameOver = true;

        if(confettiCount != 0){
            return
        }

        confettiCount = 1
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
