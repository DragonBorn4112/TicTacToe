const myInputs = (() => {
    const inputs = document.querySelectorAll('.form-class');
    const knight = document.querySelector('#form1');
    const dragon = document.querySelector('#form2');
    const originalBodyBackground = document.querySelector('body').style.background;
    const originalWrapperBackground = document.querySelector('.background-wrapper').style.background;
  
    const validateInput = input => {
      if (!input.checkValidity()) {
        input.classList.add('invalid');
        input.classList.remove('valid');
      } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
      }
    };
  
    inputs.forEach(input => {
      input.addEventListener('focusout', () => {
        validateInput(input);
      });
    });

    knight.addEventListener('click', () => {
        document.querySelector('body').style.background = 'url("./castle2.jpg") no-repeat center center fixed';
        document.querySelector('body').style.backgroundSize = "cover";
        document.querySelector('.background-wrapper').style.background = 'url("./knight.gif") no-repeat center center fixed';
        document.querySelector('.background-wrapper').style.backgroundSize = "contain";
    });

    dragon.addEventListener('click', () => {
        document.querySelector('body').style.background = 'url("./sky.jpg") no-repeat center center fixed';
        document.querySelector('body').style.backgroundSize = "cover";
        document.querySelector('.background-wrapper').style.background = 'url("./dragon.gif") no-repeat center center fixed';
        document.querySelector('.background-wrapper').style.backgroundSize = "contain";
    });

    document.addEventListener('click', (event) => {
        const isKnightClicked = knight.contains(event.target);
        const isDragonClicked = dragon.contains(event.target);
        if (!isKnightClicked && !isDragonClicked) {
            document.querySelector('body').style.background = originalBodyBackground;
            document.querySelector('.background-wrapper').style.background = originalWrapperBackground;
        }
    });
})();

const submitForm = (() => {
const form = document.getElementById('my-form');
const frontPage = document.getElementById('front-page');
const mainGame = document.getElementById('main-game');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    document.querySelector('.background-wrapper').setAttribute("hidden", true)
    frontPage.style.display = 'none';
    mainGame.style.display = 'block';
    gameBoard(data);
});
})();

//Front Page END---------------------------------------------

//Main JS START----------------------------------------------

//Gameboard section

const newGame = document.querySelector('#restartBtn');
newGame.addEventListener('click', () => {
  location.reload();
});

const resetGame = document.querySelector('#resetBtn');


const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
]

const initializeVariables = (data) => {
  data.choice = +data.choice;
  data.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  data.player1 = "K";
  data.player2 = "D";
  data.round = 0;
  data.currentPlayer = "K";
  data.gameOver = false;
};

const resetDom = () => {
  document.querySelectorAll('.block').forEach((block) => {
    block.className = "block";
    block.textContent = "";
  });
};

const gameBoardEventListeners = (data) => {
  document.querySelectorAll('.block').forEach((block) => {
    block.addEventListener('click', (event) => {
      playMove(event.target, data);
    });
  });

  resetGame.addEventListener('click', () => {
    initializeVariables(data);
    resetDom();
    adjustDom('display-turn', `${data.player1Name}'s turn`);
  });
};

const gameBoard = (data) => {
  initializeVariables(data);
  adjustDom('display-turn', `${data.player1Name}'s turn`);

  gameBoardEventListeners(data);

  
};

const playMove = (block, data) => {

  //Check if game over
  if(data.gameOver || data.round > 8) {
    return;
  }

  //Check if block us taken
  if(data.board[block.id] === "K" || data.board[block.id] === "D"){
    return;
  }

  //Adjust for player move
  data.board[block.id] = data.currentPlayer;
  block.textContent = data.currentPlayer;
  block.classList.add(data.currentPlayer === "K" ? "player1" : "player2");

  //Increase rounds
  data.round++;

  //Check end conditions
  if(endConditions(data)){
    return;
  }

  //Change current player
  if(data.choice === 0 ){
    changePlayer(data);
  } 
  else if(data.choice === 1) {
    //Easy ai
    //Take turns between player and ai
    easyAiMove(data);
    data.currentPlayer = "K";
  } 
  else if(data.choice === 2) {
    mediumAiMove(data);
    data.currentPlayer = "K";
  }
  else if(data.choice === 3) {
    impAiMove(data);
    changePlayer(data);
    if(endConditions(data)){
      return;
    }
    changePlayer(data);
  }
};

const endConditions = (data) => {
  if(checkWinner(data, data.currentPlayer)){
    let winnerName = data.currentPlayer === "K" ? data.player1Name : data.player2Name;
    adjustDom ("display-turn", winnerName + " has won the game!");
    return true;
  } else if(data.round === 9) {
    adjustDom ("display-turn", "Tie!");
    data.gameOver = true;
    return true;
  }
  return false;
};

