import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Snake = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const GRID = 16;
  const GAME_SPEED = 100;
  const NUM_OBSTACLES = 5;

  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: {},
    obstacles: [],
    direction: "right",
    gameLoopInterval: null,
  });

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("snakeHighScore") || 0;
    setHighScore(Number(savedHighScore));

    // Initialize game
    generateFood();
    generateObstacles();

    // Add keyboard controls
    const handleKeyPress = (e) => {
      if (!gameStarted) {
        if (e.key === "Enter") {
          startGame();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          if (gameStateRef.current.direction !== "down") {
            gameStateRef.current.direction = "up";
          }
          break;
        case "ArrowDown":
          if (gameStateRef.current.direction !== "up") {
            gameStateRef.current.direction = "down";
          }
          break;
        case "ArrowLeft":
          if (gameStateRef.current.direction !== "right") {
            gameStateRef.current.direction = "left";
          }
          break;
        case "ArrowRight":
          if (gameStateRef.current.direction !== "left") {
            gameStateRef.current.direction = "right";
          }
          break;
        case "r":
        case "R":
          if (gameOver) {
            startGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      if (gameStateRef.current.gameLoopInterval) {
        clearInterval(gameStateRef.current.gameLoopInterval);
      }
    };
  }, [gameStarted, gameOver]);

  const generateFood = () => {
    let overlap;
    do {
      overlap = false;
      gameStateRef.current.food = {
        x: Math.floor(Math.random() * (400 / GRID)),
        y: Math.floor(Math.random() * (400 / GRID)),
      };

      // Check overlap with snake
      gameStateRef.current.snake.forEach((segment) => {
        if (
          segment.x === gameStateRef.current.food.x &&
          segment.y === gameStateRef.current.food.y
        ) {
          overlap = true;
        }
      });

      // Check overlap with obstacles
      gameStateRef.current.obstacles.forEach((obstacle) => {
        if (
          obstacle.x === gameStateRef.current.food.x &&
          obstacle.y === gameStateRef.current.food.y
        ) {
          overlap = true;
        }
      });
    } while (overlap);
  };

  const generateObstacles = () => {
    gameStateRef.current.obstacles = [];
    for (let i = 0; i < NUM_OBSTACLES; i++) {
      let obstacle;
      let overlap;
      do {
        overlap = false;
        obstacle = {
          x: Math.floor(Math.random() * (400 / GRID)),
          y: Math.floor(Math.random() * (400 / GRID)),
        };

        // Check overlap with food
        if (
          obstacle.x === gameStateRef.current.food.x &&
          obstacle.y === gameStateRef.current.food.y
        ) {
          overlap = true;
        }

        // Check overlap with snake
        for (let segment of gameStateRef.current.snake) {
          if (segment.x === obstacle.x && segment.y === obstacle.y) {
            overlap = true;
            break;
          }
        }

        // Check overlap with other obstacles
        for (let existingObstacle of gameStateRef.current.obstacles) {
          if (
            existingObstacle.x === obstacle.x &&
            existingObstacle.y === obstacle.y
          ) {
            overlap = true;
            break;
          }
        }
      } while (overlap);
      gameStateRef.current.obstacles.push(obstacle);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(
      gameStateRef.current.food.x * GRID,
      gameStateRef.current.food.y * GRID,
      GRID - 1,
      GRID - 1
    );

    // Draw obstacles
    ctx.fillStyle = "#666666";
    gameStateRef.current.obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x * GRID, obstacle.y * GRID, GRID - 1, GRID - 1);
    });

    // Draw snake
    ctx.fillStyle = "#00ff00";
    gameStateRef.current.snake.forEach((segment) => {
      ctx.fillRect(segment.x * GRID, segment.y * GRID, GRID - 1, GRID - 1);
      ctx.strokeStyle = "#001800";
      ctx.strokeRect(segment.x * GRID, segment.y * GRID, GRID - 1, GRID - 1);
    });
  };

  const checkCollision = (head) => {
    // Check collision with snake body
    for (let i = 1; i < gameStateRef.current.snake.length; i++) {
      if (
        head.x === gameStateRef.current.snake[i].x &&
        head.y === gameStateRef.current.snake[i].y
      ) {
        return true;
      }
    }
    return false;
  };

  const checkObstacleCollision = (head) => {
    return gameStateRef.current.obstacles.some(
      (obstacle) => head.x === obstacle.x && head.y === obstacle.y
    );
  };

  const update = () => {
    if (gameOver) {
      clearInterval(gameStateRef.current.gameLoopInterval);
      return;
    }

    const head = {
      x: gameStateRef.current.snake[0].x,
      y: gameStateRef.current.snake[0].y,
    };

    // Update head position based on direction
    switch (gameStateRef.current.direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Check for collisions
    if (
      head.x < 0 ||
      head.x >= 400 / GRID ||
      head.y < 0 ||
      head.y >= 400 / GRID ||
      checkCollision(head) ||
      checkObstacleCollision(head)
    ) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("snakeHighScore", score);
      }
      return;
    }

    // Add new head
    gameStateRef.current.snake.unshift(head);

    // Check if food is eaten
    if (
      head.x === gameStateRef.current.food.x &&
      head.y === gameStateRef.current.food.y
    ) {
      setScore((prev) => prev + 1);
      generateFood();
      generateObstacles(); // Regenerate obstacles after food is eaten
    } else {
      gameStateRef.current.snake.pop();
    }

    draw();
  };

  const startGame = () => {
    gameStateRef.current.snake = [{ x: 10, y: 10 }];
    gameStateRef.current.direction = "right";
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    generateFood();
    generateObstacles();
    if (gameStateRef.current.gameLoopInterval) {
      clearInterval(gameStateRef.current.gameLoopInterval);
    }
    gameStateRef.current.gameLoopInterval = setInterval(update, GAME_SPEED);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Snake</h1>
      </div>
      <div className="game-content">
        <div className="snake-game">
          <div className="game-stats">
            <div className="stat">
              <span>Score:</span>
              <span>{score}</span>
            </div>
            <div className="stat">
              <span>High Score:</span>
              <span>{highScore}</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="game-canvas"
          />

          {!gameStarted && !gameOver && (
            <div className="start-screen">
              <h2>Press Enter to Start</h2>
              <p>Use arrow keys to control the snake</p>
              <p>Avoid obstacles and don't hit the walls!</p>
            </div>
          )}

          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>
              <button onClick={startGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}

          <div className="controls-info">
            <p>Controls: Arrow Keys</p>
            <p>Press R to restart after game over</p>
          </div>

          <div className="button-group">
            <Link to="/" className="back-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snake;
