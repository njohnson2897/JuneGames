import { useState, useEffect } from "react";
import GameContainer from "../components/GameContainer.jsx";
import { Link } from "react-router-dom";

const TwentyFortyEight = () => {
  const [board, setBoard] = useState(Array(16).fill(0));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    initializeBoard();
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const initializeBoard = () => {
    let newBoard = Array(16).fill(0);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
  };

  const addRandomTile = (board) => {
    let emptyTiles = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 0) {
        emptyTiles.push(i);
      }
    }
    if (emptyTiles.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptyTiles.length);
      let tileIndex = emptyTiles[randomIndex];
      board[tileIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const handleKeyDown = (event) => {
    if (!gameOver) {
      let newBoard = [...board];
      let moved = false;
      switch (event.key) {
        case "ArrowUp":
          moved = moveUp(newBoard);
          break;
        case "ArrowDown":
          moved = moveDown(newBoard);
          break;
        case "ArrowLeft":
          moved = moveLeft(newBoard);
          break;
        case "ArrowRight":
          moved = moveRight(newBoard);
          break;
        default:
          break;
      }
      if (moved) {
        addRandomTile(newBoard);
        setBoard(newBoard);
        checkGameOver(newBoard);
      }
    }
  };

  const moveUp = (board) => {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        let currentTile = row * 4 + col;
        if (board[currentTile] !== 0) {
          let targetRow = row - 1;
          while (targetRow >= 0 && board[targetRow * 4 + col] === 0) {
            targetRow--;
          }
          if (
            targetRow >= 0 &&
            board[targetRow * 4 + col] === board[currentTile]
          ) {
            board[targetRow * 4 + col] *= 2;
            board[currentTile] = 0;
            setScore((prevScore) => prevScore + board[targetRow * 4 + col]);
            moved = true;
          } else if (targetRow + 1 !== row) {
            board[(targetRow + 1) * 4 + col] = board[currentTile];
            board[currentTile] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };

  const moveDown = (board) => {
    let moved = false;
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        let currentTile = row * 4 + col;
        if (board[currentTile] !== 0) {
          let targetRow = row + 1;
          while (targetRow < 4 && board[targetRow * 4 + col] === 0) {
            targetRow++;
          }
          if (
            targetRow < 4 &&
            board[targetRow * 4 + col] === board[currentTile]
          ) {
            board[targetRow * 4 + col] *= 2;
            board[currentTile] = 0;
            setScore((prevScore) => prevScore + board[targetRow * 4 + col]);
            moved = true;
          } else if (targetRow - 1 !== row) {
            board[(targetRow - 1) * 4 + col] = board[currentTile];
            board[currentTile] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };

  const moveLeft = (board) => {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        let currentTile = row * 4 + col;
        if (board[currentTile] !== 0) {
          let targetCol = col - 1;
          while (targetCol >= 0 && board[row * 4 + targetCol] === 0) {
            targetCol--;
          }
          if (
            targetCol >= 0 &&
            board[row * 4 + targetCol] === board[currentTile]
          ) {
            board[row * 4 + targetCol] *= 2;
            board[currentTile] = 0;
            setScore((prevScore) => prevScore + board[row * 4 + targetCol]);
            moved = true;
          } else if (targetCol + 1 !== col) {
            board[row * 4 + targetCol + 1] = board[currentTile];
            board[currentTile] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };

  const moveRight = (board) => {
    let moved = false;
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        let currentTile = row * 4 + col;
        if (board[currentTile] !== 0) {
          let targetCol = col + 1;
          while (targetCol < 4 && board[row * 4 + targetCol] === 0) {
            targetCol++;
          }
          if (
            targetCol < 4 &&
            board[row * 4 + targetCol] === board[currentTile]
          ) {
            board[row * 4 + targetCol] *= 2;
            board[currentTile] = 0;
            setScore((prevScore) => prevScore + board[row * 4 + targetCol]);
            moved = true;
          } else if (targetCol - 1 !== col) {
            board[row * 4 + (targetCol - 1)] = board[currentTile];
            board[currentTile] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };

  const checkGameOver = (board) => {
    if (board.includes(2048)) {
      setGameOver(true);
      alert("You win!");
      return;
    }
    for (let i = 0; i < 16; i++) {
      if (board[i] === 0) {
        return;
      }
      if (i % 4 !== 3 && board[i] === board[i + 1]) {
        return;
      }
      if (i < 12 && board[i] === board[i + 4]) {
        return;
      }
    }
    setGameOver(true);
    alert("Game Over!");
  };

  const renderTile = (value, index) => {
    let tileClass = "tile";
    if (value > 0) {
      tileClass += ` tile-${value}`;
    }
    return (
      <div className={tileClass} key={index}>
        {value > 0 ? value : ""}
      </div>
    );
  };

  return (
    <GameContainer>
      <div className="game-2048">
        <div className="game-header">
          <h2>2048</h2>
          <div className="score">Score: {score}</div>
        </div>
        <div className="board">
          {board.map((value, index) => renderTile(value, index))}
        </div>
        {gameOver && <div className="game-over">Game Over!</div>}
        <div className="game-controls">
          <button onClick={initializeBoard} className="restart-button">
            New Game
          </button>
          <Link to="/" className="back-button">
            Back to Games
          </Link>
        </div>
      </div>
    </GameContainer>
  );
};

export default TwentyFortyEight;