const checkWinner = (data, player) => {
  let result = false;
  winningConditions.forEach((condition) => {
    if(
      data.board[condition[0]] === player && 
      data.board[condition[1]] === player &&
      data.board[condition[2]] === player
      ) {
      result = true;
    }
  });
  return result;
};

const adjustDom = (className, textContent) => {
  const elem = document.querySelector(`.${className}`);
  elem.textContent = textContent;
};

const changePlayer = (data) => {
  data.currentPlayer = data.currentPlayer === "K" ? "D" : "K";
  //adjust the dom
  let displayTurnText = data.currentPlayer === "K" ? data.player1Name : data.player2Name;
  adjustDom("display-turn", `${displayTurnText}'s turn`);
};

const easyAiMove = (data) => {

  changePlayer(data);

  data.round++;

  let availableSpaces = data.board.filter(space => space !== "K" && space !== "D");

  let move = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  data.board[move] = data.player2;
  
  setTimeout(() => {
  let block = document.getElementById(`${move}`);
  block.textContent =  data.player2;
  block.classList.add("player2");
  }, 200);

  if(endConditions(data)){
    return;
  }

  changePlayer(data);

};

const mediumAiMove = (data) => {
  changePlayer(data);

  data.round++;

  let availableSpaces = data.board.filter(space => space !== "K" && space !== "D");

  let move;
  if (Math.random() < 0.8) {
    // Choose a random available block 80% of the time
    move = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  } else {
    // Choose the best move 20% of the time
    let bestMove = -1;
    let bestScore = -Infinity;
    for (let i = 0; i < data.board.length; i++) {
      if (data.board[i] !== "K" && data.board[i] !== "D") {
        // Try this move and evaluate the score
        let originalValue = data.board[i];
        data.board[i] = data.player2;
        let score = evaluateBoard(data, data.player2);
        data.board[i] = originalValue;

        // Update the best move
        if (score > bestScore) {
          bestMove = i;
          bestScore = score;
        }
      }
    }
    move = bestMove;
  }

  data.board[move] = data.player2;
  
  setTimeout(() => {
    let block = document.getElementById(`${move}`);
    block.textContent =  data.player2;
    block.classList.add("player2");
  }, 200);

  if(endConditions(data)){
    return;
  }

  changePlayer(data);
};

const evaluateBoard = (data, player) => {
  // Check if the current player has won
  if (checkWinner(data, player)) {
    return 1;
  }

  // Check if the other player has won
  let otherPlayer = player === "K" ? "D" : "K";
  if (checkWinner(data, otherPlayer)) {
    return -1;
  }

  // If the board is full, it's a tie
  if (data.round === 9) {
    return 0;
  }

  // Otherwise, score the board based on the number of possible winning moves
  let score = 0;
  winningConditions.forEach((condition) => {
    let count = 0;
    for (let i = 0; i < 3; i++) {
      let index = condition[i];
      if (data.board[index] === player) {
        count++;
      } else if (data.board[index] === otherPlayer) {
        count = 0;
        break;
      }
    }
    score += count;
  });
  return score;
};

const impAiMove = (data) => {
  data.round++;

  //Best Move 
  const move = minimax(data, "D").index;
  data.board[move] = data.player2;

  let block = document.getElementById(`${move}`);
  block.textContent =  data.player2;
  block.classList.add("player2");

  console.log(move);
};

const minimax = (data, player) => {
  let availableSpaces = data.board.filter((space) => space !== "K" && space !== "D");

  if(checkWinner(data, data.player1)){
   return {
    score: -100
   };
  } else if (checkWinner(data, data.player2)) {
    return {
      score: 100
     };
  } else if(availableSpaces.length === 0){
    return {
      score: 0
     };
  }
  
  const potentialMoves = [];

  //Loop over Open spaces for best move
  for(let i = 0; i < availableSpaces.length; i++) {
    let move = {};
    move.index = data.board[availableSpaces[i]];
    data.board[availableSpaces[i]] = player;
    if(player === data.player2){
      move.score = minimax(data, data.player1).score;
    } else {
      move.score = minimax(data, data.player2).score;
    }

    data.board[availableSpaces[i]] = move.index;

    potentialMoves.push(move);
  };

  let bestMove = 0;
  if(player === data.player2) {
    let bestScore = -10000;
    for(let i = 0;  i < potentialMoves.length; i++){
      if(potentialMoves[i].score > bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for(let i = 0;  i < potentialMoves.length; i++){
      if(potentialMoves[i].score < bestScore) {
        bestScore = potentialMoves[i].score;
        bestMove = i;
      }
    }
  }
  return potentialMoves[bestMove];
};